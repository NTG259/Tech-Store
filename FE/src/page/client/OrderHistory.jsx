import React, { useState, useEffect } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { fetchAllOrdersAPI } from "../../service/order/api";
import OrderCard from "./OrderCard";

function SidebarFilter({ appliedStatus, onApplyFilter }) {
  const statuses = [
    { label: "Tất cả", value: "" },
    { label: "Đang chờ", value: "PENDING" },
    { label: "Đang giao", value: "SHIPPING" },
    { label: "Đã giao", value: "DELIVERED" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đã hủy", value: "CANCELLED" }
  ];

  return (
    <div className="w-full">
      <h3 className="font-semibold text-sm text-[#111827] mb-5 uppercase tracking-wider">Trạng thái</h3>
      <div className="flex flex-col gap-4 pb-6 border-b border-gray-200 border-dashed">
        {statuses.map((s) => (
          <label key={s.value} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="orderStatus"
              value={s.value}
              checked={appliedStatus === s.value} 
              onChange={(e) => onApplyFilter(e.target.value)}
              className="w-4 h-4 rounded-full border-gray-300 text-[#db4444] focus:ring-[#db4444] cursor-pointer"
            />
            <span className="text-sm text-[#374151] font-medium group-hover:text-black">{s.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [currentStatus, setCurrentStatus] = useState("");
  const pageSize = 5;

  useEffect(() => {
    fetchOrders(currentPage, pageSize, currentStatus);
  }, [currentPage, currentStatus]);

  const fetchOrders = async (page, size, statusFilter) => {
    setIsLoading(true);
    try {
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
    setCurrentPage(1);
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
              Đơn hàng
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
                  <OrderCard 
                    key={order.id} 
                    {...order} 
                    onUpdateSuccess={() => fetchOrders(currentPage, pageSize, currentStatus)}
                  />
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