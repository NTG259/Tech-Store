import React, { useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { Link } from "react-router-dom";


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
    const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

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
                                placeholder="Email or Phone Number"
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
                            <button className="w-full bg-[#db4444] text-white text-base py-4 rounded hover:bg-[#c03c3c] transition-colors">
                                Create Account
                            </button>

                            <div className="flex items-center gap-4">
                                <span className="text-base text-black opacity-70">Already have account?</span>
                                <div className="flex flex-col gap-0.5">
                                    <Link to = "/login" className="text-base text-black opacity-70 hover:opacity-100 transition-opacity">
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