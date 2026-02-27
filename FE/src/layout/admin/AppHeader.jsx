import { Layout } from "antd";

const { Header } = Layout;

const AppHeader = ({ colorBgContainer }) => {
  return (
    <Header
      style={{
        background: colorBgContainer,
        padding: "0 24px",
      }}
    >
        Header Area
    </Header>
  );
};

export default AppHeader;