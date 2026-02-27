import React, { useState } from "react";

export default function ProductCard({ image, discount, name, price, oldPrice, stars, reviews, showAddToCart }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="flex flex-col gap-4 shrink-0"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image box */}
            <div className="relative bg-[#f5f5f5] rounded w-full h-[250px] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src={image}
                        alt={name}
                        className="max-h-[200px] max-w-[200px] object-contain group-hover:scale-105 transition-transform"
                    />
                </div>
                {showAddToCart && (
                    <button
                        className={`absolute bottom-0 left-0 right-0 bg-black text-white text-base py-2 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}
                    >
                        Add To Cart
                    </button>
                )}
            </div>
        </div>
    );
}
