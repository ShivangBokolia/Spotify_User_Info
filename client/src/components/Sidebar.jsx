import React from "react";

const Sidebar = ({ me, following, playlists, loading }) => {
    return (
        <div className="bg-black my-4">
            <aside className="w-96 h-screen p-4 flex items-center bg-[linear-gradient(to_bottom,#1ed760_1%,#121212_100%)] rounded-2xl">
                {loading && (
                    <div className="text-sm text-gray-500">Loading...</div>
                )}
                {!loading && me?.images?.length > 0 && (
                    <div className="w-full flex flex-col items-center gap-16 text-white">
                        <div className="flex flex-col gap-2 items-center">
                            <img
                                src={me.images[0].url}
                                className="rounded-full w-24"
                            />
                            <h2 className="text-2xl font-bold">
                                {me.display_name}
                            </h2>
                        </div>
                        <div className="flex flex-row gap-16">
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-sm">
                                    {me.followers.total}
                                </p>
                                <p className="text-gray text-sm">Followers</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-sm">
                                    {following.following.length}
                                </p>
                                <p className="text-gray text-sm">Following</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="font-bold text-sm">
                                    {playlists.playlists.length}
                                </p>
                                <p className="text-gray text-sm">Playlists</p>
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default Sidebar;
