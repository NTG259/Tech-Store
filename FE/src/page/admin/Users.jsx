import React, { useEffect, useState } from 'react';
import { Table, Space, message, Button, Card, Typography, Popconfirm, Tooltip, Input, Row, Col, Tag } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    UserAddOutlined,
    ReloadOutlined,
    LockOutlined,
    UnlockOutlined
} from '@ant-design/icons';
// Đã thêm import lockUserByAdmin
import { deleteUserAPI, fetchAllUsersAPI, lockUserByAdminAPI } from '../../service/user/api';
import DetailUserModal from '../../components/user/user.detail';
import UserEdit from '../../components/user/user.edit';
import UserForm from '../../components/user/user.form';

const { Title } = Typography;
const { Search } = Input;

const User = () => {
    const [isOpenDetailUserModal, setIsOpenDetailUserModal] = useState(false);
    const [isOpenEditUserForm, setIsOpenEditUserForm] = useState(false);
    const [isOpenCreateUserForm, setIsOpenCreateUserForm] = useState(false);
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [total, setTotal] = useState(0);

    const [searchText, setSearchText] = useState('');
    const [inputValue, setInputValue] = useState('');

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await fetchAllUsersAPI(current, pageSize, searchText);

            if (res && res.data) {
                const users = res.data;
                const metaData = res.meta;

                const formattedData = users.map(user => ({
                    key: user.id,
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phoneNumber,
                    address: user.address,
                    avatar: user.avatar,
                    role: user.role,
                    isEnabled: user.isEnabled,
                    cityId: user.cityId,
                    wardId: user.wardId
                }));

                setData(formattedData);

                if (metaData && metaData.totalItems !== undefined) {
                    setTotal(metaData.totalItems);
                }
            }
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu người dùng");
        } finally {
            setLoading(false);
        }
    };

    const onSearch = (value) => {
        setSearchText(value);
        setCurrent(1);
    };

    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, pageSize, searchText]);

    const handleDelete = async (id) => {
        try {
            await deleteUserAPI(id);
            message.success("Xóa người dùng thành công");
            await loadUsers();
        } catch (error) {
            message.error("Xóa thất bại. Tài khoản vẫn đang hoạt động, chỉ có thể khóa tài khoản");
        }
    };

    // SỬA: Gọi API lockUserByAdmin
    const handleToggleLock = async (id, currentStatus) => {
        try {
            await lockUserByAdminAPI(id);
            message.success(`Đã ${currentStatus ? 'khóa' : 'mở khóa'} tài khoản thành công`);
            await loadUsers(); // Load lại danh sách để cập nhật UI
        } catch (error) {
            message.error("Thao tác thất bại");
        }
    };

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
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => <span style={{ fontWeight: 500, color: '#1890ff' }}>{text}</span>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Trạng thái',
            // SỬA: Đổi dataIndex thành isEnabled
            dataIndex: 'isEnabled',
            key: 'isEnabled',
            align: 'center',
            width: 120,
            render: (isEnabled) => {
                return isEnabled ? (
                    <Tag color="success">Hoạt động</Tag>
                ) : (
                    <Tag color="error">Đã khóa</Tag>
                );
            }
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            render: (role) => {
                let color = role === 'ADMIN' ? 'volcano' : 'green';
                let displayRole = role ? role.toUpperCase() : '';

                return (
                    <Tag color={color} key={role}>
                        {displayRole}
                    </Tag>
                );
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 220,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setSelectedUserData(record);
                                setIsOpenDetailUserModal(true);
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
                                setSelectedUserData(record);
                                setIsOpenEditUserForm(true);
                            }}
                        />
                    </Tooltip>

                    {/* SỬA: Sử dụng isEnabled cho logic hiển thị và thông báo */}
                    <Popconfirm
                        title={record.isEnabled ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        description={`Bạn có chắc muốn ${record.isEnabled ? "khóa" : "mở khóa"} ${record.fullName}?`}
                        onConfirm={() => handleToggleLock(record.id, record.isEnabled)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Tooltip title={record.isEnabled ? "Khóa tài khoản" : "Mở khóa"}>
                            <Button
                                type="default"
                                shape="circle"
                                danger={record.isEnabled}
                                icon={record.isEnabled ? <LockOutlined /> : <UnlockOutlined style={{ color: '#52c41a' }} />}
                            />
                        </Tooltip>
                    </Popconfirm>

                    <Popconfirm
                        title="Xóa người dùng"
                        description={`Bạn có chắc muốn xóa ${record.fullName}?`}
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

    // ... (Phần return JSX phía dưới giữ nguyên như cũ)
    return (
        <div style={{ padding: '0px', background: '#fff', minHeight: '100vh - 120px' }}>
            <Card bordered={false} style={{ borderRadius: '8px' }}>
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '20px' }}>
                    <Col xs={24} sm={12}>
                        <Title level={3} style={{ margin: 0 }}>Danh sách người dùng</Title>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => {
                                    setCurrent(1);
                                    setSearchText('');
                                    setInputValue('');
                                    loadUsers();
                                }}
                                loading={loading}
                            >
                                Làm mới
                            </Button>
                            <Button
                                type="primary"
                                icon={<UserAddOutlined />}
                                style={{ borderRadius: '6px' }}
                                onClick={() => setIsOpenCreateUserForm(true)}
                            >
                                Thêm mới
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '20px' }}>
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Tìm kiếm theo tên người dùng..."
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
                        showTotal: (total) => `Tổng cộng ${total} người dùng`,
                    }}
                    rowClassName="editable-row"
                    bordered
                />
            </Card>

            <DetailUserModal
                isOpenDetailUserModal={isOpenDetailUserModal}
                setIsOpenDetailUserModal={setIsOpenDetailUserModal}
                selectedUserData={selectedUserData}
            />
            <UserEdit
                isOpenEditUserForm={isOpenEditUserForm}
                setIsOpenEditUserForm={setIsOpenEditUserForm}
                selectedUserData={selectedUserData}
                setSelectedUserData={setSelectedUserData}
                loadUsers={loadUsers}
            />
            <UserForm
                isOpenCreateUserForm={isOpenCreateUserForm}
                setIsOpenCreateUserForm={setIsOpenCreateUserForm}
                loadUsers={loadUsers}
            />
        </div>
    );
};

export default User;