import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

// Import Header và Footer của bạn
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";

/* ─── Green Checkmark Circle (Thành công) ─── */
function CheckCircle() {
  return (
    <div className="w-[100px] h-[100px] bg-[#3ac318] rounded-full flex items-center justify-center shrink-0 shadow-lg">
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  );
}

/* ─── Red Cross Circle (Thất bại) ─── */
function ErrorCircle() {
  return (
    <div className="w-[100px] h-[100px] bg-[#db4444] rounded-full flex items-center justify-center shrink-0 shadow-lg">
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  );
}

const Success = () => {
  // Trạng thái: 'loading' (đang xác thực), 'success' (thành công), 'failed' (thất bại)
  const [status, setStatus] = useState("loading"); 
  const location = useLocation();
  const called = useRef(false); // Dùng useRef để tránh việc useEffect gọi API 2 lần trong React StrictMode

  useEffect(() => {
    window.scrollTo({ top: 0 });

    // Tránh việc gọi API 2 lần liên tiếp khi component re-render
    if (called.current) return;
    called.current = true;

    const verifyPayment = async () => {
      // Nếu URL không chứa tham số của VNPAY (ví dụ: thanh toán COD chuyển thẳng đến đây) 
      // thì mặc định cho qua thành công
      if (!location.search.includes("vnp_")) {
        setStatus("success");
        return;
      }

      try {
        // 1. Lấy toàn bộ query params từ URL đưa vào object
        const params = new URLSearchParams(location.search);
        const vnpayData = {};
        for (const [key, value] of params.entries()) {
          vnpayData[key] = value;
        }

        const token = localStorage.getItem("access_token");
        // 2. Gửi request lên BE để xác thực
        // Thay "http://localhost:8080/payment/vnpay/verify" bằng domain BE của bạn
        const response = await fetch("http://localhost:8082/api/payment/vnpay/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(vnpayData),
        });

        // 3. Xử lý kết quả trả về
        if (response.ok) {
          const data = await response.json();
          if (data.status === "success") {
            setStatus("success");
          } else {
            setStatus("failed");
          }
        } else {
          // Trường hợp trả về 400 Bad Request (sai chữ ký) hoặc lỗi Server
          setStatus("failed");
        }
      } catch (error) {
        console.error("Lỗi khi xác thực thanh toán:", error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [location.search]);

  // Render nội dung tuỳ theo trạng thái
  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-600 font-medium">Đang xác thực thanh toán...</p>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <>
          <div className="flex items-center gap-6">
            <ErrorCircle />
            <h1
              className="text-black tracking-wide select-none"
              style={{ fontSize: "70px", lineHeight: "1.05", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              Thanh toán thất bại
            </h1>
          </div>
          <p className="text-base text-gray-600 text-xl text-center max-w-lg">
            Giao dịch bị huỷ hoặc có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại!
          </p>
          <Link to="/cart">
            <button className="bg-black text-white text-base px-20 py-4 rounded hover:bg-gray-800 transition-colors mt-4 font-medium">
              Quay lại giỏ hàng
            </button>
          </Link>
        </>
      );
    }

    // Mặc định là giao diện Thành Công của bạn
    return (
      <>
        <div className="flex items-center gap-6">
          <CheckCircle />
          <h1
            className="text-black tracking-wide select-none"
            style={{ fontSize: "70px", lineHeight: "1.05", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          >
            Đặt hàng thành công
          </h1>
        </div>
        <p className="text-base text-black text-xl">Cảm ơn quý khách đã tin tưởng sốp &lt;3</p>
        <Link to="/">
          <button className="bg-[#db4444] text-white text-base px-20 py-4 rounded hover:bg-[#c03c3c] transition-colors mt-4 font-medium">
            Tiếp tục mua hàng
          </button>
        </Link>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center gap-10 py-20 mt-10">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

export default Success;