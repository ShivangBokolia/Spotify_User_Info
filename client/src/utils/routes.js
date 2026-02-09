import { api } from "./api";

export const getMeData = async () => {
    const res = await api.get("/api/me");
    return res.data;
};

export const getFollowingData = async () => {
    const res = await api.get("/api/me/following");
    return res.data;
};

export const getAllPlaylistsData = async () => {
    const res = await api.get("/api/me/all_playlists");
    return res.data;
};

export const getTopArtists = async () => {
    const res = await api.get("/api/top-artists");
    return res.data;
};

export const getTopTracks = async () => {
    const res = await api.get("/api/top-tracks");
    return res.data;
};

export const getRecentlyPlayed = async () => {
    const res = await api.get("/api/recently-played");
    return res.data;
};
