import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, Typography, Select, Upload, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from '../../service/img/api';
import { createUserByAdminAPI } from '../../service/user/api';
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
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Thêm State cho Tỉnh/Thành phố và Xã/Phường
    const [cities, setCities] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState("");

    // Load Vai trò
    useEffect(() => {
        const fetchRoles = async () => {
            setRoles([
                { _id: 'ADMIN', name: 'Quản trị viên' },
                { _id: 'USER', name: 'Khách hàng' },
            ]);
        };
        fetchRoles();
    }, []);

    // 1. Load danh sách Tỉnh/Thành phố khi mở form
    useEffect(() => {
        if (isOpenCreateUserForm) {
            const fetchCities = async () => {
                try {
                    const res = await fetch("http://localhost:8082/api/address/provinces");
                    const data = await res.json();
                    if (data && data.provinces) {
                        setCities(data.provinces);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách thành phố:", error);
                }
            };
            fetchCities();
        } else {
            // Khi đóng form thì reset lại danh sách xã và ID tỉnh đang chọn
            setWards([]);
            setSelectedCityId("");
        }
    }, [isOpenCreateUserForm]);

    // 2. Load danh sách Xã/Phường khi Tỉnh/Thành phố thay đổi
    useEffect(() => {
        const fetchWards = async () => {
            if (!selectedCityId) {
                setWards([]);
                return;
            }
            try {
                const res = await fetch(`http://localhost:8082/api/address/wards?provinceId=${selectedCityId}`);
                const data = await res.json();
                
                if (data && data.communes) {
                    setWards(data.communes);
                } else if (Array.isArray(data)) {
                    setWards(data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách xã/phường:", error);
            }
        };
        fetchWards();
    }, [selectedCityId]);

    // Sự kiện khi người dùng chọn/đổi Tỉnh thành
    const handleCityChange = (value) => {
        setSelectedCityId(value);
        // Reset Xã/Phường trên form vì Tỉnh/Thành phố đã thay đổi
        form.setFieldsValue({ wardId: undefined });
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

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
        </button>
    );

    const onFinish = async (values) => {
        setLoading(true);
        // Cập nhật payload gửi lên BE có thêm cityId và wardId
        const payloadToBackend = {
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            role: values.role,
            phoneNumber: values.phone,
            address: values.address,
            cityId: values.cityId, // THÊM MỚI
            wardId: values.wardId, // THÊM MỚI
            avatar: imageUrl
        };

        try {
            await createUserByAdminAPI(payloadToBackend);
            message.success("Tạo người dùng thành công!");
            await loadUsers();
            
            // Đóng form & reset
            setIsOpenCreateUserForm(false);
            form.resetFields();
            setFileList([]);
            setImageUrl("");
            setSelectedCityId("");
            setWards([]);
        } catch (error) {
            console.log(">>> Lỗi khi tạo user nhận được từ Axios:", error);
            if (error?.errors === 'EMAIL_ALREADY_EXISTS') {
                message.error("Email này đã được sử dụng, vui lòng thử email khác!");
            } else if (error?.message) {
                message.error(error.message);
            } else {
                message.error("Không thể kết nối tới server hoặc có lỗi xảy ra!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Tạo mới người dùng"
            open={isOpenCreateUserForm}
            onCancel={() => {
                setIsOpenCreateUserForm(false);
                form.resetFields();
                setFileList([]);
                setImageUrl("");
                setSelectedCityId("");
                setWards([]);
            }}
            width={750}
            centered
            maskClosable={false}
            footer={[
                <Button key="close" onClick={() => { 
                    setIsOpenCreateUserForm(false); 
                    form.resetFields();
                    setFileList([]);
                    setImageUrl("");
                    setSelectedCityId("");
                    setWards([]);
                }} style={{ borderRadius: '6px' }}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()} style={{ borderRadius: '6px' }}>
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
                                label="Họ và tên"
                                name="fullName"
                                style={{ marginBottom: '12px' }}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>

                            <Row gutter={12}>
                                <Col span={10}>
                                    <Form.Item
                                        label="Vai trò"
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
                                    <Form.Item 
                                        label="Số điện thoại" 
                                        name="phone" 
                                        style={{ marginBottom: '12px' }}
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                    >
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
                                label="Mật khẩu"
                                name="password"
                                style={{ marginBottom: '12px' }}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { min: 8, message: 'Mật khẩu phải từ 8 kí tự trở lên!' }
                                ]}
                            >
                                <Password placeholder="Độ dài mật khẩu nên từ 8 kí tự" />
                            </Form.Item>

                            {/* --- BỔ SUNG: CHỌN TỈNH VÀ XÃ --- */}
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item 
                                        label="Tỉnh / Thành phố" 
                                        name="cityId" 
                                        style={{ marginBottom: '12px' }}
                                        rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
                                    >
                                        <Select 
                                            placeholder="Chọn tỉnh/thành phố"
                                            onChange={handleCityChange}
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {cities.map(city => (
                                                <Option key={city.code} value={city.code}>{city.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item 
                                        label="Xã / Phường" 
                                        name="wardId" 
                                        style={{ marginBottom: '12px' }}
                                        rules={[{ required: true, message: 'Vui lòng chọn xã/phường!' }]}
                                    >
                                        <Select 
                                            placeholder="Chọn xã/phường"
                                            disabled={!selectedCityId}
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {wards.map(ward => (
                                                <Option key={ward.code || ward.id} value={ward.code || ward.id}>{ward.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Địa chỉ cụ thể" name="address" style={{ marginBottom: '0' }}>
                                <TextArea rows={2} placeholder="Nhập địa chỉ cụ thể (số nhà, tên đường...)" />
                            </Form.Item>
                        </div>
                    </Col>

                    {/* CỘT PHẢI: AVATAR */}
                    <Col span={8} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Title level={5} style={{ margin: '0 0 20px 0', fontSize: '16px', alignSelf: 'flex-start' }}>Ảnh đại diện</Title>

                        <Form.Item name="avatar" style={{ display: 'flex', justifyContent: 'center', height: '200px' }}>
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
    );
}

export default UserForm;