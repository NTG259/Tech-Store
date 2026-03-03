import React, { useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { Link } from "react-router-dom";

const imgMonitor = "https://placehold.co/100x100/f5f5f5/333333/png?text=Monitor";
const imgGamepad = "https://placehold.co/100x100/f5f5f5/333333/png?text=Gamepad";

/**
 * QtySpinner Component
 * - Hiển thị nút tăng/giảm số lượng sản phẩm
 * - value: số lượng hiện tại từ props của CartRow
 * - onChange: hàm callback để gửi số lượng mới lên parent component
 */
function QtySpinner({ value, onChange }) {
    return (
        <div className="flex items-center border border-gray-400 rounded h-11 w-[120px]">
            {/* 
              NÚT GIẢM LƯỢNG (-) 
              - onClick: gọi onChange với số lượng mới = value - 1 (tối thiểu là 1)
              - onChange gửi giá trị lên CartRow
              - CartRow gọi onQtyChange từ parent (Cart component)
              - updateQty được thực thi để cập nhật state items
            */}
            <button
                onClick={() => onChange(Math.max(1, value - 1))}
                className="w-10 h-full flex items-center justify-center hover:bg-[#db4444] hover:text-white transition-colors border-r border-gray-400 hover:border-[#db4444] rounded-l"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <span className="flex-1 text-center text-base font-medium text-black select-none">
                {String(value).padStart(2, "0")}
            </span>

            {/* 
              NÚT TĂNG LƯỢNG (+)
              - onClick: gọi onChange với số lượng mới = value + 1
              - onChange gửi giá trị lên CartRow
              - CartRow gọi onQtyChange từ parent (Cart component)
              - updateQty được thực thi để cập nhật state items
            */}
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

/**
 * CartRow Component
 * - Hiển thị một sản phẩm trong giỏ hàng
 * - image, name, unitPrice, qty: dữ liệu từ mảng items (Cart component)
 * - onQtyChange: callback từ parent Cart component - updateQty
 * - onRemove: callback từ parent Cart component - removeItem
 * 
 * LUỒNG UPDATE SỐ LƯỢNG:
 * 1. User click nút +/- ở QtySpinner
 * 2. QtySpinner gọi onChange(newQty)
 * 3. onChange truyền lên CartRow: onQtyChange={(qty) => updateQty(item.id, qty)}
 * 4. updateQty được gọi với (id, newQty)
 * 5. setItems cập nhật state - tìm sản phẩm có cùng id và update qty
 * 6. Component re-render với dữ liệu mới
 * 7. Subtotal được tính lại: unitPrice * qty
 */
function CartRow({ image, name, unitPrice, qty, onQtyChange, onRemove }) {
    // Tính tổng tiền của dòng này: giá/sản phẩm × số lượng
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
                {/* 
                  QtySpinner Component
                  - value={qty}: truyền số lượng hiện tại vào
                  - onChange={onQtyChange}: khi user click +/-, onQtyChange được gọi
                  - onQtyChange = (qty) => updateQty(item.id, qty)
                  - updateQty sẽ cập nhật state items trong Cart component
                */}
                <QtySpinner value={qty} onChange={onQtyChange} />
            </div>

            <span className="text-base text-black w-1/3 md:w-auto md:ml-auto text-right md:text-left font-medium">
                ${subtotal.toLocaleString()}
            </span>
        </div>
    );
}

export default function Cart() {
    /**
     * STATE: items - Mảng chứa tất cả sản phẩm trong giỏ
     * Cấu trúc mỗi sản phẩm:
     * {
     *   id: 1,           // ID sản phẩm - dùng để tìm kiếm
     *   name: "...",     // Tên sản phẩm
     *   unitPrice: 650,  // Giá một sản phẩm
     *   qty: 1,          // Số lượng - GIÁ TRỊ ĐƯỢC UPDATE
     *   image: "..."     // URL ảnh
     * }
     */
    const [items, setItems] = useState([
        { id: 1, name: "LCD Monitor", unitPrice: 650, qty: 1, image: imgMonitor },
        { id: 2, name: "H1 Gamepad", unitPrice: 550, qty: 2, image: imgGamepad },
    ]);

    /**
     * LUỒNG UPDATE SỐ LƯỢNG CHI TIẾT:
     * 
     * 1️⃣ User click nút +/- trên QtySpinner
     * 
     * 2️⃣ QtySpinner gọi onChange(newQty)
     *    - onChange = onQtyChange từ CartRow
     *    - onQtyChange = (qty) => updateQty(item.id, qty) từ Cart component
     * 
     * 3️⃣ updateQty được gọi với (id=2, newQty=3)
     *    updateQty(id, qty) => 
     *      setItems(prev => prev.map(it => 
     *        it.id === id ? { ...it, qty } : it  // Nếu id match, update qty
     *      ))
     * 
     * 4️⃣ setItems thay đổi state:
     *    - Items cũ: [ {id:1, qty:1}, {id:2, qty:2} ]
     *    - Items mới: [ {id:1, qty:1}, {id:2, qty:3} ]
     * 
     * 5️⃣ Component re-render với state mới
     * 
     * 6️⃣ subtotal tính lại: 1*650 + 3*550 = 650 + 1650 = 2300
     * 
     * 7️⃣ Giao diện cập nhật:
     *    - QtySpinner hiển thị qty=3 mới
     *    - Subtotal dòng sản phẩm 2: 3*550 = 1650 (cập nhật)
     *    - Cart Total: 2300 (cập nhật)
     */
    const updateQty = (id, qty) =>
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)));

    const removeItem = (id) =>
        setItems((prev) => prev.filter((it) => it.id !== id));

    // Tính tổng tiền của tất cả sản phẩm = Σ(giá × số lượng)
    // Ví dụ: (650×1) + (550×3) = 650 + 1650 = 2300
    const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Header />

            <main className="max-w-[1170px] mx-auto px-4 py-10">
                <div className="text-sm text-gray-500 mb-10">
                    <span className="hover:text-black cursor-pointer">Home</span> <span className="mx-2">/</span> <span className="text-black font-medium">Cart</span>
                </div>

                {items.length > 0 ? (
                    <>
                        <div className="hidden md:flex bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] h-[72px] items-center px-6 mb-4">
                            <span className="text-base font-medium text-black w-[320px]">Product</span>
                            <span className="text-base font-medium text-black w-[160px] ml-4">Price</span>
                            <span className="text-base font-medium text-black w-[140px] ml-4">Quantity</span>
                            <span className="text-base font-medium text-black ml-auto">Subtotal</span>
                        </div>

                        <div className="flex flex-col gap-4 mb-6">
                            {/* 
                              Render tất cả CartRow
                              - items: dữ liệu từ state
                              - onQtyChange: callback để update qty khi user click +/-
                              - onRemove: callback để xóa sản phẩm
                              
                              KHI USER THAY ĐỔI SỐ LƯỢNG:
                              CartRow → QtySpinner → onChange → onQtyChange → updateQty → setItems → re-render
                            */}
                            {items.map((item) => (
                                <CartRow
                                    key={item.id}
                                    {...item}
                                    onQtyChange={(qty) => updateQty(item.id, qty)}
                                    onRemove={() => removeItem(item.id)}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
                            <Link to = "/" className="w-full sm:w-auto border border-black border-opacity-50 text-base font-medium text-black px-10 py-3 rounded hover:bg-gray-50 transition-colors">
                                Return To Shop
                            </Link>
                            <button className="w-full sm:w-auto border border-black border-opacity-50 text-base font-medium text-black px-10 py-3 rounded hover:bg-gray-50 transition-colors">
                                Update Cart
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <div className="border border-black border-opacity-50 rounded w-full md:w-[470px] p-6">
                                <h3 className="text-xl font-medium text-black mb-6">Cart Total</h3>

                                <div className="flex items-center justify-between py-4 border-b border-black border-opacity-20">
                                    <span className="text-base text-black">Subtotal:</span>
                                    {/* 
                                      Hiển thị giá trị SUBTOTAL
                                      - subtotal được tính lại mỗi khi items thay đổi
                                      - subtotal = tổng (giá × số lượng) của tất cả sản phẩm
                                      - Khi user update qty, subtotal tự động cập nhật
                                      - Ví dụ: nếu qty của Monitor thay đổi từ 1 → 2
                                        subtotal cũ: (650×1) + (550×2) = 1750
                                        subtotal mới: (650×2) + (550×2) = 2400
                                    */}
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
                                    <Link to = "/checkout" className="bg-[#db4444] text-white px-10 py-3 rounded font-medium hover:bg-[#c03c3c] transition-colors">
                                        Proceed to checkout
                                    </Link>
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
                        <button className="mt-4 bg-[#db4444] text-white px-8 py-3 rounded font-medium hover:bg-[#c03c3c] transition-colors">
                            Return To Shop
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}