import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Typography, Divider, Space, Button, Select, message } from 'antd';
import { TruckOutlined, CheckCircleOutlined } from '@ant-design/icons';
// Nhớ import đúng đường dẫn API của bạn
import { updateOrdersByAdminAPI } from '../../service/order/api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const OrderDetailModal = (props) => {
    const { isOpenOrderDetail, setIsOpenOrderDetail, orderData, onRefresh } = props;
    const [form] = Form.useForm();

    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (isOpenOrderDetail && orderData) {
            form.setFieldsValue({
                // Đã bỏ dữ liệu mẫu, nếu không có sẽ để chuỗi rỗng
                fullName: orderData.receiverName || '',
                address: orderData.shippingAddress || '',
                phone: orderData.receiverPhone || '',
                note: orderData.note || '',
                status: orderData.status ? orderData.status.toUpperCase() : 'PENDING',
            });
        } else {
            form.resetFields();
        }
    }, [isOpenOrderDetail, orderData, form]);

    const handleClose = () => {
        setIsOpenOrderDetail(false);
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();

            if (!orderData?.id) {
                message.error("Không tìm thấy ID đơn hàng!");
                return;
            }

            setIsUpdating(true);

            await updateOrdersByAdminAPI(orderData.id, { status: values.status });

            message.success('Cập nhật trạng thái đơn hàng thành công!');

            if (onRefresh) {
                onRefresh();
            }

            handleClose();

        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            if (!error.errorFields) {
                message.error('Cập nhật thất bại. Vui lòng thử lại!');
            }
        } finally {
            setIsUpdating(false);
        }
    };

    // Đã bỏ mảng dữ liệu mẫu, fallback về mảng rỗng
    const items = orderData?.items || [];

    // Tính toán tiền lấy hoàn toàn từ data thật
    const subtotal = orderData?.totalAmount ? Number(orderData.totalAmount) : 0;
    const shippingFee = 0; // Shipping fee not in Orders data
    const total = subtotal + shippingFee;

    return (
        <Modal
            title={<Title level={3} style={{ margin: '0 0 20px 0' }}>Order Details</Title>}
            open={isOpenOrderDetail}
            onCancel={handleClose}
            width={850}
            centered
            maskClosable={true}
            footer={[
                <Button key="close" onClick={handleClose} style={{ borderRadius: '6px' }}>
                    Đóng
                </Button>,
                <Button
                    key="update"
                    type="primary"
                    onClick={handleUpdate}
                    loading={isUpdating}
                    style={{ borderRadius: '6px' }}
                >
                    Cập nhật
                </Button>
            ]}
            styles={{ body: { padding: '16px 24px' } }}
        >
            <Form form={form} layout="vertical">
                <Row gutter={40}>
                    {/* CỘT TRÁI */}
                    <Col xs={24} md={12}>
                        <Form.Item label="Full Name" name="fullName" style={{ marginBottom: '16px' }}>
                            <Input readOnly style={{ backgroundColor: '#f5f5f5', border: 'none', color: '#262626' }} />
                        </Form.Item>

                        <Form.Item label="Address" name="address" style={{ marginBottom: '16px' }}>
                            <Input readOnly style={{ backgroundColor: '#f5f5f5', border: 'none', color: '#262626' }} />
                        </Form.Item>

                        <Form.Item label="Phone Number" name="phone" style={{ marginBottom: '16px' }}>
                            <Input readOnly style={{ backgroundColor: '#f5f5f5', border: 'none', color: '#262626' }} />
                        </Form.Item>

                        <Form.Item label="Note" name="note" style={{ marginBottom: '16px' }}>
                            <TextArea rows={3} readOnly style={{ backgroundColor: '#f5f5f5', border: 'none', color: '#262626' }} />
                        </Form.Item>

                        <Form.Item label="Order Status" name="status" style={{ marginBottom: '0' }}>
                            <Select style={{ width: '100%' }}>
                                <Option value="PENDING">Pending (Chờ xử lý)</Option>
                                <Option value="SHIPPING">Shipping (Đang giao)</Option>
                                <Option value="DELIVERED">Delivered (Đã giao thành công)</Option>
                                <Option value="CANCELLED">Cancelled (Đã hủy)</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* CỘT PHẢI */}
                    <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                            {items.length > 0 ? (
                                items.map(item => (
                                    <Row key={item.id} align="middle" justify="space-between" style={{ marginBottom: '16px' }}>
                                        <Space>
                                            <img
                                                src={item?.productImg || item?.image || "https://placehold.co/200x200/f5f5f5/333333/png?text=No+Image"}
                                                alt={item.productName || item.name || 'Product'}
                                                style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                                            />
                                            <Text>{item.productName || item.name}</Text>
                                        </Space>
                                        <Text>
                                            {item.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price) : '0 ₫'}
                                        </Text>
                                    </Row>
                                ))
                            ) : (
                                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>
                                    Không có sản phẩm nào
                                </Text>
                            )}
                        </div>

                        <div>
                            <Row justify="space-between" style={{ marginBottom: '12px' }}>
                                <Text>Subtotal:</Text>
                                <Text>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</Text>
                            </Row>
                            <Row justify="space-between" style={{ marginBottom: '16px' }}>
                                <Text>Shipping:</Text>
                                <Text>{shippingFee === 0 ? 'Free' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</Text>
                            </Row>

                            <Divider style={{ margin: '12px 0' }} />

                            <Row justify="space-between" style={{ marginBottom: '24px' }}>
                                <Text>Total:</Text>
                                <Text strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</Text>
                            </Row>

                            {/* Logic hiển thị trạng thái giao hàng động dựa trên orderData.status */}
                            {orderData?.status?.toUpperCase() === 'DELIVERED' && (
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <Space align="center" size="middle">
                                        <TruckOutlined style={{ fontSize: '18px' }} />
                                        <Text>Đã giao hàng</Text>
                                    </Space>
                                    <Space align="start" size="middle">
                                        <CheckCircleOutlined style={{ fontSize: '24px', marginTop: '2px', color: '#52c41a' }} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Text strong style={{ color: '#52c41a' }}>Thành công</Text>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                Đơn hàng đã được giao thành công tới khách hàng.
                                            </Text>
                                        </div>
                                    </Space>
                                </Space>
                            )}
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default OrderDetailModal;