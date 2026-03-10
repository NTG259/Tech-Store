import React, { useEffect, useState } from 'react';
import { Table, Space, message, Button, Card, Typography, Popconfirm, Tooltip, Input, Row, Col } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined
} from '@ant-design/icons';

import { fetchAllCategoriesByAdminAPI, deleteCategoryAPI } from '../../service/category/api';
import CategoryForm from '../../components/category/category.form';
import CategoryEdit from '../../components/category/category.edit';

const { Title } = Typography;
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

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await fetchAllCategoriesByAdminAPI(current, pageSize, searchText);

            if (res && res.data) {
                const categories = res.data;
                const metaData = res.meta;

                const formattedData = categories.map(item => ({
                    ...item,
                    key: item.id 
                }));

                setData(formattedData);
                
                if (metaData && metaData.totalItems !== undefined) {
                    setTotal(metaData.totalItems);
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

    const handleDelete = async (id) => {
        try {
            const res = await deleteCategoryAPI(id);
            if (res) {
                message.success(`Đã xóa danh mục thành công!`);
                await loadCategories(); 
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi xóa");
        }
    };

    useEffect(() => {
        loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, pageSize, searchText]);

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
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 500, color: '#1890ff' }}>{text}</span>
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true, 
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