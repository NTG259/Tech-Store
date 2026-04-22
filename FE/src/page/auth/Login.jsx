import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { loginAPI } from "../../service/auth/api";
import { setCredentials } from "../../service/auth/authSlice";
import { setAuthToStorage } from "../../service/auth/storage";

import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { refreshTokenAPI } from "../../service/auth/api";

function UnderlineInput({ placeholder, type = "text", value, onChange }) {
    return (
        <div className="flex flex-col gap-2 w-[370px]">
            <input
                type={type}
                placeholder={placeholder}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border-b border-black border-opacity-50 pb-2 text-base text-black placeholder-black placeholder-opacity-40 outline-none focus:border-opacity-100 focus:border-[#db4444] transition-colors"
            />
        </div>
    );
}

const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

    const handleLogin = async () => {
        if (!form.username || !form.password) {
            message.warning("Vui lòng nhập đầy đủ email và mật khẩu!");
            return;
        }

        try {
            const response = await loginAPI(form);
            
            const access_token = response.data.access_token;
            const user = response.data.user;

            dispatch(setCredentials({ user, access_token }));
            setAuthToStorage({ user, access_token });

            try {
                const refreshRes = await refreshTokenAPI();   
                console.log("Kết quả refresh token:", refreshRes);
            } catch (e) {
                console.log("Gọi refresh token lỗi:", e);
            }
          
            message.success("Đăng nhập thành công!");

            if (user?.role === "ADMIN") navigate("/dashboard");
            else navigate("/");

        } catch (error) {
            console.log("Lỗi đăng nhập:", error);
            
            const errorPayload = error.response?.data || error;

            if (errorPayload && errorPayload.errors === "USER_DISABLED") {
                message.error(errorPayload.message || "Tài khoản của bạn đã bị khóa!");
            } else {
                message.error(errorPayload?.message || "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
            }
        }
    }

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Header />
            <div className="w-full border-b border-black border-opacity-30" />
            <div className="flex flex-1">
                <div className="flex-1 flex items-center justify-center px-16 py-20">
                    <div className="flex flex-col gap-12 w-[370px]">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-4xl font-semibold text-black tracking-wide">Log in to Exclusive</h1>
                            <p className="text-base text-black">Enter your details below</p>
                        </div>

                        <div className="flex flex-col gap-6">
                            <UnderlineInput
                                placeholder="Email"
                                type="text"
                                value={form.username}
                                onChange={set("username")}
                            />
                            <UnderlineInput
                                placeholder="Password"
                                type="password"
                                value={form.password}
                                onChange={set("password")}
                            />
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <button
                                onClick={handleLogin}
                                className="bg-[#db4444] text-white text-base px-12 py-4 rounded hover:bg-[#c03c3c] transition-colors"
                            >
                                Log in
                            </button>
                            <Link to="/register" className="text-[#db4444] text-base hover:opacity-80 transition-opacity">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;