import React from "react";

const Landing = () => {
    const login = () => {
        window.location.href = "http://127.0.0.1:4000/auth/login";
    };

    return (
        <div className="w-full min-h-screen bg-black flex flex-col justify-center">
            <div className="flex flex-col items-center gap-6">
                <h1 className="text-4xl font-bold">Spotify Dashboard</h1>
                <p className="text-gray-600 max-w-md text-center">
                    Connect your Spotify account to view your top tracks and
                    portfolio.
                </p>
                <button
                    onClick={login}
                    className="px-6 py-3 bg-green text-white rounded-full hover:bg-gray-800 transition"
                >
                    Log in with Spotify
                </button>
            </div>
        </div>
    );
};

export default Landing;
