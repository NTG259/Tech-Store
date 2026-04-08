import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Typography, Tooltip, Button, Row, Col, Input, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { fetchAllOrdersByAdminAPI } from '../../service/order/api';
import OrderDetailModal from '../../components/order/order.detail';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const statusMap = {
  PENDING: 'Đang chờ xử lý',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao thành công',
  CANCELLED: 'Đã hủy',
  CONFIRMED: 'Thành công'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  const [isOpenOrderDetail, setIsOpenOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize, searchText, statusFilter);
  }, [pagination.current, pagination.pageSize, searchText, statusFilter]);

  const fetchOrders = async (page, size, search, status) => {
    setIsLoading(true);
    try {
      const response = await fetchAllOrdersByAdminAPI(page, size, search, status);

      if (response && response.data && Array.isArray(response.data)) {
        const formattedData = response.data.map(item => ({
          ...item,
          key: item.id,
        }));

        setOrders(formattedData);
        setPagination(prev => ({
          ...prev,
          current: response.meta.page,
          pageSize: response.meta.size,
          total: response.meta.totalItems,
        }));
      } else {
        console.warn("Không có dữ liệu hoặc cấu trúc không đúng:", response);
        setOrders([]);
      }
    } catch (error) {
      console.error("Lỗi fetch đơn hàng:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearch = (value) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setSearchText('');
      setPagination(prev => ({ ...prev, current: 1 }));
    }
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value === 'ALL' ? null : value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (newPagination) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }));
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text) => <span style={{ fontWeight: 600, color: '#1890ff' }}>#{text}</span>
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => {
        if (!text) return "N/A";
        const dateObj = new Date(text);
        return (
          <div>
            <div style={{ fontWeight: 500 }}>
              {dateObj.toLocaleDateString('en-GB')}
            </div>
            <div style={{ color: '#8c8c8c', fontSize: '13px' }}>
              at {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )
      }
    },
    {
      title: 'Tài khoản',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span style={{ fontWeight: 500 }}>{text || 'Khách vãng lai'}</span>
    },
    {
      title: 'Người nhận',
      dataIndex: 'receiverName',
      key: 'receiverName',
      render: (text) => <span style={{ fontWeight: 500 }}>{text || 'Khách vãng lai'}</span>
    },
    {
      title: 'Tổng giá',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text, record) => {
        let total = text;
        if (total === null && record.items) {
          total = record.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        return `${new Intl.NumberFormat('vi-VN').format(total || 0)} VNĐ`;
      }
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (status) => {
        const currentStatus = status ? status.toUpperCase() : 'PENDING';
        let color = 'default';
        if (currentStatus === 'CONFIRMED' || currentStatus === 'DELIVERED') color = 'success';
        else if (currentStatus === 'PENDING') color = 'warning';
        else if (currentStatus === 'SHIPPING') color = 'processing';
        else if (currentStatus === 'CANCELLED') color = 'error';

        return <Tag color={color}>{statusMap[currentStatus] || currentStatus}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setIsOpenOrderDetail(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: '0px', background: '#fff', minHeight: 'calc(100vh - 120px)' }}>
        <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Row align="middle" style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <Title level={3} style={{ margin: 0 }}>Danh sách đơn hàng</Title>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Tìm kiếm theo tên khách hàng..."
                allowClear
                enterButton
                onSearch={onSearch}
                onChange={handleSearchChange}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="Lọc theo trạng thái"
                value={statusFilter || 'ALL'}
                onChange={handleStatusChange}
              >
                <Option value="ALL">Tất cả trạng thái</Option>
                <Option value="PENDING">Đang chờ xử lý</Option>
                <Option value="SHIPPING">Đang giao</Option>
                <Option value="DELIVERED">Đã giao thành công</Option>
                <Option value="CANCELLED">Đã hủy</Option>
                <Option value="CONFIRMED">Thành công</Option>
              </Select>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={orders}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: false,
              showTotal: (total) => `Tổng cộng ${total} đơn hàng`
            }}
            onChange={handleTableChange}
            loading={isLoading}
            bordered
          />
        </Card>
      </div>

      <OrderDetailModal
        isOpenOrderDetail={isOpenOrderDetail}
        setIsOpenOrderDetail={setIsOpenOrderDetail}
        orderData={selectedOrder}
        onRefresh={() => fetchOrders(pagination.current, pagination.pageSize, searchText, statusFilter)}
      />
    </>
  );
};

export default Orders;