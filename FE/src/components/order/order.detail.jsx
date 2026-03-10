import React, { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Typography, Divider, Space, Button, Select } from 'antd'; // Thêm Select
import { TruckOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select; // Khai báo Option cho Dropdown

const OrderDetailModal = (props) => {
    // Nhận thêm hàm onUpdateStatus từ component cha để xử lý logic gọi API
    const { isOpenOrderDetail, setIsOpenOrderDetail, orderData, onUpdateStatus } = props;
    const [form] = Form.useForm();

    // Điền dữ liệu vào form mỗi khi orderData thay đổi hoặc Modal được mở
    useEffect(() => {
        if (isOpenOrderDetail && orderData) {
            form.setFieldsValue({
                fullName: orderData.customer || 'NTG', 
                address: orderData.address || '123 ABC Street',
                phone: orderData.phone || '0123456789',
                note: orderData.note || 'Không có ghi chú',
                status: orderData.status || 'pending', // Lấy trạng thái từ orderData (mặc định pending)
            });
        } else {
            form.resetFields();
        }
    }, [isOpenOrderDetail, orderData, form]);

    const handleClose = () => {
        setIsOpenOrderDetail(false);
    };

    // Hàm xử lý khi bấm nút Cập nhật
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            console.log("Dữ liệu cập nhật:", values.status);
            
            // Gọi hàm từ component cha truyền vào để gọi API cập nhật status
            if (onUpdateStatus && orderData) {
                onUpdateStatus(orderData._id, values.status);
            }
            
            // Có thể đóng modal sau khi cập nhật thành công (tuỳ logic của bạn)
            // handleClose(); 
        } catch (error) {
            console.log("Lỗi validate form:", error);
        }
    };

    // Dữ liệu mẫu cho sản phẩm
    const items = orderData?.items || [
        { _id: '1', name: 'LCD Monitor', price: 650, image: 'https://placehold.co/200x200/f5f5f5/333333/png?text=No+Image' },
        { _id: '2', name: 'H1 Gamepad', price: 1100, image: 'https://placehold.co/200x200/f5f5f5/333333/png?text=No+Image' },
    ];

    const subtotal = orderData?.total ? Number(orderData.total) : 1750;
    const shippingFee = orderData?.shippingFee || 0;
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
                // Thêm nút Cập nhật vào Footer
                <Button key="update" type="primary" onClick={handleUpdate} style={{ borderRadius: '6px' }}>
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

                        {/* DROPDOWN UPDATE STATUS MỚI THÊM VÀO */}
                        <Form.Item label="Order Status" name="status" style={{ marginBottom: '0' }}>
                            <Select style={{ width: '100%' }}>
                                <Option value="PENDING">Pending (Chờ xử lý)</Option>
                                <Option value="PROCESSING">Processing (Đang xử lý)</Option>
                                <Option value="SHIPPED">Shipped (Đang giao)</Option>
                                <Option value="DELIVERED">Delivered (Đã giao thành công)</Option>
                                <Option value="CANCELLED">Cancelled (Đã hủy)</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* CỘT PHẢI */}
                    <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                            {items.map(item => (
                                <Row key={item._id} align="middle" justify="space-between" style={{ marginBottom: '16px' }}>
                                    <Space>
                                        <img
                                            src={item?.image || "https://placehold.co/200x200/f5f5f5/333333/png?text=No+Image"}
                                            alt={item.name}
                                            style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                                        />
                                        <Text>{item.name}</Text>
                                    </Space>
                                    <Text>${item.price}</Text>
                                </Row>
                            ))}
                        </div>

                        <div>
                            <Row justify="space-between" style={{ marginBottom: '12px' }}>
                                <Text>Subtotal:</Text>
                                <Text>${subtotal.toLocaleString()}</Text>
                            </Row>
                            <Row justify="space-between" style={{ marginBottom: '16px' }}>
                                <Text>Shipping:</Text>
                                <Text>{shippingFee === 0 ? 'Free' : `$${shippingFee}`}</Text>
                            </Row>

                            <Divider style={{ margin: '12px 0' }} />

                            <Row justify="space-between" style={{ marginBottom: '24px' }}>
                                <Text>Total:</Text>
                                <Text strong>${total.toLocaleString()}</Text>
                            </Row>

                            {/* Logic hiển thị trạng thái động (Optional) */}
                            {/* Bạn có thể thay đổi icon dựa vào orderData.status nếu muốn */}
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Space align="center" size="middle">
                                    <TruckOutlined style={{ fontSize: '18px' }} />
                                    <Text>Cash on delivery</Text>
                                </Space>
                                <Space align="start" size="middle">
                                    <CheckCircleOutlined style={{ fontSize: '24px', marginTop: '2px', color: '#52c41a' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Text strong style={{ color: '#52c41a' }}>Success</Text>
                                        <Text type="secondary" style={{ fontSize: '12px', textDecoration: 'underline' }}>
                                            Your order has been delivered successfully
                                        </Text>
                                    </div>
                                </Space>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default OrderDetailModal;