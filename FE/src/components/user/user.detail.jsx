import React, { useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, Typography } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

const DetailUserModal = (props) => {
    const { isOpenDetailUserModal, setIsOpenDetailUserModal, selectedUserData } = props;
    const [form] = Form.useForm();
    
    const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";

    useEffect(() => {
        console.log("Dữ liệu selectedUserData nhận được:", selectedUserData);

        if (isOpenDetailUserModal && selectedUserData) {
            form.setFieldsValue({
                fullName: selectedUserData?.fullName || '',
                email: selectedUserData?.email || '',
                phone: selectedUserData?.phone || selectedUserData?.phoneNumber || '', 
                role: selectedUserData?.role || '',
                address: selectedUserData?.address || '',
                city: selectedUserData?.cityId ? 'Đang tải...' : 'Không có',
                ward: selectedUserData?.wardId ? 'Đang tải...' : 'Không có',
            });

            const fetchLocationNames = async () => {
                let cName = '';
                let wName = '';

                try {
                    if (!selectedUserData?.cityId) {
                        form.setFieldsValue({ city: 'Không có', ward: 'Không có' });
                        return; 
                    }

                    const cityIdStr = selectedUserData.cityId.toString();

                    const resCity = await fetch("http://localhost:8082/api/address/provinces");
                    const dataCity = await resCity.json();
                    const cityList = dataCity?.provinces || [];
                    
                    const city = cityList.find(p => p.code === cityIdStr);
                    if (city) cName = city.name;

                    if (selectedUserData?.wardId) {
                        const wardIdStr = selectedUserData.wardId.toString();
                        const resWard = await fetch(`http://localhost:8082/api/address/wards?provinceId=${cityIdStr}`);
                        const dataWard = await resWard.json();
                        const wardList = dataWard?.communes || (Array.isArray(dataWard) ? dataWard : []);
                        
                        const ward = wardList.find(w => (w.code || w.id)?.toString() === wardIdStr);
                        if (ward) wName = ward.name;
                    }

                } catch (error) {
                    console.error("Lỗi khi load tên thành phố/xã:", error);
                    cName = "Lỗi kết nối";
                    wName = "Lỗi kết nối";
                } finally {
                    form.setFieldsValue({
                        city: cName || 'Không xác định',
                        ward: wName || 'Không xác định'
                    });
                }
            };

            fetchLocationNames();

        } else {
            form.resetFields();
        }
    }, [isOpenDetailUserModal, selectedUserData, form]);

    const handleCancel = () => setIsOpenDetailUserModal(false);

    return (
        <Modal
            title="Chi tiết người dùng"
            open={isOpenDetailUserModal}
            onCancel={handleCancel}
            width={750} 
            centered
            maskClosable={true}
            footer={[
                <Button key="close" type="primary" onClick={handleCancel} style={{ borderRadius: '6px' }}>
                    Đóng
                </Button>
            ]}
            styles={{ body: { padding: '16px 24px' } }}
        >
            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    
                    <Col span={16}>
                        <div style={{ paddingRight: '10px' }}>
                            <Title level={5} style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Thông tin cá nhân</Title>

                            <Form.Item label="Họ và tên" name="fullName" style={{ marginBottom: '12px' }}>
                                <Input readOnly style={{ backgroundColor: '#fafafa', cursor: 'default' }} />
                            </Form.Item>

                            <Row gutter={12}>
                                <Col span={10}>
                                    <Form.Item label="Vai trò" name="role" style={{ marginBottom: '12px' }}>
                                        <Input readOnly style={{ backgroundColor: '#fafafa', cursor: 'default' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={14}>
                                    <Form.Item label="Số điện thoại" name="phone" style={{ marginBottom: '12px' }}>
                                        <Input readOnly style={{ backgroundColor: '#fafafa', cursor: 'default' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Email" name="email" style={{ marginBottom: '12px' }}>
                                <Input readOnly style={{ backgroundColor: '#fafafa', cursor: 'default', fontWeight: 500, color: '#1890ff' }} />
                            </Form.Item>

                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="Tỉnh / Thành phố" name="city" style={{ marginBottom: '12px' }}>
                                        <Input readOnly style={{ backgroundColor: '#fafafa', cursor: 'default' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Xã / Phường" name="ward" style={{ marginBottom: '12px' }}>
                                        <Input readOnly style={{ backgroundColor: '#fafafa', cursor: 'default' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Địa chỉ cụ thể" name="address" style={{ marginBottom: '0' }}>
                                <TextArea rows={2} readOnly style={{ backgroundColor: '#fafafa', cursor: 'default' }} />
                            </Form.Item>
                        </div>
                    </Col>

                    
                    <Col span={8} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Title level={5} style={{ margin: '0 0 20px 0', fontSize: '16px', alignSelf: 'flex-start' }}>Ảnh đại diện</Title>

                        <div style={{
                            width: '140px', height: '140px', borderRadius: '50%',
                            border: '4px solid #f5f5f5', boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                            overflow: 'hidden', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', marginBottom: '15px'
                        }}>
                            <img
                                src={selectedUserData?.avatar || defaultAvatar}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default DetailUserModal;