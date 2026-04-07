import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Spin, message, DatePicker, Button, Space, Table, Tag, Avatar } from 'antd';
import { 
    UserOutlined, ProductOutlined, ShoppingOutlined, FilterOutlined, 
    TrophyOutlined, CrownOutlined 
} from '@ant-design/icons';
// Đảm bảo bạn đã export các hàm API này đúng đường dẫn nhé
import { getSummaryAPI, getTop10Products } from '../../service/dashboard/api';
// import { getTopUsersAPI } from '../../service/dashboard/api'; // Thêm API lấy top user tại đây
import dayjs from 'dayjs';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

const { Text, Title } = Typography;

// Component thẻ thống kê (StatCard)
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

const Dashboard = () => {
    const [summaryStats, setSummaryStats] = useState({ userCount: 0, productCount: 0, orderCount: 0 });
    const [revenueData, setRevenueData] = useState([]); 
    const [topProducts, setTopProducts] = useState([]); 
    const [topUsers, setTopUsers] = useState([]); // State mới cho Top Người dùng
    const [isLoading, setIsLoading] = useState(true);
    
    const [selectedYear, setSelectedYear] = useState(dayjs().year());

    useEffect(() => {
        fetchSummaryData(selectedYear);
    }, [selectedYear]);

    const fetchSummaryData = async (year) => {
        setIsLoading(true);

        // --- 1. Gọi API Thống kê tổng quan ---
        try {
            const summaryResponse = await getSummaryAPI(year);
            if (summaryResponse && summaryResponse.status === 200) {
                const apiData = summaryResponse.data;

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
                    setRevenueData([]);
                }
            }
        } catch (error) {
            console.error("Lỗi khi gọi API Dashboard (Summary): ", error);
        }

        // --- 2. Gọi API Top 10 sản phẩm ---
        try {
            const topProductsResponse = await getTop10Products(year);
            
            let rawData = [];
            if (topProductsResponse?.data?.data && Array.isArray(topProductsResponse.data.data)) {
                rawData = topProductsResponse.data.data;
            } else if (topProductsResponse?.data && Array.isArray(topProductsResponse.data)) {
                rawData = topProductsResponse.data;
            }

            const aggregatedMap = {};
            
            rawData.forEach(item => {
                const productId = item.product?.id || item.id; 
                
                if (!aggregatedMap[productId]) {
                    aggregatedMap[productId] = {
                        id: productId,
                        name: item.name,
                        productImg: item.productImg,
                        brand: item.product?.brand || 'N/A',
                        stockQuantity: item.product?.stockQuantity || 0,
                        quantity: 0, 
                        revenue: 0   
                    };
                }
                
                const qty = item.quantity || 0;
                const price = item.price || 0;
                
                aggregatedMap[productId].quantity += qty;
                aggregatedMap[productId].revenue += (qty * price);
            });

            const finalTopProducts = Object.values(aggregatedMap)
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 10);

            setTopProducts(finalTopProducts);

        } catch (error) {
            console.error("Lỗi khi gọi API Top 10 sản phẩm: ", error);
        }

        // --- 3. Gọi API Top Người dùng mua nhiều ---
        try {
            // TẠM THỜI COMMENT GỌI API THỰC TẾ
            // const topUsersResponse = await getTopUsersAPI(year);
            // let rawUsersData = topUsersResponse?.data?.data || topUsersResponse?.data || [];
            
            // SỬ DỤNG MOCK DATA ĐỂ HIỂN THỊ TRƯỚC
            const mockTopUsers = [
                { id: 1, name: 'Nguyễn Văn Anh', email: 'nva@gmail.com', totalOrders: 25, totalSpent: 156000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
                { id: 2, name: 'Trần Thị Bé', email: 'ttb@gmail.com', totalOrders: 18, totalSpent: 98000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
                { id: 3, name: 'Lê Hữu Cường', email: 'lhc@gmail.com', totalOrders: 14, totalSpent: 75500000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jude' },
                { id: 4, name: 'Phạm Minh Đức', email: 'pmd@gmail.com', totalOrders: 10, totalSpent: 54000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max' },
                { id: 5, name: 'Hoàng Kim Én', email: 'hke@gmail.com', totalOrders: 8, totalSpent: 32000000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lola' },
            ];

            // Nếu có API thật thì thay mockTopUsers bằng rawUsersData
            setTopUsers(mockTopUsers);

        } catch (error) {
            console.error("Lỗi khi gọi API Top người dùng: ", error);
        }

        setIsLoading(false);
    };

    const handleFilter = () => {
        fetchSummaryData(selectedYear);
    };

    const formatNumber = (num) => {
        if (!num) return 0;
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const formatCurrency = (value) => {
        if (!value) return "0 đ";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // --- CẤU HÌNH CỘT BẢNG SẢN PHẨM ---
    const productColumns = [
        {
            title: 'Top',
            key: 'rank',
            width: 60,
            align: 'center',
            render: (text, record, index) => {
                let color = index === 0 ? '#f59e0b' : index === 1 ? '#9ca3af' : index === 2 ? '#d97706' : '#f3f4f6';
                let textColor = index < 3 ? '#fff' : '#374151';
                return (
                    <div style={{ backgroundColor: color, color: textColor, width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold' }}>
                        {index + 1}
                    </div>
                );
            }
        },
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                        src={record.productImg || 'https://via.placeholder.com/50'} 
                        alt="product" 
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} 
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ color: '#111827', fontSize: '14px', lineHeight: '1.2' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.brand}</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Đã bán',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (val) => <Tag color="blue" style={{ fontWeight: 600 }}>{formatNumber(val)}</Tag>
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            key: 'revenue',
            align: 'right',
            render: (val) => <Text type="success" strong>{formatCurrency(val)}</Text>
        }
    ];

    // --- CẤU HÌNH CỘT BẢNG NGƯỜI DÙNG ---
    const userColumns = [
        {
            title: 'Top',
            key: 'rank',
            width: 60,
            align: 'center',
            render: (text, record, index) => {
                let color = index === 0 ? '#10b981' : index === 1 ? '#9ca3af' : index === 2 ? '#d97706' : '#f3f4f6';
                let textColor = index < 3 ? '#fff' : '#374151';
                return (
                    <div style={{ backgroundColor: color, color: textColor, width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold' }}>
                        {index + 1}
                    </div>
                );
            }
        },
        {
            title: 'Khách hàng',
            key: 'user',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar src={record.avatar} size="large" icon={<UserOutlined />} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ color: '#111827', fontSize: '14px', lineHeight: '1.2' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Số đơn',
            dataIndex: 'totalOrders',
            key: 'totalOrders',
            align: 'center',
            render: (val) => <Tag color="purple" style={{ fontWeight: 600 }}>{val} đơn</Tag>
        },
        {
            title: 'Đã chi tiêu',
            dataIndex: 'totalSpent',
            key: 'totalSpent',
            align: 'right',
            render: (val) => <Text type="danger" strong>{formatCurrency(val)}</Text>
        }
    ];

    return (
        <div style={{ padding: '24px', background: '#f3f4f6', minHeight: '100vh' }}>
            <Spin spinning={isLoading} tip="Đang tải dữ liệu...">
                
                {/* HÀNG 1: THỐNG KÊ TỔNG QUAN */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}><StatCard title="Người dùng" value={formatNumber(summaryStats.userCount)} icon={<UserOutlined />} iconBg="#e0f2fe" iconColor="#0284c7" /></Col>
                    <Col xs={24} sm={8}><StatCard title="Sản phẩm" value={formatNumber(summaryStats.productCount)} icon={<ProductOutlined />} iconBg="#dcfce7" iconColor="#16a34a" /></Col>
                    <Col xs={24} sm={8}><StatCard title="Đơn hàng" value={formatNumber(summaryStats.orderCount)} icon={<ShoppingOutlined/>} iconBg="#ffedd5" iconColor="#ea580c" /></Col>
                </Row>

                {/* HÀNG 2: BIỂU ĐỒ DOANH THU */}
                <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                    <Col xs={24} lg={24}>
                        <Card
                            title={<Text strong style={{ fontSize: '18px' }}>Doanh thu theo tháng</Text>}
                            bordered={false}
                            style={{ borderRadius: '12px', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                            extra={
                                <Space>
                                    <DatePicker 
                                        picker="year" 
                                        value={dayjs().year(selectedYear)}
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
                </Row>

                {/* HÀNG 3: TOP SẢN PHẨM & TOP NGƯỜI DÙNG */}
                <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                    
                    {/* Cột 1: Top 10 Sản phẩm */}
                    <Col xs={24} xl={12}>
                        <Card 
                            title={
                                <Space>
                                    <TrophyOutlined style={{ color: '#f59e0b', fontSize: '20px' }} />
                                    <Text strong style={{ fontSize: '18px' }}>Top Sản phẩm bán chạy</Text>
                                </Space>
                            } 
                            bordered={false} 
                            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }}
                        >
                            <Table 
                                columns={productColumns} 
                                dataSource={topProducts} 
                                pagination={false}
                                rowKey={(record) => record.id}
                                bordered={false}
                                size="middle"
                            />
                        </Card>
                    </Col>

                    {/* Cột 2: Top Người dùng */}
                    <Col xs={24} xl={12}>
                        <Card 
                            title={
                                <Space>
                                    <CrownOutlined style={{ color: '#10b981', fontSize: '22px' }} />
                                    <Text strong style={{ fontSize: '18px' }}>Top Khách hàng thân thiết</Text>
                                </Space>
                            } 
                            bordered={false} 
                            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }}
                        >
                            <Table 
                                columns={userColumns} 
                                dataSource={topUsers} 
                                pagination={false}
                                rowKey={(record) => record.id}
                                bordered={false}
                                size="middle"
                            />
                        </Card>
                    </Col>

                </Row>

            </Spin>
        </div>
    );
};

export default Dashboard;