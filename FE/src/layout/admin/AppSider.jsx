import React from 'react';
// MỚI: Thêm message từ antd
import { Layout, Menu, Typography, Avatar, Button, Tooltip, message } from 'antd';
import {
  OrderedListOutlined,
  ProductOutlined,
  UserOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  ShopOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
// MỚI: Thêm useNavigate để chuyển trang
import { Link, useLocation, useNavigate } from 'react-router-dom';

// MỚI: Import các hàm xử lý Auth và Redux (giống hệt bên Header)
import { useDispatch } from 'react-redux';
import { logoutAPI } from '../../service/auth/api';
import { getAuthFromStorage, clearAuthStorage } from '../../service/auth/storage';
import { logout } from '../../service/auth/authSlice';

const { Sider } = Layout;
const { Text } = Typography;

const items = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Thống kê</Link> },
  { key: "/dashboard/users", icon: <UserOutlined />, label: <Link to="/dashboard/users">Người dùng</Link> },
  { key: "/dashboard/categories", icon: <OrderedListOutlined />, label: <Link to="/dashboard/categories">Danh mục</Link> },
  { key: "/dashboard/products", icon: <ProductOutlined />, label: <Link to="/dashboard/products">Sản phẩm</Link> },
  { key: "/dashboard/orders", icon: <ShoppingOutlined />, label: <Link to="/dashboard/orders">Hóa đơn</Link> },
  { key: "/", icon: <ShopOutlined />, label: <Link to="/">My store</Link> },
];

const AppSider = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  
  // MỚI: Khởi tạo các hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // MỚI: Lấy thông tin user từ LocalStorage
  const { user } = getAuthFromStorage();

  // MỚI: Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      // Bỏ qua lỗi BE nếu token đã hết hạn, vẫn tiến hành xóa phía FE
    } finally {
      clearAuthStorage();
      dispatch(logout()); // Cập nhật lại state của Redux
      message.success('Đã đăng xuất');
      navigate('/login');
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#001529',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* --- Khối phía trên: Logo và Menu --- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          height: 64,
          margin: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <div style={{
            width: 40, height: 40, background: '#1890ff', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', fontSize: 20, flexShrink: 0
          }}>
            Q
          </div>
          {!collapsed && (
            <Text style={{ color: 'white', marginLeft: 12, fontWeight: 'bold', fontSize: 18, whiteSpace: 'nowrap' }}>
              Quản lý
            </Text>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={items}
            style={{ borderRight: 0 }}
            />
        </div>
      </div>

      {/* --- Khối Đáy: Avatar, Email và Nút Đăng xuất --- */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        transition: 'all 0.2s',
        marginBottom: '48px' 
      }}>
        {collapsed ? (
            <Tooltip title="Đăng xuất" placement="right">
                <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    style={{ color: '#ff4d4f' }}
                    onClick={handleLogout} // MỚI: Gắn sự kiện click
                />
            </Tooltip>
        ) : (
            <>
                <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', flexShrink: 0 }} />
                    <div style={{ marginLeft: 12, display: 'flex', flexDirection: 'column' }}>
                       <Text 
                          style={{ 
                              color: 'rgba(255, 255, 255, 0.85)', 
                              fontSize: 14,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '120px' 
                          }}
                      >
                          {/* MỚI: Hiển thị email thật từ storage, nếu không có thì fallback 'N/A' */}
                          {user?.email || 'N/A'}
                      </Text>
                    </div>
                </div>
                <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    style={{ color: '#ff4d4f', flexShrink: 0 }}
                    title="Đăng xuất"
                    onClick={handleLogout} // MỚI: Gắn sự kiện click
                />
            </>
        )}
      </div>
    </Sider>
  );
};

export default AppSider;