import React, { useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";

// --- SỬ DỤNG LINK ẢNH ONLINE (KHÔNG CẦN IMPORT FILE LOCAL) ---
const imgChair = "https://placehold.co/400x400/f5f5f5/333333/png?text=Comfort+Chair";
const imgKeyboard = "https://placehold.co/400x400/f5f5f5/333333/png?text=AK-900+Keyboard";
const imgGamepad = "https://placehold.co/400x400/f5f5f5/333333/png?text=HAVIT+Gamepad";
const imgQrcode = "https://placehold.co/100x100/FFFFFF/000000/png?text=QR+Code";
const imgGooglePlay = "https://placehold.co/120x40/000000/FFFFFF/png?text=Google+Play";
const imgAppStore = "https://placehold.co/120x40/000000/FFFFFF/png?text=App+Store";

/* ─────────────── EyeIcon ─────────────── */
function EyeIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    );
}

/* ─────────────── Product Card ─────────────── */
function ProductCard({ image, name, price, showAddToCart }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="flex flex-col items-center gap-3"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image box */}
            <div className="relative bg-[#f5f5f5] rounded w-full h-[250px] overflow-hidden group">
                {/* Eye button */}
                <button className="absolute top-3 right-3 w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors z-10 opacity-0 group-hover:opacity-100">
                    <EyeIcon />
                </button>

                {/* Product image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src={image}
                        alt={name}
                        className="max-h-[200px] max-w-[200px] object-contain group-hover:scale-105 transition-transform"
                    />
                </div>

                {/* Add to Cart hover bar */}
                {showAddToCart && (
                    <button
                        className={`absolute bottom-0 left-0 right-0 bg-black text-white text-base py-2 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Add To Cart
                    </button>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col items-center gap-1 w-full mt-2">
                <p className="text-base text-black font-medium text-center">{name}</p>
                <p className="text-base text-[#db4444] font-medium text-center">{price}</p>
            </div>
        </div>
    );
}

/* ─────────────── Sidebar ─────────────── */
function Sidebar({ searchValue, onSearchChange, filters, onFilterChange, onApply }) {
    return (
        <aside className="w-[220px] shrink-0 flex flex-col gap-6">
            {/* Search */}
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

            {/* Availability */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-sm font-bold text-black">Availability</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.availability}
                        onChange={(e) => onFilterChange("availability", e.target.checked)}
                        className="w-4 h-4 accent-[#db4444]"
                    />
                    <span className="text-sm text-black">
                        Availability <span className="text-[#db4444]">(450)</span>
                    </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.outOfStock}
                        onChange={(e) => onFilterChange("outOfStock", e.target.checked)}
                        className="w-4 h-4 accent-[#db4444]"
                    />
                    <span className="text-sm text-black">
                        Out Of Stock <span className="text-[#db4444]">(18)</span>
                    </span>
                </label>
            </div>

            {/* Category */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between cursor-pointer hover:text-[#db4444]">
                    <span className="text-sm font-medium text-black">Category</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
            </div>

            {/* Colors */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between cursor-pointer hover:text-[#db4444]">
                    <span className="text-sm font-medium text-black">Colors</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
            </div>

            {/* Price Range */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between cursor-pointer hover:text-[#db4444]">
                    <span className="text-sm font-medium text-black">Price Range</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
            </div>

            {/* Filter Button */}
            <button
                onClick={onApply}
                className="w-full bg-[#db4444] text-white text-sm font-medium py-3 rounded mt-2 hover:bg-[#c03c3c] transition-colors"
            >
                Filter
            </button>
        </aside>
    );
}

/* ─────────────── Pagination ─────────────── */
function Pagination({ current, total, onChange }) {
    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            {/* Prev */}
            <button
                onClick={() => onChange(Math.max(1, current - 1))}
                disabled={current === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors border border-transparent hover:border-gray-200"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            {/* Pages */}
            {Array.from({ length: total }).map((_, i) => {
                const page = i + 1;
                return (
                    <button
                        key={page}
                        onClick={() => onChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${page === current
                                ? "bg-[#db4444] text-white shadow-md"
                                : "text-black hover:bg-gray-100 border border-transparent hover:border-gray-200"
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next */}
            <button
                onClick={() => onChange(Math.min(total, current + 1))}
                disabled={current === total}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors border border-transparent hover:border-gray-200"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    );
}



/* ─────────────── Product Data ─────────────── */
const allProducts = [
    { id: 1, name: "HAVIT HV-G92 Gamepad", price: "$120", image: imgGamepad, showAddToCart: false },
    { id: 2, name: "AK-900 Wired Keyboard", price: "$960", image: imgKeyboard, showAddToCart: true },
    { id: 3, name: "S-Series Comfort Chair", price: "$375", image: imgChair, showAddToCart: false },
    { id: 4, name: "HAVIT HV-G92 Gamepad", price: "$120", image: imgGamepad, showAddToCart: false },
    { id: 5, name: "HAVIT HV-G92 Gamepad", price: "$120", image: imgGamepad, showAddToCart: false },
    { id: 6, name: "HAVIT HV-G92 Gamepad", price: "$120", image: imgGamepad, showAddToCart: false },
    { id: 7, name: "HAVIT HV-G92 Gamepad", price: "$120", image: imgGamepad, showAddToCart: false },
    { id: 8, name: "HAVIT HV-G92 Gamepad", price: "$120", image: imgGamepad, showAddToCart: false },
    { id: 9, name: "HAVIT HV-G92 Gamepad", price: "$120", image: imgGamepad, showAddToCart: false },
];

const ITEMS_PER_PAGE = 9;

/* ─────────────── Main Page ─────────────── */
export default function AllProductList() {
    const [search, setSearch] = useState("");
    const [currentPage, setPage] = useState(1);
    const [filters, setFilters] = useState({ availability: false, outOfStock: false });
    const [appliedSearch, setApplied] = useState("");

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        setApplied(search);
        setPage(1);
    };

    /* Simple client-side filter */
    const filtered = allProducts.filter((p) =>
        appliedSearch === "" || p.name.toLowerCase().includes(appliedSearch.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Header />

            {/* Header Điều hướng nhỏ (Breadcrumb) */}
            <div className="max-w-[1170px] mx-auto px-4 mt-10 mb-5 text-sm text-gray-500">
                <a href="#" className="hover:text-black">Home</a> <span className="mx-2">/</span> <span className="text-black">Products</span>
            </div>

            <main className="max-w-[1170px] mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* ── Sidebar ── */}
                    <Sidebar
                        searchValue={search}
                        onSearchChange={setSearch}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApply={handleApply}
                    />

                    {/* ── Product Grid ── */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paged.length > 0 ? (
                                paged.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))
                            ) : (
                                <div className="col-span-3 text-center text-gray-500 py-10">
                                    No products found.
                                </div>
                            )}
                        </div>

                        {/* ── Pagination ── */}
                        {totalPages > 0 && (
                            <Pagination
                                current={currentPage}
                                total={totalPages < 5 ? 5 : totalPages} // Mocking at least 5 pages for UI
                                onChange={setPage}
                            />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}