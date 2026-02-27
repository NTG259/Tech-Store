import { Layout, Menu, Typography } from 'antd';
import {
  MenuOutlined,
  OrderedListOutlined,
  ProductOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

const items = [
  { key: "/", icon: <MenuOutlined />, label: <Link to="/">Trang chủ</Link> },
  { key: "/users", icon: <UserOutlined />, label: <Link to="/users">Người dùng</Link> },
  { key: "/products", icon: <ProductOutlined />, label: <Link to="/products">Sản phẩm</Link> },
  { key: "/orders", icon: <OrderedListOutlined />, label: <Link to="/orders">Hóa đơn</Link> },
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
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#001529', // Bạn có thể đổi thành #1890ff nếu muốn xanh rực rỡ
        zIndex: 1000,
      }}
    >
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
          color: 'white', fontWeight: 'bold', fontSize: 20
        }}>T</div>
        {!collapsed && (
          <Text style={{ color: 'white', marginLeft: 12, fontWeight: 'bold', fontSize: 18 }}>
            TACHI ADMIN
          </Text>
        )}
      </div>

      <Menu
        theme="dark" // Hoặc bỏ theme để tự custom màu xanh
        mode="inline"
        selectedKeys={location.pathname}
        items={items}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default AppSider;