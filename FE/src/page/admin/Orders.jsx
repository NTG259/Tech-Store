import React from 'react';
import { Table, Tag, Card, Typography, Tooltip, Button, Row, Col, Breadcrumb } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const columns = [
  {
    title: 'ORDER ID',
    dataIndex: 'orderId',
    key: 'orderId',
    width: 120,
    render: (text) => <span style={{ fontWeight: 600, color: '#1890ff' }}>{text}</span>,
  },
  {
    title: 'CREATED',
    dataIndex: 'created',
    key: 'created',
    render: (_, record) => (
      <div>
        <div style={{ fontWeight: 500 }}>{record.createdDate}</div>
        <div style={{ color: '#8c8c8c', fontSize: '13px' }}>at {record.createdTime}</div>
      </div>
    ),
  },
  {
    title: 'CUSTOMER',
    dataIndex: 'customer',
    key: 'customer',
    render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
  },
  {
    title: 'TOTAL',
    dataIndex: 'total',
    key: 'total',
    render: (text) => `${Number(text).toLocaleString()} VNĐ`,
  },
  {
    title: 'STATUS',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    render: () => (
      <Tag color="success">
        Success
      </Tag>
    ),
  },
  {
    title: 'ACTION',
    key: 'action',
    align: 'center',
    width: 120,
    render: () => (
      <Tooltip title="Xem chi tiết">
        <Button
          shape="circle"
          icon={<EyeOutlined />}
          onClick={() => console.log("Xem chi tiết đơn hàng")}
        />
      </Tooltip>
    ),
  },
];

const data = [
  {
    key: '1',
    orderId: '#6548',
    createdDate: '04/17/23',
    createdTime: '8:25 PM',
    customer: 'Joseph Wheeler',
    total: '2000000',
  },
  {
    key: '2',
    orderId: '#6549',
    createdDate: '04/17/23',
    createdTime: '8:40 PM',
    customer: 'Alice Smith',
    total: '1500000',
  },
  {
    key: '3',
    orderId: '#6550',
    createdDate: '04/18/23',
    createdTime: '9:15 AM',
    customer: 'John Doe',
    total: '3200000',
  },
];

const OrdersList = () => {
  return (
    <>
      <div style={{ padding: '0px', background: '#fff', minHeight: '100vh-120px' }}>
        <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          {/* Header của bảng */}
          <Row align="middle" style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <Title level={3} style={{ margin: 0 }}>Danh sách đơn hàng</Title>
            </Col>
          </Row>

          {/* Bảng dữ liệu */}
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
            }}
            bordered
          />
        </Card>
      </div>
    </>
  );
};

export default OrdersList;