import React, { useState } from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const statisticsData = [
    {
        id: 1,
        title: 'Total Revenue',
        value: '$81.000',
        isActive: false,
    },
    {
        id: 2,
        title: 'Total Customer',
        value: '5.000',
        isActive: false,
    },
    {
        id: 3,
        title: 'Total Product',
        value: '5.000',
        isActive: false,
    },
    {
        id: 4,
        title: 'Total Transactions',
        value: '12.000',
        isActive: false,
    },
];

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
    return (
        <div style={{ padding: '24px', background: '#fff', minHeight: '100vh' }}>
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
        </div>
    );
};

export default Dashboard;