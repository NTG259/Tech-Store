import React from "react";
import { CATEGORIES } from "../../page/client/constants";

export default function Sidebar({ searchValue, onSearchChange, filters, onFilterChange, onApply }) {
    return (
        <aside className="w-[220px] shrink-0 flex flex-col gap-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Name product"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-400 outline-none focus:border-[#db4444] pr-8"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-bold text-black">Availability</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.availability}
                        onChange={(e) => onFilterChange("availability", e.target.checked)}
                        className="w-4 h-4 accent-[#db4444]"
                    />
                    <span className="text-sm text-black">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.outOfStock}
                        onChange={(e) => onFilterChange("outOfStock", e.target.checked)}
                        className="w-4 h-4 accent-[#db4444]"
                    />
                    <span className="text-sm text-black">Out Of Stock</span>
                </label>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between pb-3">
                    <span className="text-sm font-bold text-black">Category</span>
                </div>
                <div className="flex flex-col gap-3">
                    {CATEGORIES.map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-[#db4444] transition-colors">
                            <input
                                type="radio"
                                name="category"
                                value={cat}
                                checked={filters.category === cat}
                                onChange={(e) => onFilterChange("category", e.target.value)}
                                className="w-4 h-4 accent-[#db4444]"
                            />
                            <span className={`text-sm ${filters.category === cat ? "text-[#db4444] font-medium" : "text-black"}`}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Nút Lọc */}
            <button
                onClick={onApply}
                className="w-full bg-[#db4444] text-white text-sm font-medium py-3 rounded mt-2 hover:bg-[#c03c3c] transition-colors"
            >
                Filter
            </button>
        </aside>
    );
}
