import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, Typography, InputNumber, Select, Upload, message, Image, Space } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { updateProductAPI } from '../../service/product/api';
import { uploadToCloudinary } from '../../service/img/api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ProductEdit = (props) => {
    // Nhớ truyền thêm setSelectedProductData từ component cha xuống nhé
    const { isOpenEditProductModal, setIsOpenEditProductModal, loadProducts, selectedProductData, setSelectedProductData } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // State cho việc xử lý ảnh
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [imageUrl, setImageUrl] = useState("");

    // Đổ dữ liệu từ row đã chọn vào Form khi Modal mở
    useEffect(() => {
        if (selectedProductData && isOpenEditProductModal) {
            form.setFieldsValue({
                id: selectedProductData.id,
                name: selectedProductData.name,
                brand: selectedProductData.brand,
                price: selectedProductData.price,
                stockQuantity: selectedProductData.stockQuantity,
                description: selectedProductData.description,
                productStatus: selectedProductData.productStatus,
            });

            // Xử lý hiển thị ảnh cũ nếu sản phẩm đã có ảnh
            if (selectedProductData.productImg) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'product.png',
                        status: 'done',
                        url: selectedProductData.productImg,
                    }
                ]);
                setImageUrl(selectedProductData.productImg);
            } else {
                setFileList([]);
                setImageUrl("");
            }
        }
    }, [selectedProductData, isOpenEditProductModal, form]);

    const handleCancel = () => {
        setIsOpenEditProductModal(false);
        if (setSelectedProductData) setSelectedProductData(null);
        form.resetFields();
        setFileList([]);
        setImageUrl("");
    };

    // --- CÁC HÀM XỬ LÝ ẢNH ---
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handleCustomUpload = async (options) => {
        await uploadToCloudinary({
            ...options,
            onSuccess: (data, file) => {
                setImageUrl(data.secure_url);
                // hello hi how are you me fine
                options.onSuccess(data, file);
            },
            onError: (err) => {
                options.onError(err);
            }
        });

    };

    const onFinish = async (values) => {
        setLoading(true);
        const payloadToBackend = {
            name: values.name,
            brand: values.brand,
            price: values.price,
            stockQuantity: values.stockQuantity,
            description: values.description,
            productStatus: values.productStatus,
            productImg: imageUrl || previewImage
        };

        const productId = selectedProductData?.id || values.id;
        if (!productId) {
            message.error('Thiếu ID sản phẩm.');
            setLoading(false);
            return;
        }

        try {
            const res = await updateProductAPI(productId, payloadToBackend);
            if (res && res.status < 400) {
                message.success("Cập nhật thông tin sản phẩm thành công!");
                await loadProducts();
                handleCancel();
            } else {
                message.error(res.data?.message || "Cập nhật thất bại");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <EditOutlined style={{ color: '#faad14' }} />
                    <span>Chỉnh sửa sản phẩm</span>
                </Space>
            }
            open={isOpenEditProductModal}
            onCancel={handleCancel}
            width={850}
            centered
            maskClosable={false}
            footer={[
                <Button key="close" onClick={handleCancel}>Hủy bỏ</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>Lưu thay đổi</Button>
            ]}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={24}>
                    {/* CỘT TRÁI: THÔNG TIN SẢN PHẨM */}
                    <Col span={16}>
                        <Title level={5}>Thông tin cơ bản</Title>

                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
                            <Input placeholder="Nhập tên sản phẩm..." />
                        </Form.Item>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item label="Thương hiệu" name="brand" rules={[{ required: true, message: 'Vui lòng nhập thương hiệu' }]}>
                                    <Input placeholder="Apple, Samsung, Sony..." />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Trạng thái kinh doanh" name="productStatus" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
                                    <Select>
                                        <Option value="available">Còn hàng / Đang bán</Option>
                                        <Option value="unavailable">Ngừng kinh doanh</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item label="Giá bán (VNĐ)" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Số lượng tồn kho" name="stockQuantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
                                    <InputNumber style={{ width: '100%' }} min={0} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Mô tả sản phẩm" name="description">
                            <TextArea rows={3} placeholder="Mô tả chi tiết về sản phẩm..." />
                        </Form.Item>
                    </Col>

                    {/* CỘT PHẢI: HÌNH ẢNH */}
                    <Col span={8} style={{ borderLeft: '1px solid #f0f0f0', textAlign: 'center' }}>
                        <Title level={5} style={{ textAlign: 'left' }}>Ảnh sản phẩm</Title>
                        <Form.Item name="productImg">
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

            {/* PREVIEW IMAGE MODAL TÍCH HỢP SẴN */}
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                />
            )}
        </Modal>
    );
};

export default ProductEdit;