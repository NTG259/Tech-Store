import React, { useState, useEffect } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import ProductCard from "./ProductCard";
import SectionTag from "../../layout/client/SectionTag";
import ViewAllButton from "../../layout/client/ViewAllButton";
import { Link } from "react-router-dom";
// Nhớ đổi lại đường dẫn import file API cho đúng
import { get8LatestProductAPI } from "../../service/product/api"; 

export default function ECommerceHomePage() {
    const [newProducts, setNewProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }, []);
        
    useEffect(() => {
        const fetchLatestProducts = async () => {
            setIsLoading(true);
            try {
                const response = await get8LatestProductAPI();
                
                // Lấy mảng data (khớp với log số 1 của bạn)
                if (response && Array.isArray(response.data)) {
                    // Truyền thẳng mảng data nguyên bản từ Backend vào state
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

    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />

            <main className="max-w-[1170px] mx-auto px-4 mb-20">
                <section className="mt-20">
                    <div className="flex flex-col gap-6 mb-10">
                        <SectionTag label="This week" />
                        <h2 className="text-[36px] font-semibold tracking-wide text-black leading-[1.2]">
                            New Products
                        </h2>
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
                        <div className="grid grid-cols-4 gap-[30px] mb-10">
                            {newProducts.map((p) => (
                                // Rải thẳng toàn bộ object (p) vào ProductCard
                                // Vì các keys trong p (id, name, price, productImg, category, stockQuantity)
                                // đã TRÙNG KHỚP HOÀN TOÀN với props mà ProductCard yêu cầu!
                                <ProductCard 
                                    key={p.id} 
                                    {...p} 
                                    showAddToCart={true} 
                                />
                            ))}
                        </div>
                    )}

                    <Link to="/products">
                        <ViewAllButton />
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}