import React, { useState } from "react";
import { message } from "antd"; 
import { updateOrdersAPI } from "../../service/order/api";

const STATUS_CONFIG = {
    PENDING: { label: "Đang chờ", bg: "#f59e0b", text: "#ffffff" },
    SHIPPING: { label: "Đang giao", bg: "#3b82f6", text: "#ffffff" },
    DELIVERED: { label: "Đã giao", bg: "#8b5cf6", text: "#ffffff" },
    CONFIRMED: { label: "Đã xác nhận", bg: "#22c55e", text: "#ffffff" },
    CANCELLED: { label: "Đã hủy", bg: "#ef4444", text: "#ffffff" },
};

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    return (
        <span
            className="inline-flex items-center px-4 py-1.5 rounded text-sm font-medium tracking-wide"
            style={{ backgroundColor: config.bg, color: config.text }}
        >
            {config.label}
        </span>
    );
}

function OrderHeader({ orderNumber, datePlaced, total, status }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-[#e5e7eb] bg-white">
            <div className="flex items-center gap-10 md:gap-16">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#111827]">Mã đơn hàng</p>
                    <p className="text-sm text-[#6b7280]">#{orderNumber}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#111827]">Ngày đặt </p>
                    <p className="text-sm text-[#6b7280]">{datePlaced}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#111827]">Tổng số tiền</p>
                    <p className="text-sm font-medium text-[#111827]">{total}</p>
                </div>
            </div>
            <div className="mt-4 sm:mt-0">
                <StatusBadge status={status} />
            </div>
        </div>
    );
}

// Thêm prop `isExpanded` để kiểm soát trạng thái rút gọn text
function OrderProduct({ image, name, price, description, first, isExpanded }) {
    return (
        <div className={`flex flex-col sm:flex-row items-start p-6 ${!first ? "border-t border-[#e5e7eb]" : ""} gap-6 bg-white`}>
            <div className="w-[140px] h-[140px] bg-[#f9fafb] rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-2">
                <img src={image} alt={name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
            </div>
            <div className="flex-1 w-full">
                <div className="flex items-start justify-between mb-2">
                    <p className="text-[15px] font-medium text-[#111827]">{name}</p>
                    <p className="text-[15px] font-medium text-[#111827]">{price}</p>
                </div>
                {/* Dùng line-clamp-2 để giới hạn text 2 dòng khi chưa mở rộng */}
                <p className={`text-sm text-[#6b7280] leading-relaxed max-w-3xl ${!isExpanded ? "line-clamp-2" : ""}`}>
                    {description}
                </p>
            </div>
        </div>
    );
}

function OrderCard({ id, orderNumber, datePlaced, total, status, products = [], onUpdateSuccess }) {
    const [isUpdating, setIsUpdating] = useState(false);
    
    // Thêm state quản lý trạng thái mở rộng
    const [isExpanded, setIsExpanded] = useState(false);

    const handleUpdateStatus = async (newStatus) => {
        const orderId = id || orderNumber;

        try {
            setIsUpdating(true);
            await updateOrdersAPI(orderId, { status: newStatus });
            message.success(`Cập nhật đơn hàng thành công!`);

            if (onUpdateSuccess) {
                onUpdateSuccess();
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật đơn hàng:", error);
            message.error("Cập nhật thất bại. Vui lòng thử lại!");
        } finally {
            setIsUpdating(false);
        }
    };

    const renderActionButtons = () => {
        const currentStatus = status ? status.toUpperCase() : "";

        if (currentStatus === "PENDING") {
            return (
                <button
                    onClick={() => handleUpdateStatus("CANCELLED")}
                    disabled={isUpdating}
                    className="px-6 py-2 bg-white border border-[#db4444] text-[#db4444] rounded hover:bg-[#db4444] hover:text-white transition-colors font-medium disabled:opacity-50"
                >
                    {isUpdating ? "Đang xử lý..." : "Hủy đơn"}
                </button>
            );
        }
        if (currentStatus === "SHIPPING") {
            return (
                <button disabled className="px-6 py-2 bg-gray-100 border border-gray-200 text-gray-400 rounded cursor-not-allowed font-medium">
                    Hủy đơn
                </button>
            );
        }
        if (currentStatus === "DELIVERED") {
            return (
                <div className="flex gap-3">
                    <button
                        onClick={() => handleUpdateStatus("CANCELLED")}
                        disabled={isUpdating}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                    >
                        Trả hàng
                    </button>
                    <button
                        onClick={() => handleUpdateStatus("CONFIRMED")}
                        disabled={isUpdating}
                        className="px-6 py-2 bg-[#22c55e] text-white rounded hover:bg-[#16a34a] transition-colors font-medium shadow-sm disabled:opacity-50"
                    >
                        Đã nhận hàng
                    </button>
                </div>
            );
        }
        return null;
    };

    const actionButtons = renderActionButtons();

    // Logic kiểm tra xem có cần hiển thị nút Mở rộng không
    const hasMultipleProducts = products.length > 1;
    const hasLongDescription = products.some(p => p.description && p.description.length > 100);
    const shouldShowToggle = hasMultipleProducts || hasLongDescription;

    // Lấy danh sách sản phẩm hiển thị dựa vào state isExpanded
    const displayedProducts = isExpanded ? products : products.slice(0, 1);

    return (
        <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-sm overflow-hidden">
            <OrderHeader orderNumber={orderNumber} datePlaced={datePlaced} total={total} status={status} />

            <div className="transition-all duration-300">
                {displayedProducts.map((p, i) => (
                    <OrderProduct 
                        key={i} 
                        {...p} 
                        first={i === 0} 
                        isExpanded={isExpanded} 
                    />
                ))}
            </div>

            {/* Nút Mở rộng / Thu gọn */}
            {shouldShowToggle && (
                <div className="bg-white border-t border-[#e5e7eb] px-6 py-3 flex justify-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                    >
                        {isExpanded ? (
                            <>Thu gọn <span className="text-xs">▲</span></>
                        ) : (
                            <>{hasMultipleProducts ? `Xem thêm ${products.length - 1} sản phẩm` : "Xem thêm chi tiết"} <span className="text-xs">▼</span></>
                        )}
                    </button>
                </div>
            )}

            {actionButtons && (
                <div className="border-t border-[#e5e7eb] bg-[#f9fafb] p-4 flex justify-end">
                    {actionButtons}
                </div>
            )}
        </div>
    );
}

export default OrderCard;