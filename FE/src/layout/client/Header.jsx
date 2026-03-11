import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ĐÃ SỬA: Gộp import Dropdown chung với message cho gọn
import { Dropdown, message } from 'antd'; 
import { useDispatch, useSelector } from 'react-redux';
import { logoutAPI } from '../../service/auth/api';
import { clearAuthStorage } from '../../service/auth/storage';
import { logout } from '../../service/auth/authSlice';

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // MỚI: Lấy thêm thông tin user từ Redux state để kiểm tra role
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await logoutAPI();
        } catch (error) {
            // Bỏ qua lỗi BE, vẫn xóa token phía FE
        } finally {
            clearAuthStorage();
            dispatch(logout());
            message.success('Đã đăng xuất');
            navigate('/login');
        }
    };

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            handleLogout();
        }
    };

    // MỚI: Khởi tạo danh sách menu động dựa trên quyền (Role)
    const getMenuItems = () => {
        const items = [
            {
                key: 'profile',
                label: <Link to="/profile">Trang cá nhân</Link>,
            },
            {
                key: 'orders',
                label: <Link to="/orders">Lịch sử mua hàng</Link>,
            },
        ];

        // Nếu user có role là ADMIN thì thêm mục Dashboard vào mảng
        if (user?.role === 'ADMIN') {
            items.push({
                key: 'dashboard',
                label: <Link to="/dashboard">Dashboard</Link>,
            });
        }

        // Đẩy Log out xuống dưới cùng
        items.push({
            key: 'logout',
            label: <span>Đăng xuất</span>,
        });

        return items;
    };

    return (
        <header className="w-full border-b border-gray-200 bg-white relative">
            <div className="max-w-[1170px] mx-auto px-4 py-5 flex items-center justify-between">
                {/* Logo + Nav */}
                <div className="flex items-center gap-40">
                    <span className="text-2xl font-bold text-black tracking-wider">Exclusive</span>
                    <nav className="flex items-center gap-12">
                        <Link to="/" className="text-black text-base hover:text-[#db4444] transition-colors">Trang chủ</Link>
                        <Link to="/products" className="text-black text-base hover:text-[#db4444] transition-colors">Sản phẩm</Link>
                    </nav>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    {/* Cart Icon */}
                    <Link to="/cart" className="relative p-1 hover:opacity-70 transition-opacity">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </Link>
                    
                    {/* User / Login Icon */}
                    {isAuthenticated ? (
                        <Dropdown
                            // MỚI: Gọi hàm getMenuItems() để lấy danh sách items
                            menu={{ items: getMenuItems(), onClick: handleMenuClick }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <button className="p-1 hover:opacity-70 transition-opacity cursor-pointer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </button>
                        </Dropdown>
                    ) : (
                        <Link
                            to="/login"
                            className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}