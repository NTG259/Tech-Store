import React, { useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";

const imgMonitor = "https://placehold.co/100x100/f5f5f5/333333/png?text=Monitor";
const imgGamepad = "https://placehold.co/100x100/f5f5f5/333333/png?text=Gamepad";

function BillingField({ label, required, type = "text", multiline = false }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-base text-black opacity-40">
                {label}
                {required && <span className="text-[#db4444] ml-1">*</span>}
            </label>
            {multiline ? (
                <textarea
                    rows={6}
                    className="w-full bg-[#f5f5f5] rounded px-4 py-3 text-base text-black outline-none focus:ring-2 focus:ring-[#db4444] resize-none"
                />
            ) : (
                <input
                    type={type}
                    className="w-full h-[50px] bg-[#f5f5f5] rounded px-4 text-base text-black outline-none focus:ring-2 focus:ring-[#db4444]"
                />
            )}
        </div>
    );
}

function OrderItem({ image, name, price }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
                <div className="w-[54px] h-[54px] overflow-hidden shrink-0">
                    <img src={image} alt={name} className="w-full h-full object-contain" />
                </div>
                <span className="text-base text-black">{name}</span>
            </div>
            <span className="text-base font-medium text-black">{price}</span>
        </div>
    );
}

const orderItems = [
    { id: 1, name: "LCD Monitor", price: "$650", image: imgMonitor },
    { id: 2, name: "H1 Gamepad", price: "$1100", image: imgGamepad },
];

export default function CheckOut() {
    const [payMethod, setPayMethod] = useState("cod");
    const [ordered, setOrdered] = useState(false);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Header />

            <main className="max-w-[1170px] mx-auto px-4 py-10">
                <div className="text-sm text-gray-500 mb-10 flex flex-wrap gap-2">
                    <span className="hover:text-black cursor-pointer">Home</span>
                    <span>/</span>
                    <span className="text-black font-medium">CheckOut</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-medium text-black tracking-wide mb-10">Billing Details</h1>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">
                    <div className="flex flex-col gap-6 w-full lg:flex-1">
                        <BillingField label="Full Name" required />
                        <BillingField label="Address" required />
                        <BillingField label="Phone Number" required type="tel" />
                        <BillingField label="Order Notes" multiline />
                    </div>

                    <div className="w-full lg:w-[470px] shrink-0 lg:mt-6">
                        <div className="flex flex-col mb-6">
                            {orderItems.map((item) => (
                                <OrderItem key={item.id} {...item} />
                            ))}
                        </div>

                        <div className="flex flex-col gap-0 border-b border-black border-opacity-40 pb-4 mb-4">
                            <div className="flex items-center justify-between py-4 border-b border-black border-opacity-20">
                                <span className="text-base text-black">Subtotal:</span>
                                <span className="text-base font-medium text-black">$1750</span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-black border-opacity-20">
                                <span className="text-base text-black">Shipping:</span>
                                <span className="text-base font-medium text-[#db4444]">Free</span>
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <span className="text-base text-black">Total:</span>
                                <span className="text-base font-medium text-black">$1750</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mt-2 mb-6">

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={payMethod === "cod"}
                                    onChange={() => setPayMethod("cod")}
                                    className="w-5 h-5 accent-black"
                                />
                                <span className="text-base text-black">Cash on delivery</span>
                            </label>
                        </div>

                        <button
                            onClick={() => setOrdered(true)}
                            className="bg-[#db4444] text-white px-10 py-4 rounded font-medium hover:bg-[#c03c3c] transition-colors w-full sm:w-auto"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}