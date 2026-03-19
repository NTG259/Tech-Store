import React from "react";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Header from "../client/Header";
import Footer from "../client/Footer";

function ErrorCircle() {
    return (
        <div className="w-[100px] h-[100px] bg-[#db4444] rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <X size={64} color="white" strokeWidth={3} />
        </div>
    );
}

const Error = ({ message }) => {
    const location = useLocation();
    const stateMessage = location?.state?.message;
    const detail = message || stateMessage || "Đã xảy ra lỗi. Vui lòng thử lại.";

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Header />

            {/* Breadcrumb */}
            <div className="max-w-[1170px] mx-auto px-4 w-full mt-6">
                <div className="text-sm text-gray-500">
                    <Link to="/" className="hover:text-black">Home</Link> /{" "}
                    <span className="text-black font-medium">Error</span>
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center gap-8 py-20">
                <div className="flex items-center gap-6">
                    <ErrorCircle />
                    <h1
                        className="text-black tracking-wide select-none"
                        style={{ fontSize: "90px", lineHeight: "1.05", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                        Error
                    </h1>
                </div>

                <p className="text-base text-black text-center max-w-[720px] px-4">
                    {detail}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                    <Link
                        to="/"
                        className="border border-gray-300 text-black text-base px-10 py-3 rounded hover:bg-gray-50 transition-colors"
                    >
                        Back to home
                    </Link>
                    <Link
                        to="/products"
                        className="bg-[#db4444] text-white text-base px-10 py-3 rounded hover:bg-[#c03c3c] transition-colors"
                    >
                        Continue shopping
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Error;