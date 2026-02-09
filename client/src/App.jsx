import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Sidebar from "./components/sidebar";
import { useEffect } from "react";
import { useState } from "react";
import {
    getAllPlaylistsData,
    getFollowingData,
    getMeData,
    getRecentlyPlayed,
    getTopArtists,
    getTopTracks,
} from "./utils/routes";
import Dashboard from "./pages/Dashboard";
import Error404 from "./pages/Error404";

function App() {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const hideSidebar = location.pathname === "/";

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                const res = await getMeData();
                const playlistsRes = await getAllPlaylistsData();
                const followingRes = await getFollowingData();
                const topArtistsRes = await getTopArtists();
                const topTracksRes = await getTopTracks();
                const recentlyPlayedRes = await getRecentlyPlayed();
                setUserData({
                    me: res,
                    playlists: playlistsRes,
                    following: followingRes,
                    topArtists: topArtistsRes,
                    topTracks: topTracksRes,
                    recentlyPlayed: recentlyPlayedRes,
                });
                console.log(setUserData);
            } catch (error) {
                console.error("Sidebar fetch failed: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSidebarData();
    }, []);

    return (
        <div className="flex flex-row bg-black">
            {!hideSidebar && userData && (
                <Sidebar
                    me={userData.me}
                    following={userData.following}
                    playlists={userData.playlists}
                    loading={loading}
                />
            )}
            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <Dashboard
                            topArtists={userData.topArtists}
                            topTracks={userData.topTracks}
                            playlists={userData.playlists}
                            recentlyPlayed={userData.recentlyPlayed}
                            loading={loading}
                        />
                    }
                />
                <Route path="/" element={<Landing />} />
                <Route path="/*" element={<Error404 />} />
            </Routes>
        </div>
    );
}

export default App;
