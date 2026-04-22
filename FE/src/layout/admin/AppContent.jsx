import { Layout, Breadcrumb } from "antd";
import { Outlet } from "react-router-dom";
import React from "react";
const { Content } = Layout;

const AppContent = ({ colorBgContainer, borderRadiusLG, collapsed }) => {
  return (
    <Content
      style={{
        marginLeft: collapsed ? 80 : 250,
        transition: 'all 0.2s',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ padding: '0 24px' }}>
        <div
          style={{
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 'calc(100vh - 120px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <Outlet />
        </div>
      </div>
    </Content>
  );
};

export default AppContent;