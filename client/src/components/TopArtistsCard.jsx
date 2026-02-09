import React from "react";
import CardRow from "./CardRow";

const TopArtistsCard = ({ topArtists }) => {
    return (
        <>
            <h2 className="text-xl font-semibold border border-transparent pb-2 border-b-white/10">
                Top Artists
            </h2>
            <div className="flex flex-col gap-4 overflow-y-auto text-sm p-1">
                {topArtists.items.map((artist, idx) => (
                    <CardRow
                        image={artist.images[1].url}
                        name={artist.name}
                        link={artist.external_urls.spotify}
                        key={idx}
                    />
                ))}
            </div>
        </>
    );
};

export default TopArtistsCard;
