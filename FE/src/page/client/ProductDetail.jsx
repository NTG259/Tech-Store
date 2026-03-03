import React, { useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";

const imgGamepad = "https://placehold.co/500x500/f5f5f5/333333/png?text=HAVIT+Gamepad";

export function ProductDetail(props) {
    const [qty, setQty] = useState(2);

    const handleDecrease = () => setQty((q) => Math.max(1, q - 1));
    const handleIncrease = () => setQty((q) => q + 1);

    return (
        <>
        <Header></Header>
            <div className="min-h-screen bg-white font-sans text-gray-900">
                <main className="max-w-[1170px] mx-auto px-4 py-10">
                    <div className="text-sm text-gray-500 mb-10">
                        <span className="hover:text-black cursor-pointer">Account</span> / <span className="hover:text-black cursor-pointer">Gaming</span> / <span className="text-black font-medium">Havic HV G-92 Gamepad</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 md:gap-16">
                        <div className="w-full md:w1/2 lg:w-[500px] h-[400px] lg:h-[600px] bg-[#f5f5f5] rounded flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                                src={imgGamepad}
                                alt="Havic HV G-92 Gamepad"
                                className="w-[80%] h-[80%] object-contain hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <div className="flex flex-col gap-5 flex-1 pt-2">
                            <h1 className="text-2xl md:text-3xl font-semibold text-black tracking-wide">
                                Havic HV G-92 Gamepad
                            </h1>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < 4 ? "#FFAD33" : "#e5e7eb"} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                        </svg>
                                    ))}
                                    <span className="text-sm text-gray-400 ml-1">(150 Reviews)</span>
                                </div>
                                <div className="w-px h-4 bg-gray-400" />
                                <span className="text-sm font-medium text-[#00ff66]">In Stock</span>
                            </div>

                            <p className="text-2xl text-black font-medium">$192.00</p>

                            {/* Description */}
                            <p className="text-sm text-gray-700 max-w-[450px] leading-relaxed">
                                PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy
                                bubble free install & mess free removal. Pressure sensitive.
                            </p>

                            <div className="h-px bg-gray-300 w-full max-w-[450px] my-2" />

                            {/* Qty + Buy Now */}
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                {/* Quantity stepper */}
                                <div className="flex items-center border border-gray-400 rounded h-12 w-[160px]">
                                    <button
                                        onClick={handleDecrease}
                                        className="w-12 h-full flex items-center justify-center hover:bg-[#db4444] hover:text-white transition-colors border-r border-gray-400 hover:border-[#db4444] rounded-l group"
                                    >
                                        {/* Icon Minus chuẩn */}
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                        {/* Icon Plus chuẩn */}
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>
                                </div>

                                {/* Buy Now */}
                                <button className="bg-[#db4444] text-white px-10 h-12 rounded font-medium hover:bg-[#c03c3c] transition-colors">
                                    Buy Now
                                </button>

                                {/* Wishlist Button (Bổ sung thêm cho giống UI e-commerce chuẩn) */}
                                <button className="h-12 w-12 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-50 transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* <StoreFooter /> */}
                <Footer></Footer>
            </div>
        </>
    );
}

export default ProductDetail;