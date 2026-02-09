import React from "react";
import TopArtistsCard from "../components/TopArtistsCard";
import TopTracksCard from "../components/TopTracksCard";
import PlaylistsCard from "../components/PlaylistsCard";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";

const Dashboard = ({
    topArtists,
    topTracks,
    playlists,
    recentlyPlayed,
    loading,
}) => {
    return (
        <div className="h-screen w-full bg-black p-4">
            {loading && (
                <div className="w-full h-screen text-sm text-gray-500 flex items-center justify-center">
                    Loading...
                </div>
            )}
            {!loading && (
                <div className="grid grid-flow-col grid-rows-2 grid-cols-2 gap-4 w-full h-full">
                    <div className="bg-white/10 border-white/30 text-white flex flex-col gap-4 p-4 rounded-2xl">
                        <TopArtistsCard topArtists={topArtists} />
                    </div>
                    <div className="bg-white/10 border-white/30 text-white flex flex-col gap-4 px-4 pt-4 rounded-2xl">
                        <TopTracksCard topTracks={topTracks} />
                    </div>
                    <div className="bg-white/10 border-white/30 text-white flex flex-col gap-4 p-4 rounded-2xl">
                        <PlaylistsCard playlists={playlists} />
                    </div>
                    <div className="bg-white/10 border-white/30 text-white flex flex-col gap-4 px-4 pt-4 rounded-2xl">
                        <RecentlyPlayedCard recentlyPlayed={recentlyPlayed} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
