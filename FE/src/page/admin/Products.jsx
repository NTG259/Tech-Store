import React, { useEffect, useState } from 'react';
import { Table, Space, message, Button, Card, Typography, Popconfirm, Tooltip, Input, Row, Col, Tag } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    SearchOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { deleteProductAPI, fetchAllProductsAPI } from '../../service/product/api';
import DetailProductModal from '../../components/product/product.detail';
import ProductEdit from '../../components/product/product.edit';
import ProductForm from '../../components/product/product.form';

const { Title } = Typography;

const Product = () => {
    // Trạng thái cho các Modals
    const [isOpenDetailProductModal, setIsOpenDetailProductModal] = useState(false);
    const [isOpenEditProductModal, setIsOpenEditProductModal] = useState(false);
    const [isOpenCreateProductForm, setIsOpenCreateProductForm] = useState(false);
    const [selectedProductData, setSelectedProductData] = useState(null);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await fetchAllProductsAPI();
            if (res && res.data) {
                const formattedData = res.data.map(item => ({
                    ...item,
                    key: item.id
                }));
                setData(formattedData);
            }
        } catch (error) {
            message.error("Lỗi khi tải danh sách sản phẩm");
        } finally {
            setLoading(false); // Đưa vào finally để luôn tắt loading
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteProductAPI(id);
            if (res) {
                message.success("Xóa sản phẩm thành công");
                await loadProducts();
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi xóa");
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            align: 'center',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 500, color: '#1890ff' }}>{text}</span>
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (value) => `${value.toLocaleString()} VNĐ`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'productStatus',
            key: 'productStatus',
            align: 'center',
            render: (status) => (
                <Tag color={status === "available" ? 'green' : 'red'}>
                    {status === "available" ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 180,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setSelectedProductData(record);
                                setIsOpenDetailProductModal(true);
                            }}
                        />
                    </Tooltip>

                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            ghost
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedProductData(record);
                                setIsOpenEditProductModal(true);
                            }}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Xóa sản phẩm"
                        description={`Bạn có chắc muốn xóa sản phẩm ${record.name}?`}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {/* Header của bảng */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '20px' }}>
                    <Col xs={24} sm={12}>
                        <Title level={3} style={{ margin: 0 }}>Danh sách sản phẩm</Title>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={loadProducts}
                                loading={loading}
                            >
                                Làm mới
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{ borderRadius: '6px' }}
                                onClick={() => setIsOpenCreateProductForm(true)}
                            >
                                Thêm mới
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {/* Thanh tìm kiếm nhanh */}
                <div style={{ marginBottom: '16px' }}>
                    <Input
                        placeholder="Tìm kiếm theo tên sản phẩm..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300, borderRadius: '6px' }}
                    />
                </div>

                {/* Bảng dữ liệu */}
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng cộng ${total} sản phẩm`,
                    }}
                    rowClassName="editable-row"
                    bordered
                />
            </Card>

            {/* Modals */}
            <DetailProductModal
                isOpenDetailProductModal={isOpenDetailProductModal}
                setIsOpenDetailProductModal={setIsOpenDetailProductModal}
                selectedProductData={selectedProductData}
            />

            <ProductEdit
                isOpenEditProductModal={isOpenEditProductModal}
                setIsOpenEditProductModal={setIsOpenEditProductModal}
                selectedProductData={selectedProductData}
                loadProducts={loadProducts}
            />

            <ProductForm
                isOpenCreateProductForm={isOpenCreateProductForm}
                setIsOpenCreateProductForm={setIsOpenCreateProductForm}
                loadProducts={loadProducts}
            />
        </div>
    );
};

export default Product;