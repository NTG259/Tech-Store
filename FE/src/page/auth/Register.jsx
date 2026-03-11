import React, { useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd"; // Import message từ antd để hiển thị thông báo
// Nhớ import registerAPI từ đúng đường dẫn file api của bạn
import { registerAPI } from "../../service/auth/api"; 

function UnderlineInput({ placeholder, type = "text", value, onChange }) {
    return (
        <div className="flex flex-col gap-2 w-[370px]">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border-b border-black border-opacity-50 pb-2 text-base text-black placeholder-black placeholder-opacity-40 outline-none focus:border-opacity-100 focus:border-[#db4444] transition-colors"
            />
        </div>
    );
}

const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false); // Thêm state loading
    const navigate = useNavigate(); // Hook dùng để chuyển hướng trang

    const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

    // Hàm xử lý gọi API đăng ký
    const handleRegister = async () => {
        // Validate cơ bản
        if (!form.name || !form.email || !form.password) {
            message.warning("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            setIsLoading(true);
            
            // Gọi API
            await registerAPI(form);
            
            // Thông báo thành công
            message.success("Đăng ký thành công! Vui lòng đăng nhập.");
            
            // Đưa về trang login
            navigate("/login");

        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            // Bắt lỗi từ backend trả về (nếu email đã tồn tại, v.v.)
            const errMsg = error?.response?.data?.message || error?.message || "Đăng ký thất bại. Vui lòng thử lại!";
            message.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Header />

            <div className="w-full border-b border-black border-opacity-30" />

            <div className="flex flex-1">
                <div className="flex-1 flex items-center justify-center px-16 py-20">
                    <div className="flex flex-col gap-12 w-[370px]">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-4xl font-semibold text-black tracking-wide">Create an account</h1>
                            <p className="text-base text-black">Enter your details below</p>
                        </div>

                        <div className="flex flex-col gap-10">
                            <UnderlineInput
                                placeholder="Name"
                                value={form.name}
                                onChange={set("name")}
                            />
                            <UnderlineInput
                                placeholder="Email"
                                type="email"
                                value={form.email}
                                onChange={set("email")}
                            />
                            <UnderlineInput
                                placeholder="Password"
                                type="password"
                                value={form.password}
                                onChange={set("password")}
                            />
                        </div>

                        <div className="flex flex-col gap-4 items-center">
                            {/* Thêm sự kiện onClick và disabled khi đang load */}
                            <button 
                                onClick={handleRegister}
                                disabled={isLoading}
                                className="w-full bg-[#db4444] text-white text-base py-4 rounded hover:bg-[#c03c3c] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Creating..." : "Create Account"}
                            </button>

                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-base text-black opacity-70">Already have account?</span>
                                <div className="flex flex-col gap-0.5">
                                    <Link to="/login" className="text-base text-black opacity-70 hover:opacity-100 transition-opacity">
                                        Log in
                                    </Link>
                                    <div className="h-px bg-black opacity-50 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Register;