import React, { useEffect, useMemo, useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCart, deleteCart } from "../../service/cart/api";
import { useRef } from "react";
const imgFallback = "https://placehold.co/100x100/f5f5f5/333333/png?text=Product";

function QtySpinner({ value, onChange }) {
    return (
        <div className="flex items-center border border-gray-400 rounded h-11 w-[120px]">
            <button
                // THAY ĐỔI 1: Cho phép giảm về 0 (để xóa)
                onClick={() => onChange(value - 1)}
                className="w-10 h-full flex items-center justify-center hover:bg-[#db4444] hover:text-white transition-colors border-r border-gray-400 hover:border-[#db4444] rounded-l"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <span className="flex-1 text-center text-base font-medium text-black select-none">
                {String(value).padStart(2, "0")}
            </span>

            <button
                onClick={() => onChange(value + 1)}
                className="w-10 h-full flex items-center justify-center hover:bg-[#db4444] hover:text-white transition-colors border-l border-gray-400 hover:border-[#db4444] rounded-r"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        </div>
    );
}

function CartRow({ image, name, unitPrice, qty, onQtyChange, onRemove }) {
    const subtotal = unitPrice * qty;

    return (
        <div className="bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] min-h-[102px] relative flex flex-wrap md:flex-nowrap items-center px-6 py-4 md:py-0 gap-4 md:gap-0">
            <button
                onClick={onRemove}
                className="absolute left-2 top-2 md:left-7 md:top-1/2 md:-translate-y-1/2 w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
            >
                <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="#DB4444" />
                    <path d="M6 6L12 12M12 6L6 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
            </button>

            <div className="flex items-center gap-4 md:gap-6 w-full md:w-[320px] md:pl-10">
                <div className="w-[54px] h-[54px] overflow-hidden shrink-0">
                    <img src={image} alt={name} className="w-full h-full object-contain" />
                </div>
                <span className="text-base text-black truncate">{name}</span>
            </div>

            <span className="text-base text-black w-1/3 md:w-[160px] md:ml-4">
                ${unitPrice.toLocaleString()}
            </span>

            <div className="w-1/3 md:w-[150px] flex justify-center md:justify-start md:ml-4">
                <QtySpinner value={qty} onChange={onQtyChange} />
            </div>

            <span className="text-base text-black w-1/3 md:w-auto md:ml-auto text-right md:text-left font-medium">
                ${subtotal.toLocaleString()}
            </span>
        </div>
    );
}

export default function Cart() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemsRef = useRef(items);
    const isModifiedRef = useRef(false);
    
    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    const syncCartWithServer = async () => {
        // Nếu không có thay đổi gì thì không gọi API cho đỡ tốn tài nguyên
        if (!isModifiedRef.current) return;

        const payloads = itemsRef.current
            .filter((it) => it.qty > 0)
            .map((it) => ({
                productId: it.id,
                quantity: it.qty,
            }));

        try {
            await Promise.all(payloads.map((p) => updateCart(p)));
            isModifiedRef.current = false;
        } catch (err) {
            console.error("Lỗi đồng bộ giỏ hàng", err);
        }
    };

    // 3. XỬ LÝ SỰ KIỆN RỜI KHỎI TRANG HOẶC ĐÓNG TAB
    useEffect(() => {
        // Sự kiện khi người dùng đóng tab, f5 hoặc chuyển sang app khác
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                syncCartWithServer();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Sự kiện Cleanup function: Chạy khi Component Unmount 
        // (Ví dụ: bấm vào <Link to="/">Return to shop</Link>)
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            syncCartWithServer(); 
        };
    }, []); // Chạy 1 lần khi mount

    // 4. XỬ LÝ KHI BẤM NÚT CHECKOUT
    const handleCheckout = async (e) => {
        e.preventDefault();
        await syncCartWithServer(); 
        navigate("/checkout");
    };
    useEffect(() => {
        let alive = true;

        const fetchCart = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getCart();
                const cartItems = res?.data?.cartItems ?? [];

                const normalized = (Array.isArray(cartItems) ? cartItems : []).map((ci) => {
                    const product = ci?.product ?? {};
                    const name = product?.name ?? ci?.name ?? "Unknown product";
                    const unitPrice = Number(ci?.price ?? product?.price ?? 0);
                    const qty = Number(ci?.quantity ?? ci?.qty ?? 0);
                    const image = product?.productImg || product?.image || imgFallback;

                    return {
                        id: ci?.id ?? product?.id ?? name,
                        name,
                        unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
                        qty: Number.isFinite(qty) ? qty : 0,
                        image,
                    };
                });

                if (!alive) return;
                setItems(normalized.filter((it) => it.qty > 0));
            } catch (e) {
                if (!alive) return;
                setError(e?.message || "Không thể lấy giỏ hàng. Vui lòng thử lại.");
                setItems([]);
            } finally {
                // eslint-disable-next-line no-unsafe-finally
                if (!alive) return;
                setLoading(false);
            }
        };

        fetchCart();
        return () => {
            alive = false;
        };
    }, []);

    const removeItem = async (id) => {
        // Cập nhật state local trước (UX mượt hơn)
        setItems((prev) => prev.filter((it) => it.id !== id));
        // Đánh dấu giỏ hàng đã bị thay đổi
        isModifiedRef.current = true;

        try {
            await deleteCart(id);
        } catch (err) {
            console.error("Lỗi xóa item khỏi giỏ hàng", err);
        }
    };

    // THAY ĐỔI 2: Xử lý logic xóa khi số lượng = 0
    const updateQty = (id, qty) => {
        if (qty === 0) {
            // Nếu người dùng giảm từ 1 xuống 0 -> Xóa khỏi giỏ hàng
            removeItem(id);
        } else {
            // Ngược lại thì cập nhật số lượng bình thường
            setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)));
            isModifiedRef.current = true;
        }
    };

    const subtotal = useMemo(
        () => items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0),
        [items]
    );

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Header />

            <main className="max-w-[1170px] mx-auto px-4 py-10">
                <div className="text-sm text-gray-500 mb-10">
                    <span className="hover:text-black cursor-pointer">Home</span> <span className="mx-2">/</span> <span className="text-black font-medium">Cart</span>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-500">Đang tải giỏ hàng...</div>
                ) : error ? (
                    <div className="py-20 text-center">
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#db4444] text-white px-8 py-3 rounded font-medium hover:bg-[#c03c3c] transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : items.length > 0 ? (
                    <>
                        <div className="hidden md:flex bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] h-[72px] items-center px-6 mb-4">
                            <span className="text-base font-medium text-black w-[320px]">Product</span>
                            <span className="text-base font-medium text-black w-[160px] ml-4">Price</span>
                            <span className="text-base font-medium text-black w-[140px] ml-4">Quantity</span>
                            <span className="text-base font-medium text-black ml-auto">Subtotal</span>
                        </div>

                        <div className="flex flex-col gap-4 mb-6">
                            {items.map((item) => (
                                <CartRow
                                    key={item.id}
                                    {...item}
                                    onQtyChange={(qty) => updateQty(item.id, qty)}
                                    onRemove={() => removeItem(item.id)}
                                />
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <div className="border border-black border-opacity-50 rounded w-full md:w-[470px] p-6">
                                <h3 className="text-xl font-medium text-black mb-6">Cart Total</h3>

                                <div className="flex items-center justify-between py-4 border-b border-black border-opacity-20">
                                    <span className="text-base text-black">Subtotal:</span>
                                    <span className="text-base font-medium text-black">${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-black border-opacity-20">
                                    <span className="text-base text-black">Shipping:</span>
                                    <span className="text-base font-medium text-[#db4444]">Free</span>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <span className="text-base text-black">Total:</span>
                                    <span className="text-base font-medium text-black">${subtotal.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={handleCheckout}
                                        className="bg-[#db4444] text-white px-10 py-3 rounded font-medium hover:bg-[#c03c3c] transition-colors"
                                    >
                                        Proceed to checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 flex flex-col items-center gap-4">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <p className="text-xl font-medium text-gray-500">Your cart is currently empty.</p>
                        {/* THAY ĐỔI 3: Dùng Link thay cho button để điều hướng về trang chủ */}
                        <Link to="/" className="mt-4 bg-[#db4444] text-white px-8 py-3 rounded font-medium hover:bg-[#c03c3c] transition-colors">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}