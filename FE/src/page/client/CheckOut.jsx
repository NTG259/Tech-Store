import React, { useEffect, useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { Link, useNavigate } from "react-router-dom"; 
import { message } from "antd";
import { getCart, checkoutCart } from "../../service/cart/api";
import { fetchProfileAPI } from "../../service/user/api";

const imgMonitor = "https://placehold.co/100x100/f5f5f5/333333/png?text=Monitor";
const imgGamepad = "https://placehold.co/100x100/f5f5f5/333333/png?text=Gamepad";

// --- Component Text Input ---
function BillingField({ label, required, type = "text", multiline = false, value, onChange, name, placeholder }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-black">
                {label}
                {required && <span className="text-[#db4444] ml-1">*</span>}
            </label>
            {multiline ? (
                <textarea
                    name={name}
                    rows={6}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-[#f5f5f5] rounded px-4 py-3 text-base text-black outline-none focus:ring-2 focus:ring-[#db4444] resize-none placeholder:italic placeholder:text-gray-400"
                />
            ) : (
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full h-[50px] bg-[#f5f5f5] rounded px-4 text-base text-black outline-none focus:ring-2 focus:ring-[#db4444] placeholder:italic placeholder:text-gray-400"
                />
            )}
        </div>
    );
}

// --- Component Select Dropdown ---
function SelectField({ label, required, options = [], value, onChange, name }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-black">
                {label}
                {required && <span className="text-[#db4444] ml-1">*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full h-[50px] bg-[#f5f5f5] rounded px-4 text-base text-black outline-none focus:ring-2 focus:ring-[#db4444]"
            >
                <option value="" disabled>-- Chọn {label.toLowerCase()} --</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.name}
                    </option>
                ))}
            </select>
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
        specificAddress: "",
        phone: "",
        notes: "",
    });

    const [cities, setCities] = useState([]);
    const [wards, setWards] = useState([]);
    
    const [selectedCity, setSelectedCity] = useState({ id: "", name: "" });
    const [selectedWard, setSelectedWard] = useState({ id: "", name: "" });

    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [isFetchingProfile, setIsFetchingProfile] = useState(false);
    const [isProfileUsed, setIsProfileUsed] = useState(false); 
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch("http://localhost:8082/api/address/provinces");
                const data = await res.json();
                
                if (data && data.provinces) {
                    const mappedCities = data.provinces.map((p) => ({
                        id: p.code, 
                        name: p.name
                    }));
                    setCities(mappedCities);
                } else {
                    setCities([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thành phố:", error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const fetchWards = async () => {
            if (!selectedCity.id) {
                setWards([]);
                return;
            }
            try {
                const res = await fetch(`http://localhost:8082/api/address/wards?provinceId=${selectedCity.id}`);
                const data = await res.json();
                
                let mappedWards = [];
                if (data && data.communes) {
                    mappedWards = data.communes.map((w) => ({
                        id: w.code,
                        name: w.name
                    }));
                } else if (Array.isArray(data)) {
                    mappedWards = data.map((w) => ({
                        id: w.code || w.id,
                        name: w.name
                    }));
                }
                
                setWards(mappedWards);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách xã/phường:", error);
            }
        };
        fetchWards();
    }, [selectedCity.id]);

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

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        const cityObj = cities.find(c => c.id.toString() === cityId);
        setSelectedCity({ id: cityId, name: cityObj?.name || "" });
        setSelectedWard({ id: "", name: "" });
    };

    const handleWardChange = (e) => {
        const wardId = e.target.value;
        const wardObj = wards.find(w => w.id.toString() === wardId);
        setSelectedWard({ id: wardId, name: wardObj?.name || "" });
    };

    const handleFillProfile = async () => {
        try {
            setIsFetchingProfile(true);
            const res = await fetchProfileAPI();
            const user = res?.data?.data || res?.data || res;

            if (!user) {
                message.warning("Không tìm thấy thông tin cá nhân");
                return;
            }

            setForm(prev => ({
                ...prev,
                fullName: user.fullName || prev.fullName,
                phone: user.phoneNumber || prev.phone, 
                specificAddress: user.address || prev.specificAddress,
            }));

            if (user.cityId) {
                const cityIdStr = user.cityId.toString();
                const cityObj = cities.find(c => c.id.toString() === cityIdStr);
                setSelectedCity({ id: cityIdStr, name: cityObj?.name || "" });

                try {
                    const resWards = await fetch(`http://localhost:8082/api/address/wards?provinceId=${cityIdStr}`);
                    const dataWards = await resWards.json();

                    let mappedWards = [];
                    if (dataWards && dataWards.communes) {
                        mappedWards = dataWards.communes.map((w) => ({ id: w.code, name: w.name }));
                    } else if (Array.isArray(dataWards)) {
                        mappedWards = dataWards.map((w) => ({ id: w.code || w.id, name: w.name }));
                    }

                    setWards(mappedWards);

                    if (user.wardId) {
                        const wardIdStr = user.wardId.toString();
                        const wardObj = mappedWards.find(w => w.id.toString() === wardIdStr);
                        setSelectedWard({ id: wardIdStr, name: wardObj?.name || "" });
                    }
                } catch (err) {
                    console.error("Lỗi khi fetch xã/phường cho auto-fill:", err);
                }
            }

            message.success("Đã tự động điền thông tin cá nhân!");
            setIsProfileUsed(true);
        } catch (error) {
            message.error("Lỗi khi tải thông tin cá nhân");
        } finally {
            setIsFetchingProfile(false);
        }
    };

    // ====== HÀM XỬ LÝ THANH TOÁN (CẬP NHẬT) ======
    const handlePlaceOrder = async () => {
        if (!form.fullName || !form.phone || !selectedCity.name || !selectedWard.name || !form.specificAddress) {
            message.error("Vui lòng nhập đầy đủ thông tin giao hàng (Họ tên, Thành phố, Xã, Địa chỉ cụ thể, SĐT)");
            return;
        }

        if (!cartItems.length) {
            message.error("Giỏ hàng trống, không thể đặt hàng");
            return;
        }

        const fullShippingAddress = `${selectedCity.name} - ${selectedWard.name} - ${form.specificAddress}`;

        const payload = {
            shippingAddress: fullShippingAddress,
            receiverName: form.fullName,
            phone: form.phone,
            note: form.notes,
            paymentMethod: payMethod === "cod" ? "COD" : "VNPAY",
            items: cartItems.map((item) => ({
                productId: item?.product?.id ?? item?.productId,
                quantity: item?.quantity ?? item?.qty ?? 1,
            })),
        };

        try {
            setIsSubmitting(true);
            
            // 1. Luôn tiến hành Đặt Hàng trước để backend tạo Order trong Database
            const checkoutRes = await checkoutCart(payload);
            
            // Lấy orderId từ response (Vui lòng điều chỉnh '.id' hoặc '.orderId' tùy theo cấu trúc API của bạn trả về)
            const createdOrderId = checkoutRes?.data?.id || checkoutRes?.data?.orderId || checkoutRes?.id;

            // 2. Nếu thanh toán VNPAY, gọi API lấy link VNPay
            if (payMethod === "vnpay") {
                if (!createdOrderId) {
                    message.error("Lỗi: Không tìm thấy mã đơn hàng vừa tạo để thanh toán.");
                    setIsSubmitting(false);
                    return;
                }

                const token = localStorage.getItem("access_token");

                // Gọi API backend Spring Boot mà bạn vừa xây dựng
                const vnpayRes = await fetch(`http://localhost:8082/api/payment/vnpay/create-payment?amount=${subTotal}&paymentRef=${createdOrderId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const vnpayData = await vnpayRes.json();

                if (vnpayData && vnpayData.paymentUrl) {
                    // Chuyển hướng người dùng thẳng sang trang thanh toán của VNPay
                    window.location.href = vnpayData.paymentUrl;
                } else {
                    message.error("Lỗi: Không thể khởi tạo link thanh toán VNPay");
                    setIsSubmitting(false);
                }
            } else {
                // Nếu thanh toán COD
                message.success("Đặt hàng thành công!");
                navigate("/success");
            }
        } catch (error) {
            message.error(
                error?.response?.data?.message ||
                error?.message ||
                "Đặt hàng thất bại, vui lòng thử lại"
            );
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Header />

            <main className="max-w-[1170px] mx-auto px-4 py-10">
                <div className="text-sm text-gray-500 mb-10 flex flex-wrap gap-2">
                    <span className="hover:text-black cursor-pointer">Trang chủ</span>
                    <span>/</span>
                    <span className="text-black font-medium">Đặt hàng</span>
                </div>

                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-3xl md:text-4xl font-medium text-black tracking-wide">Hóa đơn</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">
                    
                    {/* KHU VỰC ĐIỀN THÔNG TIN */}
                    <div className="flex flex-col gap-6 w-full lg:flex-1">
                        
                        {!isProfileUsed && (
                            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
                                <span className="text-sm text-gray-600">Bạn muốn sử dụng thông tin tài khoản?</span>
                                <button 
                                    onClick={handleFillProfile}
                                    disabled={isFetchingProfile}
                                    type="button"
                                    className="bg-black text-white px-3 py-1.5 rounded text-xs hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    {isFetchingProfile ? "Đang tải..." : "Dùng thông tin"}
                                </button>
                            </div>
                        )}

                        <BillingField
                            label="Họ và tên người nhận"
                            required
                            name="fullName"
                            value={form.fullName}
                            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                        />

                        <BillingField
                            label="Số điện thoại"
                            required
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                        />

                        <SelectField 
                            label="Tỉnh/Thành phố"
                            required
                            name="city"
                            options={cities}
                            value={selectedCity.id}
                            onChange={handleCityChange}
                        />

                        <SelectField 
                            label="Xã/Phường"
                            required
                            name="ward"
                            options={wards}
                            value={selectedWard.id}
                            onChange={handleWardChange}
                        />

                        <BillingField
                            label="Địa chỉ cụ thể nơi nhận (Số nhà, đường...)"
                            required
                            name="specificAddress"
                            placeholder="Ví dụ: Số 123, Đường Lê Lợi"
                            value={form.specificAddress}
                            onChange={(e) => setForm((prev) => ({ ...prev, specificAddress: e.target.value }))}
                        />
                        
                        <BillingField
                            label="Ghi chú"
                            multiline
                            name="notes"
                            value={form.notes}
                            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                        />
                    </div>

                    {/* KHU VỰC TỔNG KẾT ĐƠN HÀNG */}
                    <div className="w-full lg:w-[470px] shrink-0">
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
                                <span className="text-base text-black">Tạm tính:</span>
                                <span className="text-base font-medium text-black">
                                    {formatCurrency(subTotal)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-black border-opacity-20">
                                <span className="text-base text-black">Phí vận chuyển:</span>
                                <span className="text-base font-medium text-[#db4444]">Miễn phí</span>
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <span className="text-base text-black">Tổng tiền:</span>
                                <span className="text-base font-medium text-black">
                                    {formatCurrency(subTotal)}
                                </span>
                            </div>
                        </div>

                        {/* --- BỔ SUNG LỰA CHỌN THANH TOÁN --- */}
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
                                <span className="text-base text-black">Thanh toán khi nhận hàng (COD)</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="vnpay"
                                    checked={payMethod === "vnpay"}
                                    onChange={() => setPayMethod("vnpay")}
                                    className="w-5 h-5 accent-[#db4444]"
                                />
                                <span className="text-base text-black flex items-center gap-2">
                                    Thanh toán online (VNPay)
                                </span>
                            </label>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting}
                            className="bg-[#db4444] text-white px-10 py-4 rounded font-medium hover:bg-[#c03c3c] transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}