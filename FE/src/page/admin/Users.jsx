import React, { useEffect, useState } from 'react';
import { Table, Space, message, Button } from 'antd';
import { deleteUserAPI, fetchAllUsersAPI } from '../../service/api';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const User = () => {
    const [data, setData] = useState([]);

    const loadUsers = async () => {
        try {
            const res = await fetchAllUsersAPI();
            const formattedData = res.data.map(user => ({
                id: user.id,
                name: user.name,
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
        console.log(res);
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
            dataIndex: 'name',
            key: 'name',
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
                console.log(record);
                return (
                    <Space>
                        <Button type="primary" danger onClick={() => deleteUser(record.id)}>
                            <DeleteOutlined />
                        </Button>
                        <Button type="primary"><EyeOutlined/></Button>
                    </Space>
                )
            },
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
        />
    );
};

export default User;