import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Spin, message } from 'antd';
import { UserOutlined, CodeSandboxOutlined, ShoppingCartOutlined, ProductOutlined, OrderedListOutlined, ShoppingOutlined } from '@ant-design/icons';
import { getSummaryAPI } from '../../service/dashboard/api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell
} from 'recharts';

const { Text, Title } = Typography;

// Component thẻ thống kê (StatCard)
const StatCard = ({ title, value, icon, iconBg, iconColor }) => {
    return (
        <Card
            bordered={false}
            style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                height: '100%',
            }}
            bodyStyle={{ padding: '24px' }}
        >
            <Text strong style={{ fontSize: '16px', color: '#374151', display: 'block', marginBottom: '16px' }}>
                {title}
            </Text>
            <div style={{
                backgroundColor: iconBg,
                color: iconColor,
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '16px'
            }}>
                {icon}
            </div>
            <Title level={2} style={{ margin: 0, color: '#111827', fontWeight: 600 }}>
                {value}
            </Title>
        </Card>
    );
};

// --- MOCK DATA CHO ĐỒ THỊ ---
// Đồ thị doanh thu 12 tháng
const monthlyRevenueData = [
    { month: 'T1', actual: 48000, projected: 60000 },
    { month: 'T2', actual: 59000, projected: 75000 },
    { month: 'T3', actual: 53000, projected: 61000 },
    { month: 'T4', actual: 68000, projected: 76000 },
    { month: 'T5', actual: 34000, projected: 55000 },
    { month: 'T6', actual: 45000, projected: 55000 },
    { month: 'T7', actual: 30000, projected: 41000 },
    { month: 'T8', actual: 33000, projected: 70000 },
    { month: 'T9', actual: 58000, projected: 29000 },
    { month: 'T10', actual: 46000, projected: 42000 },
    { month: 'T11', actual: 40000, projected: 30000 },
    { month: 'T12', actual: 55000, projected: 63000 },
];

// Đồ thị danh mục sản phẩm
const categoryData = [
    { name: 'Điện thoại', value: 35 },
    { name: 'Máy tính', value: 25 },
    { name: 'Chuột', value: 10 },
    { name: 'Bàn phím', value: 10 },
    { name: 'Phụ kiện', value: 20 },
];

const CATEGORY_COLORS = ['#5b8ff9', '#5ad8a6', '#f6bd16', '#945fb9', '#e8684a'];

const Dashboard = () => {
    const [summaryStats, setSummaryStats] = useState({
        userCount: 0,
        productCount: 0,
        orderCount: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSummaryData();
    }, []);

    const fetchSummaryData = async () => {
        try {
            setIsLoading(true);
            const response = await getSummaryAPI();

            if (response && response.status === 200) {
                const apiData = response.data;
                // Chỉ lấy 3 thông số như yêu cầu
                setSummaryStats({
                    userCount: apiData.userCount || 0,
                    productCount: apiData.productCount || 0,
                    orderCount: apiData.orderSuccessCount || 0
                });
            } else {
                console.warn("API trả về nhưng không có status 200:", response);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API Dashboard: ", error);
            message.error("Không thể tải dữ liệu thống kê!");
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm format số lượng hiển thị (ví dụ: 10500 -> 10.5K)
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    return (
        <div style={{ padding: '24px', background: '#f3f4f6', minHeight: '100vh' }}>
            <Spin spinning={isLoading} tip="Đang tải dữ liệu...">

                {/* HÀNG 1: THỐNG KÊ NGƯỜI DÙNG, SẢN PHẨM, ĐƠN HÀNG */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                        <StatCard
                            title="User"
                            value={formatNumber(summaryStats.userCount)}
                            icon={<UserOutlined />}
                            iconBg="#e0f2fe"
                            iconColor="#0284c7"
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <StatCard
                            title="Product"
                            value={formatNumber(summaryStats.productCount)}
                            icon={<ProductOutlined />}
                            iconBg="#dcfce7"
                            iconColor="#16a34a"
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <StatCard
                            title="Order"
                            value={formatNumber(summaryStats.orderCount)}
                            icon={<ShoppingOutlined/>}
                            iconBg="#ffedd5"
                            iconColor="#ea580c"
                        />
                    </Col>
                </Row>

                {/* HÀNG 2: CÁC ĐỒ THỊ */}
                <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>

                    {/* Đồ thị đường: Doanh thu theo tháng */}
                    <Col xs={24} lg={15}>
                        <Card
                            title={<Text strong style={{ fontSize: '18px' }}>Doanh thu theo tháng (2024)</Text>}
                            bordered={false}
                            style={{ borderRadius: '12px', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        >
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <LineChart
                                        data={monthlyRevenueData}
                                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6b7280' }}
                                            tickFormatter={(value) => `${value / 1000}K`}
                                        />
                                        <RechartsTooltip
                                            formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend verticalAlign="top" align="right" iconType="plainline" wrapperStyle={{ paddingBottom: '20px' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="actual"
                                            name="Doanh thu Thực tế"
                                            stroke="#5b8ff9"
                                            strokeWidth={3}
                                            dot={{ r: 4, strokeWidth: 2 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    {/* Đồ thị vòng: Tỷ lệ danh mục sản phẩm */}
                    <Col xs={24} lg={9}>
                        <Card
                            title={<Text strong style={{ fontSize: '18px' }}>Tỷ lệ danh mục sản phẩm được mua</Text>}
                            bordered={false}
                            style={{ borderRadius: '12px', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        >
                            {/* Container cha: xếp ngang (row) và căn giữa theo trục dọc */}
                            <div style={{ width: '100%', height: 350, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                                {/* 1. Phần Chú giải (Legend) nằm BÊN TRÁI */}
                                <div style={{
                                    width: '40%',
                                    display: 'flex',
                                    flexDirection: 'column', // Xếp dọc
                                    gap: '20px',             // Khoảng cách giữa các dòng
                                    paddingRight: '10px'
                                }}>
                                    {categoryData.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    borderRadius: '3px',
                                                    backgroundColor: CATEGORY_COLORS[index]
                                                }}></div>
                                                <Text style={{ fontSize: '14px', color: '#4b5563' }}>{item.name}</Text>
                                            </div>
                                            <Text strong style={{ fontSize: '14px' }}>{item.value}%</Text>
                                        </div>
                                    ))}
                                </div>

                                {/* 2. Phần Biểu đồ tròn nằm BÊN PHẢI */}
                                <div style={{ width: '60%', height: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value) => `${value}%`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default Dashboard;