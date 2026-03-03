import React from 'react';
import { Layout, Menu, Typography, Avatar, Button, Tooltip } from 'antd';
import {
  OrderedListOutlined,
  ProductOutlined,
  UserOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  ShopOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

const items = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Thống kê</Link> },
  { key: "/dashboard/users", icon: <UserOutlined />, label: <Link to="/dashboard/users">Người dùng</Link> },
  { key: "/dashboard/products", icon: <ProductOutlined />, label: <Link to="/dashboard/products">Sản phẩm</Link> },
  { key: "/dashboard/orders", icon: <ShoppingOutlined />, label: <Link to="/dashboard/orders">Hóa đơn</Link> },
  { key: "/", icon: <ShopOutlined />, label: <Link to="/">My store</Link> },
];

const AppSider = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

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
        {/* Logo */}
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

        {/* Menu (có thể scroll nếu danh sách dài) */}
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
        marginBottom: '48px' // Đẩy lên một chút để tránh dính với nút thu gọn (trigger) của Sider
      }}>
        {collapsed ? (
            <Tooltip title="Đăng xuất" placement="right">
                <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    style={{ color: '#ff4d4f' }}
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
                              maxWidth: '120px' // Đặt giới hạn độ dài để không đè lên nút đăng xuất
                          }}
                      >
                          admin@gmail.com
                      </Text>
                    </div>
                </div>
                <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    style={{ color: '#ff4d4f', flexShrink: 0 }}
                    title="Đăng xuất"
                />
            </>
        )}
      </div>
    </Sider>
  );
};

export default AppSider;