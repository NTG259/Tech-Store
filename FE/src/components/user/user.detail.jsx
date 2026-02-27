import React, { useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

const DetailUserModal = (props) => {
    const { isOpenDetailUserModal, setIsOpenDetailUserModal } = props;
    const [form] = Form.useForm();
    const {selectedUserData} = props
    console.log(selectedUserData);
    const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";
    useEffect(() => {
        if (isOpenDetailUserModal && selectedUserData) {
            form.setFieldsValue({
                fullName: selectedUserData?.fullName || '',
                email: selectedUserData?.email || '',
                phone: selectedUserData?.phone || '',
                role: selectedUserData?.role || '',
                address: selectedUserData?.address || '',
                avatar: selectedUserData?.avatar || '',
            });
        } else {
            form.resetFields();
        }
    }, [isOpenDetailUserModal, selectedUserData, form]);

    const handleCancel = () => setIsOpenDetailUserModal(false);

    return (
        <Modal
            title="User Details"
            open={isOpenDetailUserModal}
            onCancel={handleCancel}
            width={750} // Kích thước gọn gàng cho form User
            centered
            maskClosable={true}
            footer={[
                <Button key="close" type="primary" onClick={handleCancel} style={{ borderRadius: '6px' }}>
                    Close
                </Button>
            ]}
            styles={{ body: { padding: '16px 24px' } }}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Row gutter={24}>
                    {/* CỘT TRÁI: THÔNG TIN NGƯỜI DÙNG */}
                    <Col span={16}>
                        <div style={{ paddingRight: '10px' }}>
                            <Title level={5} style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Personal Information</Title>

                            <Form.Item label="Full Name" name="fullName" style={{ marginBottom: '12px' }}>
                                <Input readOnly style={{ backgroundColor: '#fafafa', cursor: 'default' }} />
                            </Form.Item>

                            <Row gutter={12}>
                                <Col span={10}>
                                    <Form.Item label="Role" name="role" style={{ marginBottom: '12px' }}>
                                        <Input readOnly style={{ backgroundColor: '#fafafa', cursor: 'default' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={14}>
                                    <Form.Item label="Phone" name="phone" style={{ marginBottom: '12px' }}>
                                        <Input readOnly style={{ backgroundColor: '#fafafa', cursor: 'default' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Email" name="email" style={{ marginBottom: '12px' }}>
                                {/* Dùng Input thay cho Select vì đây là chế độ xem */}
                                <Input readOnly style={{ backgroundColor: '#fafafa', cursor: 'default', fontWeight: 500, color: '#1890ff' }} />
                            </Form.Item>

                            <Form.Item label="Address" name="address" style={{ marginBottom: '0' }}>
                                <TextArea rows={2} readOnly style={{ backgroundColor: '#fafafa', cursor: 'default' }} />
                            </Form.Item>
                        </div>
                    </Col>

                    {/* CỘT PHẢI: AVATAR */}
                    <Col span={8} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Title level={5} style={{ margin: '0 0 20px 0', fontSize: '16px', alignSelf: 'flex-start' }}>Avatar</Title>

                        {/* Khung Avatar tròn */}
                        <div style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            border: '4px solid #f5f5f5',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '15px'
                        }}>
                            <img
                                src= {selectedUserData?.avatar || defaultAvatar}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            Status: <span style={{ color: '#52c41a', fontWeight: 500 }}>● Active</span>
                        </Text>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default DetailUserModal;