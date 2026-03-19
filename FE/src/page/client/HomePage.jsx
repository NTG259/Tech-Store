import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import ProductCard from "./ProductCard";
import SectionTag from "../../layout/client/SectionTag";
import ViewAllButton from "../../layout/client/ViewAllButton";

// Nhớ đổi lại đường dẫn import file API cho đúng
import { get8LatestProductAPI } from "../../service/product/api";

export default function ECommerceHomePage() {
    const [newProducts, setNewProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // State lưu lại thời gian bấm nút cuối cùng để reset bộ đếm 5s
    const [lastInteraction, setLastInteraction] = useState(Date.now());
    
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            setIsLoading(true);
            try {
                const response = await get8LatestProductAPI();
                if (response && Array.isArray(response.data)) {
                    setNewProducts(response.data);
                } else {
                    setNewProducts([]);
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm mới nhất:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    // 1. NHÂN 3 MẢNG ĐỂ TẠO ẢO GIÁC XOAY VÒNG VÔ TẬN
    const displayProducts = useMemo(() => {
        if (newProducts.length === 0) return [];
        return [...newProducts, ...newProducts, ...newProducts];
    }, [newProducts]);

    const itemWidth = 300; // 270px chiều rộng card + 30px khoảng cách gap
    const originalWidth = newProducts.length * itemWidth; // Chiều rộng của 1 mảng gốc

    // 2. KHỞI TẠO VỊ TRÍ CUỘN Ở MẢNG GIỮA
    useEffect(() => {
        if (newProducts.length > 0 && scrollContainerRef.current) {
            // Đợi một chút để DOM render xong mảng nhân 3, sau đó đẩy thanh cuộn vào giữa
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollLeft = originalWidth;
                }
            }, 100);
        }
    }, [newProducts, originalWidth]);

    // 3. HÀM XỬ LÝ KHI BẤM NÚT HOẶC AUTO SCROLL
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

    // 4. "BÍ THUẬT" ÂM THẦM DỊCH CHUYỂN KHI CUỘN CHẠM BIÊN
    const handleOnScroll = () => {
        const container = scrollContainerRef.current;
        if (!container || newProducts.length === 0) return;

        // Nếu cuộn lấn sang mảng thứ 3 -> giật ngay lập tức về mảng thứ 2
        if (container.scrollLeft >= originalWidth * 2) {
            container.scrollLeft -= originalWidth;
        } 
        // Nếu cuộn lùi lấn sang mảng thứ 1 -> giật ngay lập tức lên mảng thứ 2
        else if (container.scrollLeft <= 0) {
            container.scrollLeft += originalWidth;
        }
    };

    // 5. AUTO SCROLL 5 GIÂY
    useEffect(() => {
        if (!isLoading && newProducts.length > 0) {
            const timer = setInterval(() => {
                handleScrollButton("right");
            }, 5000); 

            // Hủy đếm ngược cũ nếu người dùng vừa chủ động bấm nút
            return () => clearInterval(timer);
        }
    }, [isLoading, newProducts, lastInteraction, handleScrollButton]);

    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />

            <main className="max-w-[1170px] mx-auto px-4 mb-20">
                <section className="mt-20">
                    <div className="flex justify-between items-end mb-10">
                        <div className="flex flex-col gap-6">
                            <SectionTag label="Tuần này" />
                            <h2 className="text-[36px] font-semibold tracking-wide text-black leading-[1.2]">
                                Sản phẩm mới
                            </h2>
                        </div>
                        
                        {/* NÚT BẤM CHỦ ĐỘNG */}
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
                            // BỎ class 'scroll-smooth' đi để việc giật về giữa không bị khựng hình
                            className="flex gap-[30px] mb-10 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {/* Chạy map() trên mảng x3 đã tạo */}
                            {displayProducts.map((p, index) => (
                                // Thêm index vào key vì các ID đang bị lặp lại 3 lần
                                <div key={`${p.id}-${index}`} className="flex-none min-w-[270px] snap-start">
                                    <ProductCard
                                        {...p}
                                        showAddToCart={true}
                                    />
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
            </main>

            <Footer />
        </div>
    );
}