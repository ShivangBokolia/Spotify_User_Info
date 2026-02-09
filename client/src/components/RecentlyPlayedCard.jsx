import React from "react";
import CardRow from "./CardRow";

const RecentlyPlayedCard = ({ recentlyPlayed }) => {
    return (
        <>
            <h2 className="text-xl font-semibold border border-transparent pb-2 border-b-white/10">
                Recently Played Tracks
            </h2>
            <div className="flex flex-col gap-4 overflow-y-auto text-sm p-1">
                {console.log(recentlyPlayed)}
                {recentlyPlayed.items.map((track, idx) => (
                    <CardRow
                        image={track.track.album.images[1].url}
                        name={track.track.name}
                        link={track.track.external_urls.spotify}
                        key={idx}
                    />
                ))}
            </div>
        </>
    );
};

export default RecentlyPlayedCard;
