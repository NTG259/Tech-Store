import React, { useEffect, useState } from 'react';
import { Table, Space, message, Button } from 'antd';
import { deleteUserAPI, fetchAllUsersAPI } from '../../service/api';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import DetailUserModal from '../../components/user/user.detail';
import UserEdit from '../../components/user/user.edit';

const User = () => {
    // Mở modal chi tiết user
    const [isOpenDetailUserModal, setIsOpenDetailUserModal] = useState(false);
    const [selectedUserData, setSelectedUserData] = useState(null);

    // Mở modal edit user
    const [isOpenEditUserModal, setIsOpenEditUserModal] = useState(false);

    // Hiển thị danh sách users
    const [data, setData] = useState([]);

    const loadUsers = async () => {
        try {
            const res = await fetchAllUsersAPI();
            const formattedData = res.data.map(user => ({
                id: user.id,
                fullName: user.name,
                email: user.email,
                phone: user.phoneNumber,
                address: user.address
            }));

            setData(formattedData);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu");
        }
    };

    const deleteUser = async (id) => {
        const res = await deleteUserAPI(id);
        loadUsers();
    }

    useEffect(() => {
        loadUsers();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone number',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space>
                        <Button type="primary" danger onClick={() => deleteUser(record.id)}>
                            <DeleteOutlined />
                        </Button>
                        <Button type="primary"
                            onClick={
                                () => {
                                    setIsOpenDetailUserModal(true);
                                    setSelectedUserData(record);
                                }
                            }
                        ><EyeOutlined /></Button>
                        <Button type="primary"
                            onClick={
                                () => {
                                    setIsOpenEditUserModal(true);
                                    setSelectedUserData(record);
                                }
                            }
                        ><EditOutlined /></Button>
                    </Space>
                )
            },
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
            />
            <DetailUserModal
                isOpenDetailUserModal={isOpenDetailUserModal}
                setIsOpenDetailUserModal={setIsOpenDetailUserModal}
                selectedUserData={selectedUserData}
            />
            <UserEdit 
                isOpenEditUserModal = {isOpenEditUserModal}
                setIsOpenEditUserModal = {setIsOpenEditUserModal}
                selectedUserData = {selectedUserData}
            ></UserEdit>
        </>
    );
};

export default User;