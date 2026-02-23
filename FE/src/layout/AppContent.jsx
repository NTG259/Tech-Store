import { Layout, Breadcrumb } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AppContent = ({ colorBgContainer, borderRadiusLG }) => {
  return (
    <Content style={{ margin: "0 16px" }}>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[{ title: "User" }, { title: "Bill" }]}
      />
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Outlet />
      </div>
    </Content>
  );
};

export default AppContent;