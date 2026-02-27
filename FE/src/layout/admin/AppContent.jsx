import { Layout, Breadcrumb } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AppContent = ({ colorBgContainer, borderRadiusLG, collapsed }) => {
  return (
    <Content 
      style={{ 
        // Đẩy lề trái để nhường chỗ cho Sider đang Fixed
        marginLeft: collapsed ? 80 : 250, 
        transition: 'all 0.2s', // Hiệu ứng co giãn mượt mà
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ padding: '0 24px' }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[{ title: "Hệ thống" }, { title: "Danh sách" }]}
        />
        
        <div
          style={{
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 'calc(100vh - 120px)', // Tự động khớp màn hình
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <Outlet />
        </div>
      </div>
      
      {/* Footer tùy chọn */}
      <footer style={{ textAlign: 'center', padding: '20px 0', color: '#8c8c8c' }}>
        Tachi Design ©2026 Created by Gemini
      </footer>
    </Content>
  );
};

export default AppContent;