import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Spin, message, DatePicker, Button, Space } from 'antd';
import { UserOutlined, ProductOutlined, ShoppingOutlined, FilterOutlined } from '@ant-design/icons';
import { getSummaryAPI } from '../../service/dashboard/api';
import dayjs from 'dayjs';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell
} from 'recharts';

const { Text, Title } = Typography;

// Component thẻ thống kê (StatCard) giữ nguyên
const StatCard = ({ title, value, icon, iconBg, iconColor }) => {
    return (
        <Card
            bordered={false}
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }}
            bodyStyle={{ padding: '24px' }}
        >
            <Text strong style={{ fontSize: '16px', color: '#374151', display: 'block', marginBottom: '16px' }}>{title}</Text>
            <div style={{ backgroundColor: iconBg, color: iconColor, width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                {icon}
            </div>
            <Title level={2} style={{ margin: 0, color: '#111827', fontWeight: 600 }}>{value}</Title>
        </Card>
    );
};

// Mock data cho biểu đồ vòng giữ nguyên
const categoryData = [
    { name: 'Điện thoại', value: 35 }, { name: 'Máy tính', value: 25 }, { name: 'Chuột', value: 10 }, { name: 'Bàn phím', value: 10 }, { name: 'Phụ kiện', value: 20 },
];
const CATEGORY_COLORS = ['#5b8ff9', '#5ad8a6', '#f6bd16', '#945fb9', '#e8684a'];

const Dashboard = () => {
    const [summaryStats, setSummaryStats] = useState({ userCount: 0, productCount: 0, orderCount: 0 });
    const [revenueData, setRevenueData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    
    // --- THÊM STATE LƯU NĂM ĐƯỢC CHỌN (Mặc định là năm hiện tại) ---
    const [selectedYear, setSelectedYear] = useState(dayjs().year());

    useEffect(() => {
        // Lần đầu render sẽ gọi API với năm mặc định
        fetchSummaryData(selectedYear);
    }, []);

    // --- CẬP NHẬT HÀM NHẬN THÊM PARAM year ---
    const fetchSummaryData = async (year) => {
        try {
            setIsLoading(true);
            // GỌI API VÀ TRUYỀN YEAR VÀO
            const response = await getSummaryAPI(year);

            if (response && response.status === 200) {
                const apiData = response.data;
                
                setSummaryStats({
                    userCount: apiData.userCount || 0,
                    productCount: apiData.productCount || 0,
                    orderCount: apiData.orderSuccessCount || 0
                });

                if (apiData.totalRevenueMonthly) {
                    const formattedChartData = [...apiData.totalRevenueMonthly]
                        .sort((a, b) => a.month - b.month)
                        .map(item => ({
                            month: `T${item.month}`,
                            revenue: item.totalRevenue
                        }));
                    setRevenueData(formattedChartData);
                } else {
                    // Xóa data cũ nếu API trả về rỗng cho năm đó
                    setRevenueData([]);
                }
            }
        } catch (error) {
            console.error("Lỗi khi gọi API Dashboard: ", error);
            message.error("Không thể tải dữ liệu thống kê!");
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý khi bấm nút "Lọc"
    const handleFilter = () => {
        fetchSummaryData(selectedYear);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div style={{ padding: '24px', background: '#f3f4f6', minHeight: '100vh' }}>
            <Spin spinning={isLoading} tip="Đang tải dữ liệu...">
                {/* HÀNG 1 */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}><StatCard title="Người dùng" value={formatNumber(summaryStats.userCount)} icon={<UserOutlined />} iconBg="#e0f2fe" iconColor="#0284c7" /></Col>
                    <Col xs={24} sm={8}><StatCard title="Sản phẩm" value={formatNumber(summaryStats.productCount)} icon={<ProductOutlined />} iconBg="#dcfce7" iconColor="#16a34a" /></Col>
                    <Col xs={24} sm={8}><StatCard title="Đơn hàng" value={formatNumber(summaryStats.orderCount)} icon={<ShoppingOutlined/>} iconBg="#ffedd5" iconColor="#ea580c" /></Col>
                </Row>

                {/* HÀNG 2 */}
                <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                    <Col xs={24} lg={24}>
                        <Card
                            title={<Text strong style={{ fontSize: '18px' }}>Doanh thu theo tháng</Text>}
                            bordered={false}
                            style={{ borderRadius: '12px', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                            // --- THÊM PHẦN TÌM KIẾM VÀO GÓC PHẢI CARD ---
                            extra={
                                <Space>
                                    <DatePicker 
                                        picker="year" 
                                        defaultValue={dayjs()} 
                                        format="YYYY"
                                        allowClear={false}
                                        onChange={(date) => {
                                            if(date) setSelectedYear(date.year());
                                        }} 
                                    />
                                    <Button type="primary" icon={<FilterOutlined />} onClick={handleFilter}>
                                        Lọc
                                    </Button>
                                </Space>
                            }
                        >
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `${value / 1000000}Tr`} />
                                        <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Legend verticalAlign="top" align="right" iconType="plainline" wrapperStyle={{ paddingBottom: '20px' }} />
                                        <Line type="monotone" dataKey="revenue" name={`Doanh thu ${selectedYear}`} stroke="#5b8ff9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    {/* Đồ thị vòng giữ nguyên */}
                    {/* <Col xs={24} lg={9}>
                        <Card title={<Text strong style={{ fontSize: '18px' }}>Tỷ lệ danh mục</Text>} bordered={false} style={{ borderRadius: '12px', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ width: '100%', height: 350, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '10px' }}>
                                    {categoryData.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: CATEGORY_COLORS[index] }}></div>
                                                <Text style={{ fontSize: '14px', color: '#4b5563' }}>{item.name}</Text>
                                            </div>
                                            <Text strong style={{ fontSize: '14px' }}>{item.value}%</Text>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ width: '60%', height: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
                                                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />)}
                                            </Pie>
                                            <RechartsTooltip formatter={(value) => `${value}%`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Card>
                    </Col> */}
                
                </Row>
            </Spin>
        </div>
    );
};

export default Dashboard;