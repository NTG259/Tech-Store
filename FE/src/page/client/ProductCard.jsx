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
    stockQuantity = 0,
    isHot = false // Thêm prop isHot (mặc định false)
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

                {/* ICON HOT DƯỚI GÓC PHẢI */}
                {isHot && !isOutOfStock && (
                    <div 
                        className="absolute bottom-3 right-3 z-10 flex items-center justify-center w-10 h-10 bg-white/95 rounded-full shadow-lg animate-pulse"
                        title="Sản phẩm đang Hot"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 drop-shadow-sm">
                            {/* Định nghĩa dải màu từ Đỏ sang Cam */}
                            <defs>
                                <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor="#dc2626" />   {/* Đỏ đậm ở phần đáy */}
                                    <stop offset="40%" stopColor="#ef4444" />   {/* Đỏ tươi ở giữa */}
                                    <stop offset="100%" stopColor="#f97316" />  {/* Cam sáng ở ngọn */}
                                </linearGradient>
                            </defs>
                            <path 
                                fill="url(#fireGradient)" 
                                fillRule="evenodd" 
                                d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                    </div>
                )}

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