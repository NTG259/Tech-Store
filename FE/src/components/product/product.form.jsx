import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, Typography, InputNumber, Select, Upload, message, Image, Space } from 'antd';
import { ShoppingOutlined, PlusOutlined } from '@ant-design/icons';

import { createProductAPI } from '../../service/product/api';
import { uploadToCloudinary } from '../../service/img/api';

import { fetchAllCategoriesAPI } from '../../service/category/api';

import "./product.css"

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ProductForm = (props) => {
    const { isOpenCreateProductForm, setIsOpenCreateProductForm, loadProducts } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [categories, setCategories] = useState([]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetchAllCategoriesAPI(1, 100); 
                if (res && res.status === 200 && res.data) {
                    setCategories(res.data);
                } else {
                    message.error("Không thể tải danh sách thể loại");
                }
            } catch (error) {
                console.error("Lỗi fetch categories:", error);
                message.error("Lỗi khi tải danh sách thể loại");
            }
        };
        fetchCategories();
    }, []);

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length === 0) {
            setImageUrl("");
        }
    };

    const handleCustomUpload = async (options) => {
        await uploadToCloudinary({
            ...options,
            onSuccess: (data, file) => {
                setImageUrl(data.secure_url);
                options.onSuccess(data, file);
            },
            onError: (err) => {
                options.onError(err);
            }
        });
    };

    const handleCancel = () => {
        setIsOpenCreateProductForm(false);
        form.resetFields();
        setFileList([]);
        setImageUrl("");
    };

    const onFinish = async (values) => {
        setLoading(true);
        const payloadToBackend = {
            name: values.name,
            brand: values.brand,
            price: values.price,
            categoryId: values.category,
            stockQuantity: values.stockQuantity,
            description: values.description,
            productImg: imageUrl,
            productStatus: values.productStatus,
            isHot: false,
        };

        try {
            const res = await createProductAPI(payloadToBackend);
            if (res && res.status < 400) {
                message.success("Tạo sản phẩm thành công!");
                await loadProducts();
                handleCancel();
            } else {
                message.error(res?.message || "Tên sản phẩm bị trùng lặp hoặc có lỗi");
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <ShoppingOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                    <span style={{ fontSize: '18px' }}>Thêm mới sản phẩm</span>
                </Space>
            }
            open={isOpenCreateProductForm}
            onCancel={handleCancel}
            width={850}
            centered
            maskClosable={false}
            footer={[
                <Button key="close" onClick={handleCancel}>
                    Hủy bỏ
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
                    Tạo mới
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ stockQuantity: 0, productStatus: 'DISCONTINUED' }}
            >
                <Row gutter={24}>
                    
                    <Col span={16}>
                        <Title level={5} style={{ marginBottom: '15px' }}>
                            Thông tin cơ bản
                        </Title>

                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                        >
                            <Input placeholder="Nhập tên sản phẩm..." />
                        </Form.Item>

                        <Row gutter={12}>
                            <Col span={8}>
                                <Form.Item
                                    label="Thương hiệu"
                                    name="brand"
                                    rules={[{ required: true, message: 'Vui lòng nhập thương hiệu' }]}
                                >
                                    <Input placeholder="Apple, Samsung, Sony..." />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Thể loại"
                                    name="category"
                                    rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
                                >
                                    <Select placeholder="Chọn thể loại">
                                        {categories.map(cat => {
                                            const catId = cat.id || cat._id;
                                            return (
                                                <Option key={catId} value={catId}>
                                                    {cat.name}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Trạng thái kinh doanh" name="productStatus" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
                                    <Select>
                                        <Option value="PUBLISHED">Đang bán</Option>
                                        <Option value="DISCONTINUED">Ngừng kinh doanh</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label="Giá bán (VNĐ)"
                                    name="price"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        min={0}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Số lượng tồn kho"
                                    name="stockQuantity"
                                    rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={0} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Mô tả sản phẩm" name="description">
                            <TextArea rows={3} placeholder="Mô tả chi tiết về sản phẩm..." />
                        </Form.Item>
                    </Col>

                    
                    <Col span={8} style={{ borderLeft: '1px solid #f0f0f0', textAlign: 'center' }}>
                        <Title level={5} style={{ textAlign: 'left', marginBottom: '15px' }}>Ảnh sản phẩm</Title>
                        <Form.Item name="image">
                            <Upload
                                customRequest={handleCustomUpload}
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                maxCount={1}
                            >
                                {fileList.length > 0 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </Modal>
    );
};

export default ProductForm;
