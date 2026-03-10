import React, { useState, useEffect } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { fetchAllOrdersAPI } from "../../service/order/api";

const BADGE_COLORS = {
  CONFIRMED: { bg: "#22c55e", text: "#ffffff" },
  CANCELLED: { bg: "#ef4444", text: "#ffffff" },
  PENDING: { bg: "#f59e0b", text: "#ffffff" },
  SHIPPING: { bg: "#3b82f6", text: "#ffffff" },
  DELIVERED: { bg: "#8b5cf6", text: "#ffffff" },
};

function StatusBadge({ status }) {
  const c = BADGE_COLORS[status] || BADGE_COLORS.PENDING;
  return (
    <span
      className="inline-flex items-center px-4 py-1.5 rounded text-sm font-medium tracking-wide"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

function OrderHeader({ orderNumber, datePlaced, total, status }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-[#e5e7eb] bg-white">
      <div className="flex items-center gap-10 md:gap-16">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-[#111827]">Order number</p>
          <p className="text-sm text-[#6b7280]">#{orderNumber}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-[#111827]">Date placed</p>
          <p className="text-sm text-[#6b7280]">{datePlaced}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-[#111827]">Total amount</p>
          <p className="text-sm font-medium text-[#111827]">{total}</p>
        </div>
      </div>
      <div className="mt-4 sm:mt-0">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}

function OrderProduct({ image, name, price, description, first }) {
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
        <p className="text-sm text-[#6b7280] leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>
    </div>
  );
}

function OrderCard({ orderNumber, datePlaced, total, status, products }) {
  const renderActionButtons = () => {
    const currentStatus = status ? status.toUpperCase() : "";

    if (currentStatus === "PENDING") {
      return (
        <button className="px-6 py-2 bg-white border border-[#db4444] text-[#db4444] rounded hover:bg-[#db4444] hover:text-white transition-colors font-medium">
          Hủy đơn
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
          <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium">
            Decline
          </button>
          <button className="px-6 py-2 bg-[#22c55e] text-white rounded hover:bg-[#16a34a] transition-colors font-medium shadow-sm">
            Approve
          </button>
        </div>
      );
    }
    return null;
  };

  const actionButtons = renderActionButtons();

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-sm overflow-hidden">
      <OrderHeader orderNumber={orderNumber} datePlaced={datePlaced} total={total} status={status} />

      {products.map((p, i) => (
        <OrderProduct key={i} {...p} first={i === 0} />
      ))}

      {actionButtons && (
        <div className="border-t border-[#e5e7eb] bg-[#f9fafb] p-4 flex justify-end">
          {actionButtons}
        </div>
      )}
    </div>
  );
}

function SidebarFilter({ appliedStatus, onApplyFilter }) {
  // Thêm "All" để người dùng có thể bỏ lọc, các value được chuyển thành in hoa để khớp với Enum Backend
  const statuses = [
    { label: "All", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Shipping", value: "SHIPPING" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Canceled", value: "CANCELLED" }
  ];

  // Trạng thái tạm thời trước khi bấm nút Filter
  const [localStatus, setLocalStatus] = useState(appliedStatus);

  const handleFilterClick = () => {
    onApplyFilter(localStatus);
  };

  return (
    <div className="w-full">
      <h3 className="font-semibold text-sm text-[#111827] mb-5 uppercase tracking-wider">Status</h3>
      <div className="flex flex-col gap-4 pb-6 border-b border-gray-200 border-dashed">
        {statuses.map((s) => (
          <label key={s.value} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="orderStatus"
              value={s.value}
              checked={localStatus === s.value}
              onChange={(e) => setLocalStatus(e.target.value)}
              className="w-4 h-4 rounded-full border-gray-300 text-[#db4444] focus:ring-[#db4444] cursor-pointer"
            />
            <span className="text-sm text-[#374151] font-medium group-hover:text-black">{s.label}</span>
          </label>
        ))}
      </div>
      <button 
        onClick={handleFilterClick}
        className="w-full mt-6 bg-[#db4444] text-white py-2.5 rounded hover:bg-[#c03c3c] transition-colors font-medium"
      >
        Filter
      </button>
    </div>
  );
}

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // State quản lý status đang được lọc để gọi API
  const [currentStatus, setCurrentStatus] = useState(""); 
  const pageSize = 2;

  // Thêm currentStatus vào dependency array để tự động fetch lại khi status thay đổi
  useEffect(() => {
    fetchOrders(currentPage, pageSize, currentStatus);
  }, [currentPage, currentStatus]);

  const fetchOrders = async (page, size, statusFilter) => {
    setIsLoading(true);
    try {
      // Truyền thêm statusFilter vào API call
      const response = await fetchAllOrdersAPI(page, size, statusFilter);

      let apiData = [];
      let apiTotalPages = 1;

      if (response && response.meta && response.data) {
        apiData = response.data;
        apiTotalPages = response.meta.totalPages;
      } else if (response && response.data && response.data.data) {
        apiData = response.data.data;
        apiTotalPages = response.data.meta.totalPages;
      }

      if (Array.isArray(apiData)) {
        setTotalPages(apiTotalPages);

        const formattedOrders = apiData.map(order => {
          return {
            id: order.id,
            orderNumber: order.id,
            datePlaced: order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
              : "N/A",
            total: order.totalAmount
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)
              : "0 ₫",
            status: order.status,
            products: Array.isArray(order.items) ? order.items.map(item => ({
              image: item.productImg || "https://placehold.co/160",
              name: item.productName || "Sản phẩm không xác định",
              price: item.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price) : "0 ₫",
              description: item.description || "Chưa có mô tả.",
            })) : []
          };
        });

        setOrders(formattedOrders);
      } else {
        console.warn("Dữ liệu không phải là mảng, vui lòng kiểm tra lại API.");
        setOrders([]);
      }
    } catch (error) {
      console.error("Lỗi khi fetch đơn hàng:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = (status) => {
    setCurrentStatus(status);
    setCurrentPage(1); // Trở về trang 1 khi áp dụng bộ lọc mới
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      <main className="max-w-[1170px] mx-auto px-4 pt-10 pb-16 w-full flex-1">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">

          <div className="w-full md:w-[220px] shrink-0">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#111827] mb-8 leading-none">
              Order history
            </h1>
            <SidebarFilter appliedStatus={currentStatus} onApplyFilter={handleApplyFilter} />
          </div>

          <div className="flex-1 flex flex-col">
            {isLoading ? (
              <div className="flex justify-center items-center py-20 text-gray-500">Đang tải dữ liệu...</div>
            ) : orders.length === 0 ? (
              <div className="flex justify-center items-center py-20 text-gray-500">Không tìm thấy đơn hàng nào.</div>
            ) : (
              <div className="flex flex-col gap-8">
                {orders.map((order) => (
                  <OrderCard key={order.orderNumber} {...order} />
                ))}
              </div>
            )}

            {!isLoading && totalPages > 0 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded font-medium shadow-sm transition-colors ${currentPage === page
                      ? "bg-[#db4444] text-white"
                      : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistory;