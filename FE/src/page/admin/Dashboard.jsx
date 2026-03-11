import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Spin, message } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { getSummaryAPI } from '../../service/dashboard/api';

const { Text, Title } = Typography;

const StatCard = ({ title, value, isActive }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            bordered={true}
            style={{
                borderRadius: '12px',
                backgroundColor: isActive || isHovered ? '#1890ff' : '#ffffff',
                borderColor: isActive || isHovered ? '#1890ff' : '#e5e7eb',
                height: '100%',
                boxShadow: isActive || isHovered ? '0 4px 12px rgba(24, 144, 255, 0.3)' : '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: '24px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <Text style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: isActive || isHovered ? '#ffffff' : '#374151'
                }}>
                    {title}
                </Text>
                <ArrowUpOutlined style={{
                    fontSize: '16px',
                    color: isActive || isHovered ? '#ffffff' : '#9ca3af',
                    transform: 'rotate(45deg)'
                }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Title level={2} style={{
                    margin: 0,
                    color: isActive || isHovered ? '#ffffff' : '#1890ff',
                    fontWeight: 600
                }}>
                    {value}
                </Title>
            </div>
        </Card>
    );
};

const Dashboard = () => {
    // State để lưu dữ liệu thống kê
    const [statisticsData, setStatisticsData] = useState([]);
    // State để hiển thị loading trong lúc chờ gọi API
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSummaryData();
    }, []);

    const fetchSummaryData = async () => {
        try {
            setIsLoading(true);
            // Gọi API, kết quả nhận được đã được Interceptor xử lý
            const response = await getSummaryAPI();

            // SỬA Ở ĐÂY: Kiểm tra status trực tiếp trên response
            if (response && response.status === 200) {
                // SỬA Ở ĐÂY: Dữ liệu thực sự nằm ở response.data thay vì response.data.data
                const apiData = response.data;

                const mappedData = [
                    {
                        id: 1,
                        title: 'Tổng doanh thu',
                        value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(apiData.totalRevenue || 0),
                        isActive: false,
                    },
                    {
                        id: 2,
                        title: 'Số lượng khách hàng',
                        value: new Intl.NumberFormat('vi-VN').format(apiData.userCount || 0),
                        isActive: false,
                    },
                    {
                        id: 3,
                        title: 'Số lượng sản phẩm',
                        value: new Intl.NumberFormat('vi-VN').format(apiData.productCount || 0),
                        isActive: false,
                    },
                    {
                        id: 4,
                        title: 'Số lượng giao dịch',
                        value: new Intl.NumberFormat('vi-VN').format(apiData.orderSuccessCount || 0),
                        isActive: false,
                    },
                ];

                setStatisticsData(mappedData);
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

    return (
        <div style={{ padding: '24px', background: '#fff', minHeight: '100vh' }}>
            <Spin spinning={isLoading} tip="Đang tải dữ liệu...">
                <Row gutter={[24, 24]}>
                    {statisticsData.map((stat) => (
                        <Col xs={24} sm={12} md={6} key={stat.id}>
                            <StatCard
                                title={stat.title}
                                value={stat.value}
                                isActive={stat.isActive}
                            />
                        </Col>
                    ))}
                </Row>
            </Spin>
        </div>
    );
};

export default Dashboard;