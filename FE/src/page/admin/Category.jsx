import React, { useEffect, useState } from 'react';
import { Table, Space, message, Button, Card, Typography, Popconfirm, Tooltip, Input, Row, Col, Tag } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';

import { fetchAllCategoriesByAdminAPI, deleteCategoryAPI } from '../../service/category/api';
import CategoryForm from '../../components/category/category.form';
import CategoryEdit from '../../components/category/category.edit';

const { Title, Text } = Typography;
const { Search } = Input;

const Category = () => {
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [inputValue, setInputValue] = useState('');

    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('asc');

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await fetchAllCategoriesByAdminAPI(current, pageSize, searchText, sortBy, direction);

            if (res && res.data) {
                const categories = res.data;
                const formattedData = categories
                    .filter(item => item.name !== "Chưa xác định") 
                    .map(item => ({
                        ...item,
                        key: item.id
                    }));

                setData(formattedData);

                const metaData = res.meta;
                if (metaData && metaData.totalItems !== undefined) {
                    setTotal(metaData.totalItems);
                } else {
                    setTotal(formattedData.length);
                }
            }
        } catch (error) {
            message.error("Lỗi khi tải danh sách danh mục");
        } finally {
            setLoading(false);
        }
    };


    const onSearch = (value) => {
        setSearchText(value);
        setCurrent(1); 
    };

    useEffect(() => {
        loadCategories();
    }, [current, pageSize, searchText, sortBy, direction]);

    const handleTableChange = (pagination, filters, sorter) => {
        setCurrent(pagination.current);
        setPageSize(pagination.pageSize);

        if (sorter && sorter.order) {
            setSortBy(sorter.field);
            setDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
        } else {
            setSortBy('id');
            setDirection('asc');
        }
    };

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    const customSortIcon = ({ sortOrder }) => {
        if (sortOrder === 'ascend') {
            return <ArrowUpOutlined style={{ color: '#1890ff', fontSize: '12px' }} />;
        }
        if (sortOrder === 'descend') {
            return <ArrowDownOutlined style={{ color: '#1890ff', fontSize: '12px' }} />;
        }
        return <ArrowUpOutlined style={{ color: '#d9d9d9', fontSize: '12px' }} />;
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
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 500, color: '#1890ff' }}>{text}</span>
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'totalProducts',
            key: 'totalProducts',
            align: 'center',
            sorter: true,
            sortIcon: customSortIcon,
            sortOrder: sortBy === 'totalProducts' ? (direction === 'asc' ? 'ascend' : 'descend') : null,
            render: (val) => <Tag color="blue">{val}</Tag>
        },
        {
            title: 'Đã bán',
            dataIndex: 'totalSold',
            key: 'totalSold',
            align: 'center',
            sorter: true,
            sortIcon: customSortIcon,
            sortOrder: sortBy === 'totalSold' ? (direction === 'asc' ? 'ascend' : 'descend') : null,
            render: (val) => <Tag color="green">{val}</Tag>
        },
        {
            title: 'Doanh thu',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            align: 'right',
            sorter: true,
            sortIcon: customSortIcon,
            sortOrder: sortBy === 'totalRevenue' ? (direction === 'asc' ? 'ascend' : 'descend') : null,
            render: (val) => <Text strong style={{ color: '#cf1322' }}>{formatCurrency(val)}</Text>
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            ghost
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedCategory(record);
                                setIsOpenEditModal(true);
                            }}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Xóa danh mục"
                        description={`Bạn có chắc muốn xóa danh mục "${record.name}"?`}
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
        <div style={{ padding: '0px', background: '#fff', minHeight: 'calc(100vh - 120px)' }}>
            <Card bordered={false} style={{ borderRadius: '8px' }}>
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '20px' }}>
                    <Col xs={24} sm={12}>
                        <Title level={3} style={{ margin: 0 }}>Danh sách danh mục</Title>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => {
                                    setCurrent(1);
                                    setSearchText('');
                                    setInputValue('');
                                    setSortBy('id');
                                    setDirection('asc');
                                }}
                                loading={loading}
                            >
                                Làm mới
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{ borderRadius: '6px' }}
                                onClick={() => setIsOpenCreateModal(true)}
                            >
                                Thêm mới
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '20px' }}>
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Tìm kiếm theo tên danh mục..."
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
                        showTotal: (total) => `Tổng cộng ${total} danh mục`,
                    }}
                    rowClassName="editable-row"
                    bordered
                    showSorterTooltip={false}
                />
            </Card>

            <CategoryForm
                isOpenCreateModal={isOpenCreateModal}
                setIsOpenCreateModal={setIsOpenCreateModal}
                loadCategories={loadCategories}
            />
            <CategoryEdit
                isOpenEditModal={isOpenEditModal}
                setIsOpenEditModal={setIsOpenEditModal}
                selectedCategory={selectedCategory}
                loadCategories={loadCategories}
            />
        </div>
    );
};

export default Category;