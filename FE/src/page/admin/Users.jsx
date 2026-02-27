import React, { useEffect, useState } from 'react';
import { Table, Space, message, Button, Card, Typography, Popconfirm, Tooltip, Input, Row, Col } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    UserAddOutlined,
    SearchOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { deleteUserAPI, fetchAllUsersAPI } from '../../service/user/api';
import DetailUserModal from '../../components/user/user.detail';
import UserEdit from '../../components/user/user.edit';
import UserForm from '../../components/user/user.form';

const { Title } = Typography;

const User = () => {
    const [isOpenDetailUserModal, setIsOpenDetailUserModal] = useState(false);
    const [isOpenEditUserForm, setIsOpenEditUserForm] = useState(false);
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpenCreateUserForm, setIsOpenCreateUserForm] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await fetchAllUsersAPI();
            if (res && res.data) {
                const formattedData = res.data.map(user => ({
                    key: user.id, // Luôn luôn có key cho table
                    id: user.id,
                    fullName: user.name,
                    email: user.email,
                    phone: user.phoneNumber,
                    address: user.address,
                    avatar : user.avatar
                }));
                setData(formattedData);
            }
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUserAPI(id);
            message.success("Xóa người dùng thành công");
            await loadUsers();
        } catch (error) {
            message.error("Xóa thất bại");
        }
    };

    useEffect(() => {
        loadUsers();
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
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true, // Tự động rút gọn nếu quá dài
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 180,
            render: (_, record) => (
                <Space size="small">
                    {/* Khi nào hover vào sẽ hiển thị thông tin */}
                    <Tooltip title="Xem chi tiết">
                        <Button
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                console.log(record);
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
                        {console.log(">>> check record", record)}
                    </Tooltip>

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

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {/* Header của bảng */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '20px' }}>
                    <Col xs={24} sm={12}>
                        <Title level={3} style={{ margin: 0 }}>Danh sách người dùng</Title>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={loadUsers}
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

                {/* Thanh tìm kiếm nhanh */}
                <div style={{ marginBottom: '16px' }}>
                    <Input
                        placeholder="Tìm kiếm theo tên hoặc email..."
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
                        showTotal: (total) => `Tổng cộng ${total} người dùng`,
                    }}
                    rowClassName="editable-row"
                    bordered
                />
            </Card>

            {/* Modals */}
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