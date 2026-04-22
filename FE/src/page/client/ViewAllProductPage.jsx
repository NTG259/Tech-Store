import React, { useState, useEffect } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import ProductCard from "./ProductCard";
import Sidebar from "../../layout/client/Sidebar";
import Pagination from "../../layout/client/Pagination";
import { fetchAllProductsAPI } from "../../service/product/api";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

export default function AllProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setPage] = useState(1);

    const [searchDraft, setSearchDraft] = useState("");
    const [filtersDraft, setFiltersDraft] = useState({
        category: "",
        minPrice: "",
        maxPrice: ""
    });

    const [appliedSearch, setAppliedSearch] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: ""
    });

    const loadProducts = async () => {
        setLoading(true);
        try {
            const categoryId = appliedFilters.category || undefined;
            const searchName = appliedSearch || undefined;
            const minPrice = appliedFilters.minPrice || undefined;
            const maxPrice = appliedFilters.maxPrice || undefined;

            const res = await fetchAllProductsAPI(
                currentPage,
                ITEMS_PER_PAGE,
                "PUBLISHED",
                categoryId,
                searchName,
                minPrice,
                maxPrice
            );

            if (res && res.data) {
                setProducts(res.data);
                if (res.meta && res.meta.totalItems !== undefined) {
                    setTotal(res.meta.totalItems);
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        loadProducts();
    }, [currentPage, appliedSearch, appliedFilters]);


    const handleSearchChange = (value) => {
        setSearchDraft(value);
    };

    const handleSearchSubmit = () => {
        setAppliedSearch(searchDraft);
        setPage(1);
    };

    const handleFilterChange = (key, value) => {
        setFiltersDraft((prev) => {
            const newFilters = { ...prev, [key]: value };

            if (key === "category") {
                setAppliedFilters(prevApplied => ({ ...prevApplied, category: value }));
                setPage(1);
            }

            return newFilters;
        });
    };

    const handlePriceSubmit = () => {
        setAppliedFilters(prev => ({
            ...prev,
            minPrice: filtersDraft.minPrice,
            maxPrice: filtersDraft.maxPrice
        }));
        setPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Header />

            <div className="max-w-[1170px] mx-auto px-4 mt-10 mb-5 text-sm text-gray-500">
                <Link to="/" className="hover:text-black">Trang chủ</Link> <span className="mx-2">/</span> <span className="text-black">Sản phẩm</span>
            </div>

            <main className="max-w-[1170px] mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-10">

                    
                    <Sidebar
                        searchName={searchDraft}
                        onSearchChange={handleSearchChange}
                        onApplySearch={handleSearchSubmit}

                        categoryId={filtersDraft.category}
                        onCategoryChange={(val) => handleFilterChange("category", val)}

                        minPrice={filtersDraft.minPrice}
                        maxPrice={filtersDraft.maxPrice}
                        onPriceChange={handleFilterChange}
                        onApplyPrice={handlePriceSubmit}
                    />
                    <div className="flex-1">
                        <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            {...product}
                                            stockQuantity={product.stockQuantity}
                                        />
                                    ))
                                ) : (
                                    !loading && (
                                        <div className="col-span-3 text-center text-gray-500 py-20 flex flex-col items-center gap-2">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                            <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {totalPages > 0 && (
                            <Pagination
                                current={currentPage}
                                total={totalPages}
                                onChange={(page) => {
                                    setPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}