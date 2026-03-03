import React, { useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { Link } from "react-router-dom";

const imgSideImage = "https://placehold.co/805x700/cbe4e8/333333/png?text=Shopping";

/* ─── Input Field with underline style ─── */
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

const Login = () => {
    // Trang Login chỉ cần email/phone và password
    const [form, setForm] = useState({ email: "", password: "" });
    const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Header />

            {/* Minimal header separator */}
            <div className="w-full border-b border-black border-opacity-30" />

            {/* Main content */}
            <div className="flex flex-1">

                {/* ── Right: Form ── */}
                <div className="flex-1 flex items-center justify-center px-16 py-20">
                    <div className="flex flex-col gap-12 w-[370px]">
                        {/* Title */}
                        <div className="flex flex-col gap-4">
                            <h1 className="text-4xl font-semibold text-black tracking-wide">Log in to Exclusive</h1>
                            <p className="text-base text-black">Enter your details below</p>
                        </div>

                        {/* Fields */}
                        <div className="flex flex-col gap-10">
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

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-4">
                            <button className="bg-[#db4444] text-white text-base px-12 py-4 rounded hover:bg-[#c03c3c] transition-colors">
                                Log in
                            </button>
                            <Link to = "/register" className="text-[#db4444] text-base hover:opacity-80 transition-opacity">
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