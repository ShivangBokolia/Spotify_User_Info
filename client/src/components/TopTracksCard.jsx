import React from "react";
import CardRow from "./CardRow";

const TopTracksCard = ({ topTracks }) => {
    return (
        <>
            <h2 className="text-xl font-semibold border border-transparent pb-2 border-b-white/10">
                Top Tracks
            </h2>
            <div className="flex flex-col gap-4 overflow-y-auto text-sm p-1">
                {topTracks.items.map((track, idx) => (
                    <CardRow
                        image={track.album.images[1].url}
                        name={track.name}
                        link={track.external_urls.spotify}
                        key={idx}
                    />
                ))}
            </div>
        </>
    );
};

export default TopTracksCard;
