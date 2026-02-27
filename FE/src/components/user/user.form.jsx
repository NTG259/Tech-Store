import React, { useState } from 'react';
import { Button, Modal, Form, Input, Row, Col, Typography, Select, Upload, message, Image } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from '../../service/img/api';
import { createUserAPI } from '../../service/user/api';
import Password from 'antd/es/input/Password';


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


const UserForm = (props) => {
    const { isOpenCreateUserForm, setIsOpenCreateUserForm, loadUsers } = props;
    const [form] = Form.useForm();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [imageUrl, setImageUrl] = useState("");

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

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const onFinish = async (values) => {
        const payloadToBackend = {
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            role: values.role,
            phoneNumber: values.phone,
            address: values.address,
            avatar: imageUrl
        };
        const res = await createUserAPI(payloadToBackend);
        console.log(">>> res", res);
        if (res.status < 400) {
            message.success("Tạo người dùng thành công!");
            await loadUsers();
            setIsOpenCreateUserForm(false);
            form.resetFields();
            setFileList([]);
            setImageUrl("");
        } else {
            if (error.response) {
                message.error("Backend báo lỗi: " + (error.response.data.message || error.response.status));
            } else {
                message.error("Không thể kết nối tới server");
            }
        }

    };

    return (
        <Modal
            title="Tạo mới người dùng"
            open={isOpenCreateUserForm}
            onCancel={() => {
                setIsOpenCreateUserForm(false)
                form.resetFields()
            }
            }
            width={750}
            centered
            maskClosable={false} // tránh click nhầm ra ngoài làm mất dữ liệu
            footer={[
                <Button key="close" onClick={() => {setIsOpenCreateUserForm(false); form.resetFields()}} style={{ borderRadius: '6px' }}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()} style={{ borderRadius: '6px' }}>
                    Tạo mới
                </Button>
            ]}
            styles={{ body: { padding: '16px 24px' } }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    {/* CỘT TRÁI: THÔNG TIN NGƯỜI DÙNG */}
                    <Col span={16}>
                        <div style={{ paddingRight: '10px' }}>
                            <Title level={5} style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Thông tin người dùng</Title>

                            <Form.Item
                                label="Full Name"
                                name="fullName"
                                style={{ marginBottom: '12px' }}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input placeholder="Nhập họ và tên" />
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
                                            <Option value="ADMIN">Admin</Option>
                                            <Option value="USER">User</Option>
                                            <Option value="MANAGER">Manager</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={14}>
                                    <Form.Item label="Phone" name="phone" style={{ marginBottom: '12px' }}>
                                        <Input placeholder="Nhập số điện thoại" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Email"
                                name="email"
                                style={{ marginBottom: '12px' }}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Nhập địa chỉ email" />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                style={{ marginBottom: '12px' }}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập password!' },
                                ]}
                            >
                                <Password placeholder="Độ dài password nên từ 8 kí tự" />
                            </Form.Item>

                            <Form.Item label="Address" name="address" style={{ marginBottom: '0' }}>
                                <TextArea rows={2} placeholder="Nhập địa chỉ cụ thể" />
                            </Form.Item>
                        </div>
                    </Col>

                    {/* CỘT PHẢI: AVATAR */}
                    <Col span={8} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Title level={5} style={{ margin: '0 0 20px 0', fontSize: '16px', alignSelf: 'flex-start' }}>Avatar</Title>

                        <Form.Item name="avatar" style={{ display: 'flex', justifyContent: 'center', height: '500px' }}>
                            <Upload
                                customRequest={handleCustomUpload}
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                maxCount={1}
                            >
                                {fileList.length > 0 ? null : uploadButton}
                            </Upload>

                        </Form.Item>
                        {previewImage && (
                            <Image
                                styles={{ root: { display: "none" } }}
                                preview={{
                                    open: previewOpen,
                                    onOpenChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(""),
                                }}
                                src={previewImage}
                            />
                        )}
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default UserForm;