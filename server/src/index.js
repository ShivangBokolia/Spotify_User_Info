import dotenv from "dotenv";
import express, { json } from "express";
import axios from "axios";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { stringify } from "querystring";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const { get, post } = axios;

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI,
    FRONTEND_URL,
    SESSION_SECRET,
} = process.env;

const runtimePort = process.env.PORT || PORT || 3000;

const scopes = [
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-follow-read",
    "user-read-recently-played",
    "user-top-read",
    "playlist-read-private",
].join(" ");

// -- MIDDLEWARE --
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    }),
);
app.use(json());
app.use(cookieParser());

app.set("trust proxy", 1); // important on Render/any proxy

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            // In production behind https, cookie should be secure
            secure: process.env.NODE_ENV === "production",
            // If your frontend and backend are SAME domain (recommended), "lax" is perfect.
            // If you ever split domains, you'd need sameSite: "none" + secure: true.
            sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",

            maxAge: 1000 * 60 * 60 * 24, // 1 Day
        },
    }),
);

// Helper to generate random state string
const generateRandomString = (length) => {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// -- ROUTES --

// 1) Login: redirect user to Spotify Authorization page
app.get("/auth/login", (req, res) => {
    const state = generateRandomString(16);
    req.session.oauthState = state;

    const queryParams = stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: scopes,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        state: state,
    });

    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// 2) Callback: Spotify redirects here after user logs in
app.get("/auth/callback", async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.session.oauthState || null;

    if (!state || state !== storedState) {
        return res.redirect(`${FRONTEND_URL}/login?error=state_mismatch`);
    }

    // Clear state
    req.session.oauthState = null;

    const tokenUrl = "https://accounts.spotify.com/api/token";
    const authHeader = Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
    ).toString("base64");
    console.log("Auth Header Built: ", authHeader);

    const payload = stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
    });

    try {
        const tokenRes = await post(tokenUrl, payload, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${authHeader}`,
            },
        });

        const { access_token, refresh_token, expires_in } = tokenRes.data;

        // Store tokens in session
        req.session.accessToken = access_token;
        req.session.refreshToken = refresh_token;
        req.session.tokenExpiresAt = Date.now() + expires_in * 1000;

        // Redirect back to frontend, maybe with a success query param
        res.redirect(`${FRONTEND_URL}/dashboard`);
    } catch (err) {
        console.error(
            "Error exchanging auth code: ",
            err.response?.data || err,
        );
        res.redirect(`${FRONTEND_URL}/login?error=invalid_token`);
    }
});

// -- API ROUTE: --
// 3) Get current user profile
app.get("/api/me", async (req, res) => {
    try {
        if (!req.session.accessToken)
            return res.status(401).json({ error: "Not logged in" });
        const meRes = await get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`,
            },
        });
        res.json(meRes.data);
    } catch (err) {
        console.log("Error fetching /me: ", err.response?.data || err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// 4) Get current user top artists
app.get("/api/top-artists", async (req, res) => {
    try {
        const topArtistsRes = await get(
            "https://api.spotify.com/v1/me/top/artists?time_range=long_term",
            {
                headers: {
                    Authorization: `Bearer ${req.session.accessToken}`,
                },
            },
        );
        res.json(topArtistsRes.data);
    } catch (err) {
        console.log("Error fetching /top-artists: ", err.response?.data || err);
        res.status(500).json({ error: "Failed to fetch top artists" });
    }
});

// 5) Get followed artists
app.get("/api/me/following", async (req, res) => {
    try {
        let all = [];
        let url =
            "https://api.spotify.com/v1/me/following?type=artist&limit=50";
        while (url) {
            const followingRes = await get(url, {
                headers: {
                    Authorization: `Bearer ${req.session.accessToken}`,
                },
            });
            const data = followingRes.data.artists;
            all.push(...data.items);
            url = data.next;
        }

        res.json({ following: all });
    } catch (err) {
        console.log(
            "Error fetching /me/following: ",
            err.response?.data || err,
        );
        res.status(500).json({ error: "Failed to fetch followed artists" });
    }
});

// 6) Get all the playlists
app.get("/api/me/all_playlists", async (req, res) => {
    try {
        let all = [];
        let url = "https://api.spotify.com/v1/me/playlists?limit=50";
        while (url) {
            const playlistRes = await get(url, {
                headers: {
                    Authorization: `Bearer ${req.session.accessToken}`,
                },
            });
            const data = await playlistRes.data;
            all.push(...data.items);
            url = data.next;
        }
        res.json({ playlists: all });
    } catch (err) {
        console.log(
            "Error fetching /me/playlists: ",
            err.response?.data || err,
        );
        res.status(500).json({ error: "Failed to fetch playlists" });
    }
});

// 7) Get current user top tracks
app.get("/api/top-tracks", async (req, res) => {
    try {
        const topTracksRes = await get(
            "https://api.spotify.com/v1/me/top/tracks?time_range=long_term",
            {
                headers: {
                    Authorization: `Bearer ${req.session.accessToken}`,
                },
            },
        );
        res.json(topTracksRes.data);
    } catch (err) {
        console.log("Error fetching /top-tracks: ", err.response?.data || err);
        res.status(500).json({ error: "Failed to fetch top tracks" });
    }
});

// 8) Get current user recently played
app.get("/api/recently-played", async (req, res) => {
    try {
        const recentlyPlayedRes = await get(
            "https://api.spotify.com/v1/me/player/recently-played",
            {
                headers: {
                    Authorization: `Bearer ${req.session.accessToken}`,
                },
            },
        );
        res.json(recentlyPlayedRes.data);
    } catch (err) {
        console.log(
            "Error fetching /recently-played: ",
            err.response?.data || err,
        );
        res.status(500).json({ error: "Failed to fetch recently played" });
    }
});

// --- serve Vite build in production ---
if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // repo/client/dist
    const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");

    app.use(express.static(clientDistPath));

    // SPA fallback
    app.get("*", (req, res) => {
        res.sendFile(path.join(clientDistPath, "index.html"));
    });
}

app.listen(runtimePort, () => {
    console.log(`Backend listening on ${runtimePort}`);
});
