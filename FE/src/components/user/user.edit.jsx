import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, Typography, Select, Upload, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from '../../service/img/api';
import { updateUserAPI } from '../../service/user/api';

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
    // Thêm selectedUserData để nhận dữ liệu người dùng cần sửa
    const { isOpenEditUserForm, setIsOpenEditUserForm, loadUsers, selectedUserData, setSelectedUserData } = props;
    const [form] = Form.useForm();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [imageUrl, setImageUrl] = useState("");

    console.log(">>> check data ", selectedUserData);
    useEffect(() => {
        if (selectedUserData && isOpenEditUserForm) {
            form.setFieldsValue({
                id: selectedUserData.id,
                fullName: selectedUserData.fullName,
                email: selectedUserData.email,
                role: selectedUserData.role,
                phone: selectedUserData.phone,
                address: selectedUserData.address,
            });
            if (selectedUserData.avatar) {
                setFileList([
                    {
                        uid: '-1', // ID bắt buộc phải có, đặt âm để không trùng với file upload mới
                        name: 'avatar.png',
                        status: 'done', // Trạng thái 'done' báo cho Upload biết ảnh đã tải xong
                        url: selectedUserData.avatar,
                    }
                ]);
                setImageUrl(selectedUserData.avatar);
            } else {
                // Nếu user chưa có avatar thì dọn sạch vùng hiển thị
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
        console.log(values)
        const payloadToBackend = {
            fullName: values.fullName,
            role: values.role,
            phoneNumber: values.phone,
            address: values.address,
            avatar: previewImage || imageUrl
        };

        const userId = selectedUserData?.id || values.id;
        if (!userId) {
            message.error('User id is missing.');
            return;
        }

        const res = await updateUserAPI(userId, payloadToBackend);

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
                                <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="ADMIN">Admin</Option>
                                        <Option value="USER">User</Option>
                                        <Option value="MANAGER">Manager</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={14}>
                                <Form.Item label="Phone" name="phone">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Disabled Email */}
                        <Form.Item label="Email" name="email">
                            <Input disabled />
                        </Form.Item>

                        {/* Không hiển thị hoặc Disabled Password - Thường Edit sẽ không sửa pass ở đây */}
                        <Form.Item label="Password" name="password" help="Mật khẩu không được phép thay đổi tại đây">
                            <Input.Password placeholder="********" disabled />
                        </Form.Item>

                        <Form.Item label="Address" name="address">
                            <TextArea rows={2} />
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