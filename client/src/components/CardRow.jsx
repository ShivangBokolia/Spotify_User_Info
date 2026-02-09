import React from "react";
import Arrow from "../assets/arrow.svg";

const CardRow = ({ image, name, link }) => {
    return (
        <a
            href={link}
            className="flex flex-row rounded-md justify-between items-center hover:bg-white/10 hover:border-white/30 transition-all duration-300 ease-in-out hover:shadow-xl"
        >
            <div className="flex flex-row justify-start gap-4 items-center">
                <img src={image} className="w-8 rounded-full" />
                <p className="">{name}</p>
            </div>
            <img src={Arrow} className="w-4" />
        </a>
    );
};

export default CardRow;
