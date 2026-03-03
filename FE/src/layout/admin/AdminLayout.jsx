import React, { useState } from "react";
import { Layout, theme } from "antd";
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

      <Layout style={{ background: "#f5f5f5" }}>
        <div style={{ marginTop: "24px" }}>
          <AppContent
            colorBgContainer={colorBgContainer}
            borderRadiusLG={borderRadiusLG}
            collapsed={collapsed}
          />
        </div>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;