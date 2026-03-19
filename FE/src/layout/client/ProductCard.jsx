import React, { useState } from "react";
import { Link } from "react-router-dom";
import { EyeIcon, CartIcon } from "../../components/icon/icons";

export default function ProductCard({ id, image, name, price, showAddToCart, category }) {
    const [hovered, setHovered] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        alert(`${name} added to cart!`);
        // TODO: Add to cart logic here
    };

    return (
        <div
            className="flex flex-col items-center gap-3"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="relative bg-[#f5f5f5] rounded w-full h-[250px] overflow-hidden group">
                <span className="absolute top-3 left-3 bg-[#db4444] text-white text-[10px] font-bold px-2 py-1 rounded z-10">
                    {category}
                </span>

                <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        to={`/products/${id}`}
                        className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
                    >
                        <EyeIcon />
                    </Link>
                    {showAddToCart && (
                        <button
                            onClick={handleAddToCart}
                            className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
                        >
                            <CartIcon />
                        </button>
                    )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src={image}
                        alt={name}
                        className="max-h-[200px] max-w-[200px] object-contain group-hover:scale-105 transition-transform"
                    />
                </div>
            </div>

            <div className="flex flex-col items-center gap-1 w-full mt-2">
                <p className="text-base text-black font-medium text-center">{name}</p>
                <p className="text-base text-[#db4444] font-medium text-center">{price}</p>
            </div>
        </div>
    );
}
