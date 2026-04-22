import React, { useEffect, useState } from 'react';
import { Table, Space, message, Button, Card, Typography, Popconfirm, Tooltip, Input, Row, Col, Tag, Select } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    FireOutlined,
    FireFilled
} from '@ant-design/icons';

import { deleteProductAPI, fetchAllProductsByAdminAPI, updateProductIsHotAPI } from '../../service/product/api';
import { fetchAllCategoriesAPI } from '../../service/category/api'; 
import DetailProductModal from '../../components/product/product.detail';
import ProductEdit from '../../components/product/product.edit';
import ProductForm from '../../components/product/product.form';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Product = () => {
    const [isOpenDetailProductModal, setIsOpenDetailProductModal] = useState(false);
    const [isOpenEditProductModal, setIsOpenEditProductModal] = useState(false);
    const [isOpenCreateProductForm, setIsOpenCreateProductForm] = useState(false);
    const [selectedProductData, setSelectedProductData] = useState(null);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);

    const [searchText, setSearchText] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchAllCategoriesAPI();
                if (res && res.data) {
                    setCategories(res.data);
                } else if (Array.isArray(res)) {
                    setCategories(res);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };
        loadCategories();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await fetchAllProductsByAdminAPI(current, pageSize, searchText, categoryFilter, statusFilter);

            if (res && res.data) {
                const products = res.data;
                const metaData = res.meta;

                const formattedData = products.map(item => ({
                    ...item,
                    key: item.id
                }));
                setData(formattedData);

                if (metaData && metaData.totalItems !== undefined) {
                    setTotal(metaData.totalItems);
                }
            }
        } catch (error) {
            message.error("Lỗi khi tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const onSearch = (value) => {
        setSearchText(value);
        setCurrent(1);
    };

    const handleToggleHot = async (record) => {
        try {
            const newIsHotStatus = !record.isHot;
            
            const res = await updateProductIsHotAPI(record.id, newIsHotStatus); 
            
            if (res) {
                message.success(`Đã ${newIsHotStatus ? 'thêm' : 'gỡ'} mác Hot cho sản phẩm!`);
                await loadProducts(); 
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật trạng thái Hot");
            console.error(error);
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
       
    }, [current, pageSize, searchText, categoryFilter, statusFilter]);

    const handleTableChange = (pagination) => {
        setCurrent(pagination.current);
        setPageSize(pagination.pageSize);
    };

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
            render: (text, record) => (
                <Space>
                    <span style={{ fontWeight: 500, color: '#1890ff' }}>{text}</span>
                    {record.isHot && <FireFilled style={{ color: '#fa8c16' }} />}
                </Space>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (categoryData) => {
                const categoryName = categoryData && typeof categoryData === 'object'
                    ? categoryData.name
                    : categoryData;

                return categoryName
                    ? <span>{categoryName}</span>
                    : <span style={{ color: 'red' }}>Chưa phân loại</span>;
            }
        },
        {
            title: 'Hãng',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            render: (value) => value ? `${value.toLocaleString()} VNĐ` : '0 VNĐ',
        },
        {
            title: 'Số lượng tồn kho',
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
                <Tag color={status === "PUBLISHED" ? 'green' : 'red'}>
                    {status === "PUBLISHED" ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 220, 
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title={record.isHot ? "Bỏ trạng thái Hot" : "Đặt làm sản phẩm Hot"}>
                        <Popconfirm
                            title={record.isHot ? "Bỏ Hot sản phẩm này?" : "Cập nhật thành sản phẩm Hot?"}
                            onConfirm={() => handleToggleHot(record)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Button
                                shape="circle"
                                icon={record.isHot ? <FireFilled /> : <FireOutlined />}
                                style={{
                                    color: record.isHot ? '#fff' : '#fa8c16',
                                    backgroundColor: record.isHot ? '#fa8c16' : 'transparent',
                                    borderColor: '#fa8c16'
                                }}
                            />
                        </Popconfirm>
                    </Tooltip>

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

                    {/* <Popconfirm
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
                    </Popconfirm> */}
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{ padding: '0px', background: '#fff', minHeight: 'calc(100vh - 120px)' }}>
                <Card bordered={false} style={{ borderRadius: '8px' }}>
                    <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '20px' }}>
                        <Col xs={24} sm={12}>
                            <Title level={3} style={{ margin: 0 }}>Danh sách sản phẩm</Title>
                        </Col>
                        <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                            <Space>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={() => {
                                        setCurrent(1);
                                        setSearchText('');
                                        setInputValue('');
                                        setCategoryFilter('');
                                        setStatusFilter('');
                                    }}
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

                    <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="Tìm kiếm theo tên sản phẩm..."
                                allowClear
                                enterButton
                                onSearch={onSearch}
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    if (e.target.value === '') {
                                        setSearchText('');
                                        setCurrent(1);
                                    }
                                }}
                            />
                        </Col>

                        <Col xs={24} sm={12} md={5}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Lọc theo danh mục"
                                value={categoryFilter || "ALL"}
                                onChange={(val) => {
                                    setCategoryFilter(val === "ALL" ? "" : val);
                                    setCurrent(1);
                                }}
                            >
                                <Option value="ALL">Tất cả danh mục</Option>
                                {categories.map(cat => (
                                    <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                ))}
                            </Select>
                        </Col>

                        <Col xs={24} sm={12} md={5}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Lọc theo trạng thái"
                                value={statusFilter || "ALL"}
                                onChange={(val) => {
                                    setStatusFilter(val === "ALL" ? "" : val);
                                    setCurrent(1);
                                }}
                            >
                                <Option value="ALL">Tất cả trạng thái</Option>
                                <Option value="PUBLISHED">Đang kinh doanh</Option>
                                <Option value="DISCONTINUED">Ngừng kinh doanh</Option>
                            </Select>
                        </Col>
                    </Row>

                    <Table
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        onChange={handleTableChange}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            total: total,
                            showSizeChanger: false,
                            showTotal: (total) => `Tổng cộng ${total} sản phẩm`,
                        }}
                        rowClassName="editable-row"
                        bordered
                    />
                </Card>

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
        </>
    );
};

export default Product;