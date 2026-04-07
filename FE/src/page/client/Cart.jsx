import React, { useEffect, useMemo, useState, useRef } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCart, deleteCart } from "../../service/cart/api";

const imgFallback = "https://placehold.co/100x100/f5f5f5/333333/png?text=Product";

function QtySpinner({ value, onChange }) {
    return (
        <div className="flex items-center border border-gray-400 rounded h-11 w-[120px]">
            <button
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
    const [invalidItems, setInvalidItems] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemsRef = useRef(items);
    const isModifiedRef = useRef(false);
    
    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    // HÀM ĐỒNG BỘ: Chỉ gọi API updateCart khi có thao tác +/- số lượng
    const syncCartWithServer = async () => {
        if (!isModifiedRef.current) return;

        const payloads = itemsRef.current
            .filter((it) => it.qty > 0)
            .map((it) => ({
                productId: it.id, // Đảm bảo Backend cần productId ở đây
                quantity: it.qty,
            }));

        try {
            await Promise.all(payloads.map((p) => updateCart(p)));
            isModifiedRef.current = false;
        } catch (err) {
            console.error("Lỗi đồng bộ giỏ hàng", err);
        }
    };

    // BẮT SỰ KIỆN CHUYỂN TAB / ĐÓNG TRANG
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                syncCartWithServer();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            syncCartWithServer(); 
        };
    }, []); 

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (invalidItems.length > 0) return; 
        
        await syncCartWithServer(); 
        navigate("/checkout");
    };

    // FETCH GIỎ HÀNG TỪ SERVER
    useEffect(() => {
        let alive = true;

        const fetchCart = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getCart();
                
                const cartItems = res?.data?.cartItems ?? [];
                const resInvalidItems = res?.data?.invalidItems ?? [];

                const normalized = (Array.isArray(cartItems) ? cartItems : []).map((ci) => {
                    const product = ci?.product ?? {};
                    const name = product?.name ?? ci?.name ?? "Unknown product";
                    const unitPrice = Number(ci?.price ?? product?.price ?? 0);
                    const qty = Number(ci?.quantity ?? ci?.qty ?? 0);
                    const image = product?.productImg || product?.image || imgFallback;

                    return {
                        id: product?.id, // Lấy ID của Product để update/delete
                        cartItemId: ci?.id, 
                        name,
                        unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
                        qty: Number.isFinite(qty) ? qty : 0,
                        image,
                    };
                });

                if (!alive) return;
                setItems(normalized.filter((it) => it.qty > 0));
                setInvalidItems(resInvalidItems);
                
            } catch (e) {
                if (!alive) return;
                setError(e?.message || "Không thể lấy giỏ hàng. Vui lòng thử lại.");
                setItems([]);
                setInvalidItems([]);
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        };

        fetchCart();
        return () => { alive = false; };
    }, []);

    // ---------------- LÔ-GIC XÓA VÀ CẬP NHẬT ----------------

    // 1. Hàm xóa sản phẩm hợp lệ
    const removeItem = async (productId) => {
        setItems((prev) => prev.filter((it) => it.id !== productId));
        try {
            await deleteCart(productId); // Gọi API xóa lập tức
        } catch (err) {
            console.error("Lỗi xóa item khỏi giỏ hàng", err);
        }
    };

    // 2. Hàm xóa sản phẩm KHÔNG hợp lệ (ngừng kinh doanh)
    const removeInvalidItem = async (productId) => {
        if (!productId) return;
        
        setInvalidItems((prev) => prev.filter((it) => {
            const currentId = it.productResponse?.id || it.product?.id;
            return currentId !== productId;
        }));
        
        try {
            await deleteCart(productId); // Gọi API xóa lập tức
        } catch (err) {
            console.error("Lỗi xóa sản phẩm ngừng kinh doanh", err);
        }
    }

    // 3. Hàm cập nhật số lượng (+ / -)
    const updateQty = (id, qty) => {
        if (qty === 0) {
            removeItem(id); // Nếu giảm về 0 -> Gọi hàm xóa
        } else {
            setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)));
            // CHỈ ĐÁNH DẤU MODIFIED KHI THAY ĐỔI SỐ LƯỢNG (để auto-save khi chuyển tab)
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
                ) : (items.length > 0 || invalidItems.length > 0) ? (
                    <>
                        {/* DANH SÁCH SẢN PHẨM HỢP LỆ */}
                        {items.length > 0 && (
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
                            </>
                        )}

                        {/* CẢNH BÁO SẢN PHẨM NGỪNG KINH DOANH */}
                        {invalidItems.length > 0 && (
                            <div className="mb-10 p-5 bg-red-50 border border-red-200 rounded-md">
                                <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                    Sản phẩm không thể thanh toán
                                </h3>
                                
                                <div className="flex flex-col gap-4">
                                    {invalidItems.map((invalidItem, index) => {
                                        const productData = invalidItem.productResponse || invalidItem.product || {};
                                        const name = productData.name || "Unknown Product";
                                        const image = productData.productImg || imgFallback;
                                        
                                        // ĐÃ CÓ ID TỪ BACKEND
                                        const deleteId = productData.id; 

                                        return (
                                            <div key={index} className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded shadow-sm opacity-70">
                                                <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                                                    <img src={image} alt={name} className="w-16 h-16 object-cover rounded" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-800 line-through">{name}</h4>
                                                        <p className="text-sm text-red-600 font-medium">{invalidItem.reason}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => removeInvalidItem(deleteId)}
                                                    className="w-full md:w-auto px-6 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors"
                                                >
                                                    Xóa khỏi giỏ hàng
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TỔNG TIỀN & NÚT CHECKOUT */}
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

                                {invalidItems.length > 0 && (
                                    <p className="text-red-500 text-sm mt-4 text-center italic">
                                        * Vui lòng xóa các sản phẩm ngừng kinh doanh trước khi tiến hành thanh toán.
                                    </p>
                                )}

                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={handleCheckout}
                                        disabled={invalidItems.length > 0 || items.length === 0}
                                        className={`px-10 py-3 rounded font-medium transition-colors ${
                                            invalidItems.length > 0 || items.length === 0
                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                            : "bg-[#db4444] text-white hover:bg-[#c03c3c]"
                                        }`}
                                    >
                                        Thanh toán
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
                        <p className="text-xl font-medium text-gray-500">Giỏ hàng của bạn đang trống.</p>
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