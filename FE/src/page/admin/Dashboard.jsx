import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Spin, Space, Table, Tag, Avatar } from 'antd';
import { UserOutlined, ProductOutlined, ShoppingOutlined, TrophyOutlined, CrownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// --- IMPORT CÁC API CỦA BẠN VÀO ĐÂY ---
// Đã thêm getYearRevenueAPI vào danh sách import
import { getSummaryAPI, getYearRevenueAPI, getTop10Products } from '../../service/dashboard/api';
import { fetchTop5UserVip } from '../../service/user/api';

// --- IMPORT COMPONENT CHART VỪA TẠO Ở TRÊN ---
import DashboardCharts from '../../components/chart/dashboard.chart';

const { Text, Title } = Typography;

// Thẻ hiển thị thống kê tổng quan (User, Order, Product...)
const StatCard = ({ title, value, icon, iconBg, iconColor }) => (
    <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }} bodyStyle={{ padding: '24px' }}>
        <Text strong style={{ fontSize: '15px', color: '#64748b', display: 'block', marginBottom: '12px' }}>{title}</Text>
        <div style={{ backgroundColor: iconBg, color: iconColor, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>
            {icon}
        </div>
        <Title level={2} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>{value}</Title>
    </Card>
);

const Dashboard = () => {
    // States quản lý dữ liệu toàn trang
    const [summaryStats, setSummaryStats] = useState({ userCount: 0, productCount: 0, orderCount: 0 });
    const [revenueData, setRevenueData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(dayjs().year());

    useEffect(() => {
        fetchSummaryData(selectedYear);
    }, [selectedYear]);

    const fetchSummaryData = async (year) => {
        setIsLoading(true);
        try {
            // 1. Fetch Tổng quan (Không cần truyền year vì API không nhận params này)
            const resSum = await getSummaryAPI();
            if (resSum?.status === 200 && resSum.data) {
                setSummaryStats({
                    userCount: resSum.data.userCount || 0,
                    productCount: resSum.data.productCount || 0,
                    orderCount: resSum.data.orderSuccessCount || 0
                });
            }

            // 1.5. Fetch Doanh thu theo năm từ API riêng
            const resRev = await getYearRevenueAPI(year);
            if (resRev?.status === 200 && resRev.data?.totalRevenueMonth) {
                const sortedRevenue = [...resRev.data.totalRevenueMonth].sort((a, b) => a.month - b.month);
                setRevenueData(sortedRevenue.map(item => ({
                    month: `T${item.month}`,
                    revenue: item.totalRevenue // Lấy đúng trường totalRevenue từ response
                })));
            }

            // 2. Fetch Top Sản phẩm
            const resProd = await getTop10Products(year);
            const rawProd = resProd?.data || [];
            setTopProducts(rawProd.map(item => ({
                id: item.productId,
                name: item.productName,
                img: item.productImg,
                stock: item.stockQuantity,
                sold: item.totalSold,
                revenue: item.totalRevenue
            })));

            // 3. Fetch Top Khách hàng
            const resUser = await fetchTop5UserVip();
            if (resUser?.status === 200) {
                setTopUsers((resUser.data || []).map((u, i) => ({
                    id: u.id,
                    name: u.fullName,
                    email: u.email,
                    orders: u.totalOrder,
                    spent: u.totalSpend,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id || i}`
                })));
            }
        } catch (e) {
            console.error("Dashboard Error:", e);
        }
        setIsLoading(false);
    };

    const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

    const renderRank = (index) => {
        const colors = ['#f59e0b', '#9ca3af', '#d97706'];
        return (
            <div style={{ backgroundColor: colors[index] || '#f1f5f9', color: index < 3 ? '#fff' : '#64748b', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold', fontSize: '12px' }}>
                {index + 1}
            </div>
        );
    };

    // Cấu hình Cột bảng Ant Design
    const productColumns = [
        { title: 'Top', align: 'center', width: 50, render: (_, __, i) => renderRank(i) },
        {
            title: 'Sản phẩm',
            render: (_, r) => (
                <Space size="middle">
                    <Avatar shape="square" size={42} src={r.img} style={{ border: '1px solid #f1f5f9' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ maxWidth: 160, fontSize: '13px' }} ellipsis>{r.name}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>Tồn kho: {r.stock}</Text>
                    </div>
                </Space>
            )
        },
        { title: 'Đã bán', dataIndex: 'sold', align: 'center', width: 80, render: (v) => <Tag color="blue" style={{ borderRadius: '4px', margin: 0 }}>{v}</Tag> },
        { title: 'Doanh thu', dataIndex: 'revenue', align: 'right', render: (v) => <Text type="success" strong style={{ fontSize: '13px' }}>{formatCurrency(v)}</Text> }
    ];

    const userColumns = [
        { title: 'Top', align: 'center', width: 50, render: (_, __, i) => renderRank(i) },
        {
            title: 'Khách hàng',
            render: (_, r) => (
                <Space size="middle">
                    <Avatar size={42} src={r.avatar} style={{ backgroundColor: '#f8fafc' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ fontSize: '13px' }}>{r.name}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }} ellipsis>{r.email}</Text>
                    </div>
                </Space>
            )
        },
        { title: 'Số đơn', dataIndex: 'orders', align: 'center', width: 80, render: (v) => <Tag color="purple" style={{ borderRadius: '4px', margin: 0 }}>{v}</Tag> },
        { title: 'Chi tiêu', dataIndex: 'spent', align: 'right', render: (v) => <Text type="danger" strong style={{ fontSize: '13px' }}>{formatCurrency(v)}</Text> }
    ];

    return (
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            <Spin spinning={isLoading} tip="Đang cập nhật dữ liệu...">

                {/* KHỐI 1: THỐNG KÊ TỔNG QUAN */}
                <Row gutter={[20, 20]}>
                    <Col xs={24} sm={8}><StatCard title="Tổng Người Dùng" value={summaryStats.userCount} icon={<UserOutlined />} iconBg="#eff6ff" iconColor="#3b82f6" /></Col>
                    <Col xs={24} sm={8}><StatCard title="Tổng Sản Phẩm" value={summaryStats.productCount} icon={<ProductOutlined />} iconBg="#ecfdf5" iconColor="#10b981" /></Col>
                    <Col xs={24} sm={8}><StatCard title="Đơn Hàng Thành Công" value={summaryStats.orderCount} icon={<ShoppingOutlined />} iconBg="#fff7ed" iconColor="#f59e0b" /></Col>
                </Row>

                {/* KHỐI 2: KHU VỰC BIỂU ĐỒ (Render Component con) */}
                <DashboardCharts 
                    revenueData={revenueData}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    onFilterClick={() => fetchSummaryData(selectedYear)}
                    formatCurrency={formatCurrency}
                />

                {/* KHỐI 3: HAI BẢNG DANH SÁCH (SẢN PHẨM & NGƯỜI DÙNG) */}
                <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
                    <Col xs={24} lg={12} style={{ display: 'flex' }}>
                        <Card
                            title={<Space><TrophyOutlined style={{ color: '#f59e0b', fontSize: '18px' }} /><Text strong>Top Sản Phẩm Bán Chạy</Text></Space>}
                            style={{ borderRadius: '16px', width: '100%', border: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                            bodyStyle={{ padding: '0 8px 8px 8px' }}
                        >
                            <Table columns={productColumns} dataSource={topProducts} pagination={false} rowKey="id" size="middle" className="custom-table" />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12} style={{ display: 'flex' }}>
                        <Card
                            title={<Space><CrownOutlined style={{ color: '#f59e0b', fontSize: '20px' }} /><Text strong>Top Khách Hàng Thân Thiết</Text></Space>}
                            style={{ borderRadius: '16px', width: '100%', border: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                            bodyStyle={{ padding: '0 8px 8px 8px' }}
                        >
                            <Table columns={userColumns} dataSource={topUsers} pagination={false} rowKey="id" size="middle" className="custom-table" />
                        </Card>
                    </Col>
                </Row>
            </Spin>

            {/* CSS Tùy chỉnh cho bảng */}
            <style>{`
                .custom-table .ant-table { background: transparent; }
                .custom-table .ant-table-thead > tr > th { background: transparent; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600; }
                .custom-table .ant-table-tbody > tr > td { border-bottom: 1px solid #f1f5f9; padding: 12px 8px !important; }
                .custom-table .ant-table-tbody > tr:hover > td { background: #f8fafc !important; }
            `}</style>
        </div>
    );
};

export default Dashboard;