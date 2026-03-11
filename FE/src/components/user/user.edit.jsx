import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, Typography, Select, Upload, message, Image, Switch } from 'antd'; // 1. IMPORT THÊM Switch
import { PlusOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from '../../service/img/api';
import { updateUserByAdminAPI } from '../../service/user/api';

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

const UserFormEdit = (props) => {
    const { isOpenEditUserForm, setIsOpenEditUserForm, loadUsers, selectedUserData, setSelectedUserData } = props;
    const [form] = Form.useForm();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            setRoles([
                { _id: 'ADMIN', name: 'Quản lý' },
                { _id: 'USER', name: 'Khách hàng' },
            ]);
        };
        fetchRoles();
    }, []);


    useEffect(() => {
        if (selectedUserData && isOpenEditUserForm) {
            form.setFieldsValue({
                id: selectedUserData.id,
                fullName: selectedUserData.fullName,
                email: selectedUserData.email,
                role: selectedUserData.role,
                phone: selectedUserData.phone,
                address: selectedUserData.address,
                isEnabled: selectedUserData.isEnabled, // 2. MAP DỮ LIỆU isEnabled VÀO FORM
            });
            if (selectedUserData.avatar) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'avatar.png',
                        status: 'done',
                        url: selectedUserData.avatar,
                    }
                ]);
                setImageUrl(selectedUserData.avatar);
            } else {
                setFileList([]);
                setImageUrl("");
            }
        }
    }, [selectedUserData, isOpenEditUserForm]);

    const handleCancel = () => {
        setIsOpenEditUserForm(false);
        setSelectedUserData(null);
        form.resetFields();
        setFileList([]);
        setImageUrl("");
    };

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
                options.onSuccess(data, file);
            },
            onError: (err) => {
                options.onError(err);
            }
        });
    };

    const onFinish = async (values) => {
        const payloadToBackend = {
            fullName: values.fullName,
            role: values.role,
            phoneNumber: values.phone,
            address: values.address,
            isEnabled: values.isEnabled, // 3. THÊM isEnabled VÀO PAYLOAD GỬI LÊN BACKEND
            avatar: previewImage || imageUrl
        };

        const userId = selectedUserData?.id || values.id;
        if (!userId) {
            message.error('User id is missing.');
            return;
        }

        const res = await updateUserByAdminAPI(userId, payloadToBackend);

        if (res.status < 400) {
            message.success("Cập nhật người dùng thành công!");
            await loadUsers();
            handleCancel();
        } else {
            message.error(res.data?.message || "Cập nhật thất bại");
        }
    };

    return (
        <Modal
            title="Chỉnh sửa người dùng"
            open={isOpenEditUserForm}
            onCancel={handleCancel}
            width={750}
            centered
            maskClosable={false}
            footer={[
                <Button key="close" onClick={handleCancel}>Hủy</Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>Lưu thay đổi</Button>
            ]}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={16}>
                        <Title level={5}>Thông tin người dùng</Title>

                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Row gutter={12}>
                            <Col span={10}>
                                <Form.Item
                                    label="Role"
                                    name="role"
                                    style={{ marginBottom: '12px' }}
                                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                                >
                                    <Select placeholder="Chọn vai trò">
                                        {roles.map(r => (
                                            <Option key={r._id} value={r._id}>{r.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={14}>
                                <Form.Item label="Phone" name="phone">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Email" name="email">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item label="Password" name="password" help="Mật khẩu không được phép thay đổi tại đây">
                            <Input.Password placeholder="********" disabled />
                        </Form.Item>

                        <Form.Item label="Address" name="address">
                            <TextArea rows={2} />
                        </Form.Item>

                        {/* 4. THÊM TRƯỜNG TRẠNG THÁI HOẠT ĐỘNG (isEnabled) */}
                        <Form.Item 
                            label="Trạng thái tài khoản" 
                            name="isEnabled" 
                            valuePropName="checked" // Bắt buộc phải có thuộc tính này đối với Switch/Checkbox
                        >
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Đã khóa" />
                        </Form.Item>

                    </Col>

                    <Col span={8} style={{ borderLeft: '1px solid #f0f0f0', textAlign: 'center' }}>
                        <Title level={5} style={{ textAlign: 'left' }}>Avatar</Title>
                        <Form.Item name="avatar">
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
                                        <div style={{ marginTop: 8 }}>Upload</div>
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
                        afterOpenChange: (visible) => !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                />
            )}
        </Modal>
    );
}

export default UserFormEdit;