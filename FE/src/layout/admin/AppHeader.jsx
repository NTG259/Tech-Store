import React from "react";
import { Layout, Space, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({ colorBgContainer }) => {
  const userEmail = "admin@gmail.com";

  return (
    <Header
      style={{
        background: colorBgContainer,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 24px",
        boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
        zIndex: 1,
      }}
    >
      <Space size="middle" style={{ cursor: "pointer" }}>
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
        <Text style={{ fontWeight: 500 }}>{userEmail}</Text>
      </Space>
    </Header>
  );
};

export default AppHeader;