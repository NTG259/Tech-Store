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

    const items = orderData?.items || [];

    const subtotal = orderData?.totalAmount ? Number(orderData.totalAmount) : 0;
    const shippingFee = 0; 
    const total = subtotal + shippingFee;

    return (
        <Modal
            title={<Title level={3} style={{ margin: '0 0 20px 0' }}>Hóa đơn</Title>}
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
                        <Form.Item label="Người nhận" name="fullName" style={{ marginBottom: '16px' }}>
                            <Input readOnly style={{ backgroundColor: '#f5f5f5', border: 'none', color: '#262626' }} />
                        </Form.Item>

                        {/* Đã đổi Input thành TextArea và thêm autoSize */}
                        <Form.Item label="Địa chỉ nhận hàng" name="address" style={{ marginBottom: '16px' }}>
                            <TextArea 
                                readOnly 
                                autoSize={{ minRows: 1, maxRows: 4 }} 
                                style={{ backgroundColor: '#f5f5f5', border: 'none', color: '#262626' }} 
                            />
                        </Form.Item>

                        <Form.Item label="Số điện thoại" name="phone" style={{ marginBottom: '16px' }}>
                            <Input readOnly style={{ backgroundColor: '#f5f5f5', border: 'none', color: '#262626' }} />
                        </Form.Item>

                        <Form.Item label="Ghi chú" name="note" style={{ marginBottom: '16px' }}>
                            <TextArea rows={3} readOnly style={{ backgroundColor: '#f5f5f5', border: 'none', color: '#262626' }} />
                        </Form.Item>

                        <Form.Item label="Trạng thái đơn hàng" name="status" style={{ marginBottom: '0' }}>
                            <Select style={{ width: '100%' }}>
                                <Option value="PENDING">Đang chờ xử lý</Option>
                                <Option value="SHIPPING">Đang giao</Option>
                                <Option value="DELIVERED">Đã giao thành công</Option>
                                <Option value="CANCELLED">Đã hủy</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* CỘT PHẢI */}
                    <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, maxHeight: '260px', overflowY: 'auto', marginBottom: '16px', paddingRight: '8px' }}>
                            {items.length > 0 ? (
                                items.map(item => {
                                    // Xử lý lấy data an toàn
                                    const productName = item.productName || item.name || 'Product';
                                    const productImage = item.productImg || item.image || "https://placehold.co/200x200/f5f5f5/333333/png?text=No+Image";
                                    const price = item.price ? Number(item.price) : 0;
                                    const qty = item.quantity || item.qty || 1; // Fallback về 1 nếu không có
                                    const lineTotal = price * qty;

                                    return (
                                        <Row key={item.id} align="middle" justify="space-between" style={{ marginBottom: '16px' }}>
                                            <Space align="start">
                                                <div style={{ position: 'relative' }}>
                                                    <img
                                                        src={productImage}
                                                        alt={productName}
                                                        style={{ width: '50px', height: '50px', objectFit: 'contain', border: '1px solid #f0f0f0', borderRadius: '4px' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Text style={{ fontWeight: 500, maxWidth: '160px' }} ellipsis={{ tooltip: productName }}>
                                                        {productName}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: '13px' }}>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)} x {qty}
                                                    </Text>
                                                </div>
                                            </Space>
                                            
                                            {/* Tổng tiền của dòng đó */}
                                            <Text strong>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(lineTotal)}
                                            </Text>
                                        </Row>
                                    );
                                })
                            ) : (
                                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>
                                    Không có sản phẩm nào
                                </Text>
                            )}
                        </div>

                        <div>
                            <Row justify="space-between" style={{ marginBottom: '12px' }}>
                                <Text>Tạm tính:</Text>
                                <Text>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</Text>
                            </Row>
                            <Row justify="space-between" style={{ marginBottom: '16px' }}>
                                <Text>Phí vận chuyển:</Text>
                                <Text>{shippingFee === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</Text>
                            </Row>

                            <Divider style={{ margin: '12px 0' }} />

                            <Row justify="space-between" style={{ marginBottom: '24px' }}>
                                <Text>Tổng giá:</Text>
                                <Text strong style={{ fontSize: '16px', color: '#db4444' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                                </Text>
                            </Row>

                            {orderData?.status?.toUpperCase() === 'DELIVERED' && (
                                <Space direction="vertical" size="large" style={{ width: '100%', backgroundColor: '#f6ffed', padding: '12px', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
                                    <Space align="center" size="middle">
                                        <TruckOutlined style={{ fontSize: '18px', color: '#52c41a' }} />
                                        <Text strong style={{ color: '#52c41a' }}>Đã giao hàng</Text>
                                    </Space>
                                    <Space align="start" size="middle">
                                        <CheckCircleOutlined style={{ fontSize: '24px', marginTop: '2px', color: '#52c41a' }} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Text strong style={{ color: '#52c41a' }}>Thành công</Text>
                                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                                Đơn hàng đã được giao thành công tới tay khách hàng.
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