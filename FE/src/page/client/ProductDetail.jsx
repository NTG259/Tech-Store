import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message } from "antd";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { fetchProductDetailAPI } from "../../service/product/api";
import { addToCart } from "../../service/cart/api";

export function ProductDetail() {
    const { id } = useParams();
    const [qty, setQty] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        const loadProduct = async () => {
            setLoading(true);
            try {
                const res = await fetchProductDetailAPI(id);
                if (res && res.data) {
                    setProduct(res.data);
                } else {
                    message.error("Không lấy được thông tin sản phẩm");
                }
            } catch (err) {
                message.error("Lỗi khi tải thông tin sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const handleDecrease = () => setQty((q) => Math.max(1, q - 1));
    const handleIncrease = () => setQty((q) => q + 1);

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await addToCart({ productId: product.id, quantity: qty });
            message.success("Đã thêm vào giỏ hàng");
        } catch (err) {
            const errMsg =
                err?.message ||
                err?.error ||
                err?.data?.message ||
                err?.response?.data?.message ||
                "Thêm vào giỏ hàng thất bại";
            message.error(errMsg);
        }
    };

    const formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(product?.price || 0);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-white font-sans text-gray-900">
                <main className="max-w-[1170px] mx-auto px-4 py-10">
                    <div className="text-sm text-gray-500 mb-10">
                        <span className="hover:text-black cursor-pointer">Home</span> /{" "}
                        <span className="hover:text-black cursor-pointer">Products</span> /{" "}
                        <span className="text-black font-medium">
                            {product?.name || "Đang tải..."}
                        </span>
                    </div>

                    {loading || !product ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-gray-500">Đang tải thông tin sản phẩm...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
                            <div className="w-full md:w-1/2 lg:w-[500px] h-[400px] lg:h-[600px] bg-[#f5f5f5] rounded flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={
                                        product.productImg ||
                                        "https://placehold.co/500x500/f5f5f5/333333/png?text=No+Image"
                                    }
                                    alt={product.name}
                                    className="w-[80%] h-[80%] object-contain hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="flex flex-col gap-5 flex-1 pt-2">
                                <h1 className="text-2xl md:text-3xl font-semibold text-black tracking-wide">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-[#00ff66]">
                                        {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                                    </span>
                                </div>

                                <p className="text-2xl text-black font-medium">
                                    {formattedPrice}
                                </p>

                                <p className="text-sm text-gray-700 max-w-[450px] leading-relaxed">
                                    {product.description || "Chưa có mô tả cho sản phẩm này."}
                                </p>

                                <div className="h-px bg-gray-300 w-full max-w-[450px] my-2" />

                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                    <div className="flex items-center border border-gray-400 rounded h-12 w-[160px]">
                                        <button
                                            onClick={handleDecrease}
                                            className="w-12 h-full flex items-center justify-center hover:bg-[#db4444] hover:text-white transition-colors border-r border-gray-400 hover:border-[#db4444] rounded-l group"
                                        >
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </button>
                                        <span className="flex-1 text-center text-xl font-medium text-black select-none">
                                            {qty}
                                        </span>

                                        <button
                                            onClick={handleIncrease}
                                            className="w-12 h-full flex items-center justify-center bg-[#db4444] text-white hover:bg-[#c03c3c] transition-colors rounded-r"
                                        >
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="bg-[#db4444] text-white px-10 h-12 rounded font-medium hover:bg-[#c03c3c] transition-colors disabled:opacity-60"
                                        disabled={!product || product.stockQuantity <= 0}
                                    >
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}

export default ProductDetail;