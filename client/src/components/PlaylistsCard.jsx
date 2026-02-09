import React from "react";
import CardRow from "./CardRow";

const PlaylistsCard = ({ playlists }) => {
    return (
        <>
            <h2 className="text-xl font-semibold border border-transparent pb-2 border-b-white/10">
                Your Playlists
            </h2>
            <div className="flex flex-col gap-4 overflow-y-auto text-sm p-1">
                {playlists.playlists.map((playlist, idx) => (
                    <CardRow
                        image={playlist.images[0].url}
                        name={playlist.name}
                        link={playlist.external_urls.spotify}
                        key={idx}
                    />
                ))}
            </div>
        </>
    );
};

export default PlaylistsCard;
