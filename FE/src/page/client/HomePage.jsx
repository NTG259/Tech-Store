import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import ProductCard from "./ProductCard";
import SectionTag from "../../layout/client/SectionTag";
import ViewAllButton from "../../layout/client/ViewAllButton";

// Đổi tên hàm cho đúng với file api của bạn
import { get8LatestProductAPI, getHotProductsAPI } from "../../service/product/api";

export default function ECommerceHomePage() {
    // ==============================================================
    // 1. STATE & REF CHO "SẢN PHẨM MỚI" 
    // ==============================================================
    const [newProducts, setNewProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastInteraction, setLastInteraction] = useState(Date.now());
    const scrollContainerRef = useRef(null);

    // ==============================================================
    // 2. STATE & REF CHO "SẢN PHẨM HOT" 
    // ==============================================================
    const [hotProducts, setHotProducts] = useState([]);
    const [isLoadingHot, setIsLoadingHot] = useState(false);
    const [lastInteractionHot, setLastInteractionHot] = useState(Date.now());
    const scrollContainerHotRef = useRef(null);

    const itemWidth = 300; 

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // ==============================================================
    // 3. FETCH DỮ LIỆU TỪ API
    // ==============================================================
    useEffect(() => {
        // --- Fetch API Sản Phẩm Mới ---
        const fetchLatestProducts = async () => {
            setIsLoading(true);
            try {
                const response = await get8LatestProductAPI();
                if (response && Array.isArray(response.data)) {
                    // Đảm bảo có productImg
                    const mappedNewProducts = response.data.map(item => ({
                        ...item,
                        productImg: item.productImg || item.image 
                    }));
                    setNewProducts(mappedNewProducts);
                } else {
                    setNewProducts([]);
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm mới nhất:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // --- Fetch API Sản Phẩm Bán Chạy (Hot) ---
        const fetchHotProducts = async () => {
            setIsLoadingHot(true);
            try {
                const response = await getHotProductsAPI();
                
                let rawData = [];
                if (response?.data?.data && Array.isArray(response.data.data)) {
                    rawData = response.data.data;
                } else if (response?.data && Array.isArray(response.data)) {
                    rawData = response.data;
                }

                // Xử lý gộp các sản phẩm bị trùng lặp
                const uniqueProductsMap = {};
                rawData.forEach(item => {
                    const productData = item.product || item;
                    const productId = productData.id;
                    
                    if (!uniqueProductsMap[productId]) {
                        uniqueProductsMap[productId] = {
                            ...productData, 
                            id: productId,
                            name: productData.name || item.name,
                            price: productData.price || item.price,
                            category: productData.category || item.category,
                            stockQuantity: productData.stockQuantity || item.stockQuantity || 0,
                            // Đảm bảo truyền đúng biến productImg cho thẻ ProductCard
                            productImg: productData.productImg || item.productImg, 
                            soldQuantity: 0
                        };
                    }
                    uniqueProductsMap[productId].soldQuantity += (item.quantity || 0);
                });

                const finalHotProducts = Object.values(uniqueProductsMap);
                setHotProducts(finalHotProducts);

            } catch (error) {
                console.error("Lỗi khi tải sản phẩm bán chạy:", error);
            } finally {
                setIsLoadingHot(false);
            }
        };

        fetchLatestProducts();
        fetchHotProducts();
    }, []);

    // ==============================================================
    // 4. LOGIC SCROLL CHO "SẢN PHẨM MỚI" 
    // ==============================================================
    const displayProducts = useMemo(() => {
        if (newProducts.length === 0) return [];
        return [...newProducts, ...newProducts, ...newProducts];
    }, [newProducts]);

    const originalWidth = newProducts.length * itemWidth;

    useEffect(() => {
        if (newProducts.length > 0 && scrollContainerRef.current) {
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollLeft = originalWidth;
                }
            }, 100);
        }
    }, [newProducts, originalWidth]);

    const handleScrollButton = useCallback((direction) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (direction === "left") {
            container.scrollBy({ left: -itemWidth, behavior: "smooth" });
        } else {
            container.scrollBy({ left: itemWidth, behavior: "smooth" });
        }
        setLastInteraction(Date.now());
    }, [itemWidth]);

    const handleOnScroll = () => {
        const container = scrollContainerRef.current;
        if (!container || newProducts.length === 0) return;

        if (container.scrollLeft >= originalWidth * 2) {
            container.scrollLeft -= originalWidth;
        } else if (container.scrollLeft <= 0) {
            container.scrollLeft += originalWidth;
        }
    };

    useEffect(() => {
        if (!isLoading && newProducts.length > 0) {
            const timer = setInterval(() => {
                handleScrollButton("right");
            }, 5000); 
            return () => clearInterval(timer);
        }
    }, [isLoading, newProducts, lastInteraction, handleScrollButton]);

    // ==============================================================
    // 5. LOGIC SCROLL CHO "SẢN PHẨM HOT" 
    // ==============================================================
    const displayHotProducts = useMemo(() => {
        if (hotProducts.length === 0) return [];
        return [...hotProducts, ...hotProducts, ...hotProducts];
    }, [hotProducts]);

    const originalWidthHot = hotProducts.length * itemWidth;

    useEffect(() => {
        if (hotProducts.length > 0 && scrollContainerHotRef.current) {
            setTimeout(() => {
                if (scrollContainerHotRef.current) {
                    scrollContainerHotRef.current.scrollLeft = originalWidthHot;
                }
            }, 100);
        }
    }, [hotProducts, originalWidthHot]);

    const handleScrollButtonHot = useCallback((direction) => {
        const container = scrollContainerHotRef.current;
        if (!container) return;

        if (direction === "left") {
            container.scrollBy({ left: -itemWidth, behavior: "smooth" });
        } else {
            container.scrollBy({ left: itemWidth, behavior: "smooth" });
        }
        setLastInteractionHot(Date.now());
    }, [itemWidth]);

    const handleOnScrollHot = () => {
        const container = scrollContainerHotRef.current;
        if (!container || hotProducts.length === 0) return;

        if (container.scrollLeft >= originalWidthHot * 2) {
            container.scrollLeft -= originalWidthHot;
        } else if (container.scrollLeft <= 0) {
            container.scrollLeft += originalWidthHot;
        }
    };

    useEffect(() => {
        if (!isLoadingHot && hotProducts.length > 0) {
            const timer = setInterval(() => {
                handleScrollButtonHot("right");
            }, 6000); 
            return () => clearInterval(timer);
        }
    }, [isLoadingHot, hotProducts, lastInteractionHot, handleScrollButtonHot]);

    // ==============================================================
    // 6. RENDER GIAO DIỆN
    // ==============================================================
    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />

            <main className="max-w-[1170px] mx-auto px-4 mb-20">
                {/* --- PHẦN 1: SẢN PHẨM MỚI --- */}
                <section className="mt-20">
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
                    ) : newProducts.length === 0 ? (
                        <div className="flex justify-center items-center py-20 text-gray-500">
                            Không có sản phẩm nào.
                        </div>
                    ) : (
                        <div 
                            ref={scrollContainerRef}
                            onScroll={handleOnScroll}
                            className="flex gap-[30px] mb-10 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {displayProducts.map((p, index) => (
                                <div key={`new-${p.id}-${index}`} className="flex-none min-w-[270px] snap-start">
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
                </section>

                {/* --- PHẦN 2: SẢN PHẨM BÁN CHẠY --- */}
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
                    ) : hotProducts.length === 0 ? (
                        <div className="flex justify-center items-center py-20 text-gray-500">
                            Không có sản phẩm bán chạy nào.
                        </div>
                    ) : (
                        <div 
                            ref={scrollContainerHotRef}
                            onScroll={handleOnScrollHot}
                            className="flex gap-[30px] mb-10 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {displayHotProducts.map((p, index) => (
                                <div key={`hot-${p.id}-${index}`} className="flex-none min-w-[270px] snap-start">
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