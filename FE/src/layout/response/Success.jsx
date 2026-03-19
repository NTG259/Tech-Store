import React from "react";
import { Link } from "react-router-dom";

// Import Header và Footer của bạn
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { useEffect } from "react";
/* ─── Green Checkmark Circle ─── */
function CheckCircle() {
  return (
    <div className="w-[100px] h-[100px] bg-[#3ac318] rounded-full flex items-center justify-center shrink-0 shadow-lg">
      {/* Sử dụng mã SVG trực tiếp, không cần tải từ link ngoài hay file local */}
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  );
}

const Success = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header của bạn */}
      <Header />

      {/* ── Success Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center gap-10 py-20 mt-10">

        {/* Checkmark + Success text side by side */}
        <div className="flex items-center gap-6">
          <CheckCircle />
          <h1
            className="text-black tracking-wide select-none"
            style={{ fontSize: "70px", lineHeight: "1.05", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          >
            Đặt hàng thành công
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base text-black text-xl">Cảm ơn quý khách đã tin tưởng sốp &lt;3</p>

        {/* Nút chuyển về trang chủ */}
        <Link to="/">
          <button className="bg-[#db4444] text-white text-base px-20 py-4 rounded hover:bg-[#c03c3c] transition-colors mt-4 font-medium">
            Tiếp tục mua hàng 
          </button>
        </Link>
      </main>

      {/* Footer của bạn */}
      <Footer />
    </div>
  );
}

export default Success;