import { Layout, theme } from "antd";
import { useState } from "react";
import AppSider from "./AppSider";
import AppHeader from "./AppHeader";
import AppContent from "./AppContent";
import AppFooter from "./AppFooter";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSider collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <AppHeader colorBgContainer={colorBgContainer} />
        <AppContent
          colorBgContainer={colorBgContainer}
          borderRadiusLG={borderRadiusLG}
        />
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;