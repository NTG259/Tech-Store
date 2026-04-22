import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#111827] text-white pt-16 pb-8 mt-20">
            <div className="max-w-[1170px] mx-auto px-4">


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">


                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold tracking-wider mb-2">Exclusive</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Đăng ký nhận bản tin để cập nhật những sản phẩm mới nhất và nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên.
                        </p>
                        <div className="text-gray-400 text-sm mt-2 flex flex-col gap-2">
                            <p><strong className="text-gray-300">Email:</strong> exclusive@gmail.com</p>
                            <p><strong className="text-gray-300">Hotline:</strong> +88015-88888-9999</p>
                        </div>
                    </div>


                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold tracking-wide mb-2 text-gray-100">Tài khoản</h3>
                        <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                            <li><Link to="/profile" className="hover:text-white hover:underline underline-offset-4 transition-all">Tài khoản của tôi</Link></li>
                            <li><Link to="/login" className="hover:text-white hover:underline underline-offset-4 transition-all">Đăng nhập / Đăng ký</Link></li>
                            <li><Link to="/cart" className="hover:text-white hover:underline underline-offset-4 transition-all">Giỏ hàng</Link></li>
                            <li><Link to="/wishlist" className="hover:text-white hover:underline underline-offset-4 transition-all">Danh sách yêu thích</Link></li>
                        </ul>
                    </div>


                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold tracking-wide mb-2 text-gray-100">Hỗ trợ khách hàng</h3>
                        <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                            <li><Link to="/privacy" className="hover:text-white hover:underline underline-offset-4 transition-all">Chính sách bảo mật</Link></li>
                            <li><Link to="/terms" className="hover:text-white hover:underline underline-offset-4 transition-all">Điều khoản sử dụng</Link></li>
                            <li><Link to="/faq" className="hover:text-white hover:underline underline-offset-4 transition-all">Câu hỏi thường gặp</Link></li>
                            <li><Link to="/contact" className="hover:text-white hover:underline underline-offset-4 transition-all">Liên hệ với chúng tôi</Link></li>
                        </ul>
                    </div>


                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold tracking-wide mb-2 text-gray-100">Văn phòng</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            111 Bijoy Sarani, <br />
                            Dhaka, DH 1515, <br />
                            Bangladesh.
                        </p>
                    </div>

                </div>


                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-center text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Exclusive. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}