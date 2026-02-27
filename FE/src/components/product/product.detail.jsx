import React, { useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, Typography, InputNumber, Badge, Tag, Space } from 'antd';
import { ShoppingOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const DetailProductModal = (props) => {
    const { isOpenDetailProductModal, setIsOpenDetailProductModal, selectedProductData } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (isOpenDetailProductModal && selectedProductData) {
            form.setFieldsValue({
                name: selectedProductData?.name || '',
                brand: selectedProductData?.brand || '',
                price: selectedProductData?.price || 0,
                stockQuantity: selectedProductData?.stockQuantity || 0,
                description: selectedProductData?.description || 'Không có mô tả',
                productStatus: selectedProductData.productStatus === "available" ? 'Đang kinh doanh' : 'Ngừng kinh doanh',
            });
        } else {
            form.resetFields();
        }
    }, [isOpenDetailProductModal, selectedProductData, form]);

    const handleCancel = () => setIsOpenDetailProductModal(false);

    return (
        <Modal
            title={
                <Space>
                    <ShoppingOutlined style={{ color: '#1890ff' }} />
                    <span>Chi tiết sản phẩm</span>
                </Space>
            }
            open={isOpenDetailProductModal}
            onCancel={handleCancel}
            width={800}
            centered
            maskClosable={true}
            footer={[
                <Button key="close" type="primary" onClick={handleCancel}>
                    Đóng
                </Button>
            ]}
            styles={{ body: { padding: '20px 24px' } }}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Row gutter={24}>
                    <Col span={16}>
                        <Title level={5} style={{ marginBottom: '15px' }}>
                            <InfoCircleOutlined /> Thông tin chung
                        </Title>

                        <Form.Item label="Tên sản phẩm" name="name" style={{ marginBottom: '12px' }}>
                            <Input readOnly style={{ fontWeight: 'bold', color: '#262626' }} />
                        </Form.Item>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item label="Thương hiệu" name="brand" style={{ marginBottom: '12px' }}>
                                    <Input readOnly />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Trạng thái" name="productStatus" style={{ marginBottom: '12px' }}>
                                    <Input readOnly />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item label="Giá bán (VNĐ)" name="price" style={{ marginBottom: '12px' }}>
                                    <InputNumber
                                        readOnly
                                        style={{ width: '100%', color: '#cf1322', fontWeight: 'bold' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Số lượng tồn" name="stockQuantity" style={{ marginBottom: '12px' }}>
                                    <InputNumber style={{ width: '100%' }} readOnly />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Mô tả chi tiết" name="description" style={{ marginBottom: '0' }}>
                            <TextArea rows={4} readOnly style={{ backgroundColor: '#fafafa' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '8px',
                            border: '1px solid #f0f0f0',
                            overflow: 'hidden',
                            marginBottom: '15px',
                            backgroundColor: '#fafafa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* Placeholder cho ảnh sản phẩm */}
                            <img
                                src={selectedProductData?.productImg || ""}
                                alt="Product"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                        <Tag color={(selectedProductData?.stockQuantity || 0) > 0 ? "green" : "red"} style={{ fontSize: '14px', padding: '4px 12px' }}>
                            {(selectedProductData?.stockQuantity || 0) > 0 ? "CÒN HÀNG" : "HẾT HÀNG"}
                        </Tag>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default DetailProductModal;