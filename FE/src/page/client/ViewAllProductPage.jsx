import React, { useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import ProductCard from "./ProductCard";
import Sidebar from "../../layout/client/Sidebar";
import Pagination from "../../layout/client/Pagination";
import { allProducts, ITEMS_PER_PAGE } from "./constants";

export default function AllProductList() {
    const [search, setSearch] = useState("");
    const [currentPage, setPage] = useState(1);

    const [filters, setFilters] = useState({ availability: false, outOfStock: false, category: "All" });

    const [appliedFilters, setAppliedFilters] = useState({ search: "", category: "All" });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        setAppliedFilters({ search: search, category: filters.category });
        setPage(1);
    };

    const filtered = allProducts.filter((p) => {
        const matchSearch = appliedFilters.search === "" || p.name.toLowerCase().includes(appliedFilters.search.toLowerCase());
        const matchCategory = appliedFilters.category === "All" || p.category === appliedFilters.category;

        return matchSearch && matchCategory;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Header />

            <div className="max-w-[1170px] mx-auto px-4 mt-10 mb-5 text-sm text-gray-500">
                <a href="/" className="hover:text-black">Home</a> <span className="mx-2">/</span> <span className="text-black">Products</span>
            </div>

            <main className="max-w-[1170px] mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-10">
                    <Sidebar
                        searchValue={search}
                        onSearchChange={setSearch}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApply={handleApply}
                    />

                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paged.length > 0 ? (
                                paged.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))
                            ) : (
                                <div className="col-span-3 text-center text-gray-500 py-20 flex flex-col items-center gap-2">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <p>No products found matching your filters.</p>
                                </div>
                            )}
                        </div>

                        {totalPages > 0 && (
                            <Pagination
                                current={currentPage}
                                total={totalPages}
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