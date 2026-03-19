import React, { useEffect, useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { Link, useNavigate } from "react-router-dom"; 
import { message } from "antd";
import { getCart, checkoutCart } from "../../service/cart/api";

const imgMonitor = "https://placehold.co/100x100/f5f5f5/333333/png?text=Monitor";
const imgGamepad = "https://placehold.co/100x100/f5f5f5/333333/png?text=Gamepad";

function BillingField({ label, required, type = "text", multiline = false, value, onChange, name }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-base text-black opacity-40">
                {label}
                {required && <span className="text-[#db4444] ml-1">*</span>}
            </label>
            {multiline ? (
                <textarea
                    name={name}
                    rows={6}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-[#f5f5f5] rounded px-4 py-3 text-base text-black outline-none focus:ring-2 focus:ring-[#db4444] resize-none"
                />
            ) : (
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
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

export default function CheckOut() {
    const [payMethod, setPayMethod] = useState("cod");
    const [form, setForm] = useState({
        fullName: "",
        address: "",
        phone: "",
        notes: "",
    });
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state loading khi submit
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await getCart();
                const items = res?.data?.cartItems ?? [];
                setCartItems(items);

                const total = items.reduce((sum, it) => {
                    const unitPrice = Number(it?.price ?? it?.product?.price ?? 0);
                    const qty = Number(it?.quantity ?? it?.qty ?? 0);
                    return sum + (Number.isFinite(unitPrice * qty) ? unitPrice * qty : 0);
                }, 0);
                setSubTotal(total);
            } catch (error) {
                message.error("Không thể tải giỏ hàng để thanh toán");
            }
        };

        fetchCart();
    }, []);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value || 0);

    // Hàm xử lý khi nhấn Place Order
    const handlePlaceOrder = async () => {
        if (!form.fullName || !form.address || !form.phone) {
            message.error("Vui lòng nhập đầy đủ Họ tên, Địa chỉ và Số điện thoại");
            return;
        }

        if (!cartItems.length) {
            message.error("Giỏ hàng trống, không thể đặt hàng");
            return;
        }

        // Bổ sung field note vào payload
        const payload = {
            shippingAddress: form.address,
            receiverName: form.fullName,
            phone: form.phone,
            note: form.notes, // <--- THÊM FIELD NÀY (hoặc 'notes' tùy thuộc vào BE của bạn yêu cầu)
            paymentMethod: payMethod === "cod" ? "COD" : payMethod.toUpperCase(),
            items: cartItems.map((item) => ({
                productId: item?.product?.id ?? item?.productId,
                quantity: item?.quantity ?? item?.qty ?? 1,
            })),
        };

        try {
            setIsSubmitting(true);
            await checkoutCart(payload);
            message.success("Đặt hàng thành công!");
            navigate("/success");
        } catch (error) {
            message.error(
                error?.response?.data?.message ||
                error?.message ||
                "Đặt hàng thất bại, vui lòng thử lại"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <BillingField
                            label="Full Name"
                            required
                            name="fullName"
                            value={form.fullName}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, fullName: e.target.value }))
                            }
                        />
                        <BillingField
                            label="Address"
                            required
                            name="address"
                            value={form.address}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, address: e.target.value }))
                            }
                        />
                        <BillingField
                            label="Phone Number"
                            required
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, phone: e.target.value }))
                            }
                        />
                        <BillingField
                            label="Order Notes"
                            multiline
                            name="notes"
                            value={form.notes}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, notes: e.target.value }))
                            }
                        />
                    </div>

                    <div className="w-full lg:w-[470px] shrink-0 lg:mt-6">
                        <div className="flex flex-col mb-6">
                            {cartItems.map((item) => {
                                const product = item?.product ?? {};
                                const name = product?.name ?? item?.name ?? "Product";
                                const priceValue =
                                    (Number(item?.price ?? product?.price ?? 0) *
                                        Number(item?.quantity ?? item?.qty ?? 0)) || 0;

                                return (
                                    <OrderItem
                                        key={item.id}
                                        image={product?.productImg || product?.image || imgMonitor}
                                        name={name}
                                        price={formatCurrency(priceValue)}
                                    />
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-0 border-b border-black border-opacity-40 pb-4 mb-4">
                            <div className="flex items-center justify-between py-4 border-b border-black border-opacity-20">
                                <span className="text-base text-black">Subtotal:</span>
                                <span className="text-base font-medium text-black">
                                    {formatCurrency(subTotal)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-black border-opacity-20">
                                <span className="text-base text-black">Shipping:</span>
                                <span className="text-base font-medium text-[#db4444]">Free</span>
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <span className="text-base text-black">Total:</span>
                                <span className="text-base font-medium text-black">
                                    {formatCurrency(subTotal)}
                                </span>
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

                        {/* Thêm xử lý disabled khi đang submit */}
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting}
                            className="bg-[#db4444] text-white px-10 py-4 rounded font-medium hover:bg-[#c03c3c] transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Placing Order..." : "Place Order"}
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}