import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Row, Col, Typography, Select, Upload, message, Image, Switch } from 'antd';
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
    const [loading, setLoading] = useState(false);

    // --- State cho Tỉnh/Thành phố và Xã/Phường ---
    const [cities, setCities] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState("");

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
        if (isOpenEditUserForm) {
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
            setWards([]);
            setSelectedCityId("");
        }
    }, [isOpenEditUserForm]);

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

    // 3. Đổ dữ liệu cũ vào form khi mở Modal Edit
    useEffect(() => {
        if (selectedUserData && isOpenEditUserForm) {
            // Chuyển ID thành chuỗi (String) để Select của Antd nhận đúng format
            const initialCityId = selectedUserData.cityId ? selectedUserData.cityId.toString() : undefined;
            const initialWardId = selectedUserData.wardId ? selectedUserData.wardId.toString() : undefined;

            form.setFieldsValue({
                id: selectedUserData.id,
                fullName: selectedUserData.fullName,
                email: selectedUserData.email,
                role: selectedUserData.role,
                phone: selectedUserData.phone || selectedUserData.phoneNumber, // Cover cả 2 trường hợp key
                address: selectedUserData.address,
                isEnabled: selectedUserData.isEnabled,
                cityId: initialCityId,
                wardId: initialWardId,
            });

            // Set state selectedCityId để kích hoạt useEffect load danh sách Xã/Phường
            if (initialCityId) {
                setSelectedCityId(initialCityId);
            }

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
    }, [selectedUserData, isOpenEditUserForm, form]);

    const handleCancel = () => {
        setIsOpenEditUserForm(false);
        setSelectedUserData(null);
        form.resetFields();
        setFileList([]);
        setImageUrl("");
        setSelectedCityId("");
        setWards([]);
    };

    // Sự kiện khi người dùng chủ động chọn đổi Tỉnh thành khác
    const handleCityChange = (value) => {
        setSelectedCityId(value);
        form.setFieldsValue({ wardId: undefined }); // Xóa Xã/Phường cũ
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
        setLoading(true);
        const payloadToBackend = {
            fullName: values.fullName,
            role: values.role,
            phoneNumber: values.phone,
            address: values.address,
            isEnabled: values.isEnabled,
            cityId: values.cityId, // ĐẨY LÊN BACKEND
            wardId: values.wardId, // ĐẨY LÊN BACKEND
            avatar: previewImage || imageUrl || selectedUserData?.avatar // Giữ ảnh cũ nếu ko up mới
        };

        const userId = selectedUserData?.id || values.id;
        if (!userId) {
            message.error('Không tìm thấy ID người dùng.');
            setLoading(false);
            return;
        }

        try {
            const res = await updateUserByAdminAPI(userId, payloadToBackend);

            if (res.status < 400 || res?.data?.status === 200) {
                message.success("Cập nhật người dùng thành công!");
                await loadUsers();
                handleCancel();
            } else {
                message.error(res.data?.message || "Cập nhật thất bại");
            }
        } catch (error) {
            message.error(error?.response?.data?.message || "Lỗi khi cập nhật người dùng");
        } finally {
            setLoading(false);
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
                <Button key="close" onClick={handleCancel} style={{ borderRadius: '6px' }}>Hủy</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()} style={{ borderRadius: '6px' }}>Lưu thay đổi</Button>
            ]}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={16}>
                        <Title level={5}>Thông tin người dùng</Title>

                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
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

                        <Form.Item label="Email" name="email" style={{ marginBottom: '12px' }}>
                            <Input disabled />
                        </Form.Item>

                        <Form.Item 
                            label="Mật khẩu" 
                            name="password" 
                            help="Mật khẩu không được phép thay đổi tại đây"
                            style={{ marginBottom: '12px' }}
                        >
                            <Input.Password placeholder="********" disabled />
                        </Form.Item>

                        {/* --- CHỌN TỈNH VÀ XÃ --- */}
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

                        <Form.Item label="Địa chỉ cụ thể" name="address" style={{ marginBottom: '12px' }}>
                            <TextArea rows={2} placeholder="Nhập địa chỉ cụ thể (số nhà, tên đường...)" />
                        </Form.Item>

                        <Form.Item 
                            label="Trạng thái tài khoản" 
                            name="isEnabled" 
                            valuePropName="checked" 
                            style={{ marginBottom: '0' }}
                        >
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Đã khóa" />
                        </Form.Item>

                    </Col>

                    <Col span={8} style={{ borderLeft: '1px solid #f0f0f0', textAlign: 'center' }}>
                        <Title level={5} style={{ textAlign: 'left', marginLeft: '20px' }}>Ảnh đại diện</Title>
                        <Form.Item name="avatar" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
                                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
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