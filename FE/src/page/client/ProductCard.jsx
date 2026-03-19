import React, { useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import { EyeIcon, CartIcon } from "../../components/icon/icons";
import { addToCart } from "../../service/cart/api";

export default function ProductCard({ 
    id, 
    productImg, 
    name, 
    price, 
    showAddToCart = true, 
    category,
    stockQuantity = 0 // Đồng nhất với Backend
}) {
    const [, setHovered] = useState(false);

    // Kiểm tra trạng thái hết hàng (số lượng <= 0)
    const isOutOfStock = Number(stockQuantity) <= 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            await addToCart({ productId: id, quantity: 1 });
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

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price || 0);

    const categoryDisplay = typeof category === 'object' ? category?.name : category;

    return (
        <div
            className={`flex flex-col items-center gap-3 w-full ${isOutOfStock ? 'opacity-90' : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="relative bg-[#f5f5f5] rounded w-full h-[250px] overflow-hidden group">
                
                {/* Badge Category */}
                {categoryDisplay && (
                    <span className="absolute top-3 left-3 bg-[#db4444] text-white text-[10px] font-bold px-2 py-1 rounded z-10">
                        {categoryDisplay}
                    </span>
                )}

                {/* Các nút chức năng (Eye & Cart) */}
                <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        to={`/products/${id}`}
                        className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
                    >
                        <EyeIcon />
                    </Link>
                    
                    {/* CHỈ HIỂN THỊ NÚT GIỎ HÀNG KHI CÒN HÀNG */}
                    {showAddToCart && !isOutOfStock && (
                        <button
                            onClick={handleAddToCart}
                            className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
                        >
                            <CartIcon />
                        </button>
                    )}
                </div>

                {/* Hình ảnh sản phẩm */}
                <div className="absolute inset-0 overflow-hidden rounded">
                    <img
                        src={productImg || "https://placehold.co/400x400/f5f5f5/333333/png?text=No+Image"}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* BANNER HẾT HÀNG */}
                {isOutOfStock && (
                    <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white text-center py-2 text-xs font-bold z-10 uppercase tracking-widest backdrop-blur-sm">
                        Hết hàng
                    </div>
                )}
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex flex-col items-center gap-1 w-full mt-2 text-center">
                <Link
                    to={`/products/${id}`}
                    className="text-base text-black font-medium line-clamp-1 w-full px-2 hover:text-[#db4444] transition-colors"
                    title={name}
                >
                    {name}
                </Link>
                <p className="text-base text-[#db4444] font-medium">{formattedPrice}</p>
            </div>
        </div>
    );
}