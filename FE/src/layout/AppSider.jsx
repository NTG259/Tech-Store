import {
  MenuOutlined,
  OrderedListOutlined,
  ProductOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';


const { Sider } = Layout;

const items = [
  { key: "1", icon: <MenuOutlined />, label: <Link to="/">Dashboard</Link> },
  { key: "2", icon: <UserOutlined />, label: <Link to="/users">Users</Link> },
  { key: "3", icon: <ProductOutlined />, label: <Link to="/products">Products</Link> },
  { key: "4", icon: <OrderedListOutlined />, label: <Link to="/orders">Orders</Link> },
];


const AppSider = (props) => {
  const { collapsed, setCollapsed } = props;

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <Menu theme="dark" mode="inline" items={items} />
    </Sider>
  );
};
export default AppSider;