import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import ProductCard from "./ProductCard";
import SectionTag from "../../layout/client/SectionTag";
import ViewAllButton from "../../layout/client/ViewAllButton";

import { get8LatestProductAPI, getHotProductsAPI } from "../../service/product/api";

export default function ECommerceHomePage() {
    const [newProducts, setNewProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastInteraction, setLastInteraction] = useState(Date.now());
    const scrollContainerRef = useRef(null);

    const [hotProducts, setHotProducts] = useState([]);
    const [isLoadingHot, setIsLoadingHot] = useState(false);
    const [lastInteractionHot, setLastInteractionHot] = useState(Date.now());
    const scrollContainerHotRef = useRef(null);

    const itemWidth = 300; 

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            setIsLoading(true);
            try {
                const response = await get8LatestProductAPI();
                setNewProducts(response);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchHotProducts = async () => {
            setIsLoadingHot(true);
            try {
                const response = await getHotProductsAPI();
                setHotProducts(response);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingHot(false);
            }
        };

        fetchLatestProducts();
        fetchHotProducts();
    }, []);

    const actualNewProducts = Array.isArray(newProducts) ? newProducts : (newProducts?.data || []);
    const actualHotProducts = Array.isArray(hotProducts) ? hotProducts : (hotProducts?.data || []);

    const handleScrollButton = useCallback((direction) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const maxScrollLeft = Math.max(container.scrollWidth - container.clientWidth, 0);
        const nextLeft = direction === "left"
            ? container.scrollLeft - itemWidth
            : container.scrollLeft + itemWidth;

        if (direction === "left") {
            if (container.scrollLeft <= 0) {
                container.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
            } else {
                container.scrollTo({ left: Math.max(nextLeft, 0), behavior: "smooth" });
            }
        } else {
            if (container.scrollLeft >= maxScrollLeft) {
                container.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                container.scrollTo({ left: Math.min(nextLeft, maxScrollLeft), behavior: "smooth" });
            }
        }
        setLastInteraction(Date.now());
    }, [itemWidth]);

    useEffect(() => {
        if (!isLoading && actualNewProducts.length > 0) {
            const timer = setInterval(() => {
                handleScrollButton("right");
            }, 5000); 
            return () => clearInterval(timer);
        }
    }, [isLoading, actualNewProducts, lastInteraction, handleScrollButton]);

    const handleScrollButtonHot = useCallback((direction) => {
        const container = scrollContainerHotRef.current;
        if (!container) return;

        const maxScrollLeft = Math.max(container.scrollWidth - container.clientWidth, 0);
        const nextLeft = direction === "left"
            ? container.scrollLeft - itemWidth
            : container.scrollLeft + itemWidth;

        if (direction === "left") {
            if (container.scrollLeft <= 0) {
                container.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
            } else {
                container.scrollTo({ left: Math.max(nextLeft, 0), behavior: "smooth" });
            }
        } else {
            if (container.scrollLeft >= maxScrollLeft) {
                container.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                container.scrollTo({ left: Math.min(nextLeft, maxScrollLeft), behavior: "smooth" });
            }
        }
        setLastInteractionHot(Date.now());
    }, [itemWidth]);

    useEffect(() => {
        if (!isLoadingHot && actualHotProducts.length > 0) {
            const timer = setInterval(() => {
                handleScrollButtonHot("right");
            }, 6000); 
            return () => clearInterval(timer);
        }
    }, [isLoadingHot, actualHotProducts, lastInteractionHot, handleScrollButtonHot]);

    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />

            <main className="max-w-[1170px] mx-auto px-4 mb-20">
                {/* <section className="mt-20">
                    <div className="flex justify-between items-end mb-10">
                        <div className="flex flex-col gap-6">
                            <SectionTag label="Tuần này" />
                            <h2 className="text-[36px] font-semibold tracking-wide text-black leading-[1.2]">
                                Sản phẩm mới
                            </h2>
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleScrollButton("left")}
                                className="w-[46px] h-[46px] rounded-full bg-[#f5f5f5] flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <LeftOutlined className="text-black" />
                            </button>
                            <button 
                                onClick={() => handleScrollButton("right")}
                                className="w-[46px] h-[46px] rounded-full bg-[#f5f5f5] flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <RightOutlined className="text-black" />
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20 text-gray-500">
                            Đang tải sản phẩm...
                        </div>
                    ) : actualNewProducts.length === 0 ? (
                        <div className="flex justify-center items-center py-20 text-gray-500">
                            Không có sản phẩm nào.
                        </div>
                    ) : (
                        <div 
                            ref={scrollContainerRef}
                            className="flex gap-[30px] mb-10 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {actualNewProducts.map((p, index) => (
                                <div key={`new-${p.id || index}`} className="flex-none min-w-[270px] snap-start">
                                    <ProductCard {...p} showAddToCart={true} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center mt-6">
                        <Link to="/products">
                            <ViewAllButton />
                        </Link>
                    </div>
                </section> */}

                <section className="mt-28">
                    <div className="flex justify-between items-end mb-10">
                        <div className="flex flex-col gap-6">
                            <SectionTag label="Đang thịnh hành" />
                            <h2 className="text-[36px] font-semibold tracking-wide text-black leading-[1.2]">
                                Sản phẩm bán chạy
                            </h2>
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleScrollButtonHot("left")}
                                className="w-[46px] h-[46px] rounded-full bg-[#f5f5f5] flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <LeftOutlined className="text-black" />
                            </button>
                            <button 
                                onClick={() => handleScrollButtonHot("right")}
                                className="w-[46px] h-[46px] rounded-full bg-[#f5f5f5] flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <RightOutlined className="text-black" />
                            </button>
                        </div>
                    </div>

                    {isLoadingHot ? (
                        <div className="flex justify-center items-center py-20 text-gray-500">
                            Đang tải sản phẩm bán chạy...
                        </div>
                    ) : actualHotProducts.length === 0 ? (
                        <div className="flex justify-center items-center py-20 text-gray-500">
                            Không có sản phẩm bán chạy nào.
                        </div>
                    ) : (
                        <div 
                            ref={scrollContainerHotRef}
                            className="flex gap-[30px] mb-10 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {actualHotProducts.map((p, index) => (
                                <div key={`hot-${p.id || index}`} className="flex-none min-w-[270px] snap-start">
                                    <ProductCard {...p} showAddToCart={true} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center mt-6">
                        <Link to="/products?sort=best_selling">
                            <ViewAllButton />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
