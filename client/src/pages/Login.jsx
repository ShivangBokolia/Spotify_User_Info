import React from "react";

const Login = () => {
    const error = new URLSearchParams(window.location.search).get("error");

    const login = () => {
        window.location.href = "/auth/login";
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold">Login</h2>
            {error && (
                <p className="text-red-500">
                    Something went wrong: <strong>{error}</strong>
                </p>
            )}

            <button
                onClick={login}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
            >
                Log in with Spotify
            </button>
        </div>
    );
};

export default Login;
