import React, { useEffect, useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { Upload, message, Image } from 'antd';
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from "../../service/img/api";
import { fetchProfileAPI, updateProfileAPI, lockedAccountAPI } from "../../service/user/api";

// Hàm chuyển đổi file sang base64 để preview
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

// 1. Thêm prop "required" vào FormField
function FormField({ label, value, onChange, disabled, placeholder, required }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-base text-black">
                {label} {required && <span className="text-[#db4444] ml-1">*</span>}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`h-[50px] w-[330px] rounded px-4 text-base text-black placeholder-black placeholder-opacity-50 outline-none focus:ring-2 focus:ring-[#db4444] ${disabled ? "bg-[#c2c2c2] cursor-not-allowed" : "bg-[#f5f5f5]"}`}
            />
        </div>
    );
}

function UploadIcon() {
    return (
        <svg width="64" height="50" viewBox="0 0 78.5 60.5" fill="none">
            <path
                d="M10 40L30 20L45 35L55 25L70 40"
                stroke="#1E1E1E"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3.5"
            />
            <circle cx="25" cy="15" r="3" stroke="#1E1E1E" strokeWidth="3.5" />
        </svg>
    );
}

const Profile = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        avatar: "https://via.placeholder.com/298x166" // Ảnh mặc định
    });
    const [loading, setLoading] = useState(false);

    // Các state phục vụ việc upload và preview
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);

    const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    // Load profile từ API khi mở trang
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const res = await fetchProfileAPI();
                const user = res?.data || res;

                if (!user) return;

                setForm((prev) => ({
                    ...prev,
                    fullName: user.fullName || "",
                    phoneNumber: user.phoneNumber || "",
                    email: user.email || "",
                    address: user.address || "",
                    avatar: user.avatar || prev.avatar,
                }));
            } catch (error) {
                message.error("Không thể tải thông tin hồ sơ");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // Logic xử lý Preview
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    // Logic xử lý thay đổi file
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    // Logic Upload lên Cloudinary
    const handleCustomUpload = async (options) => {
        try {
            await uploadToCloudinary({
                ...options,
                onSuccess: (data, file) => {
                    setForm(prev => ({ ...prev, avatar: data.secure_url }));
                    message.success("Tải ảnh lên thành công!");
                    options.onSuccess(data, file);
                },
                onError: (err) => {
                    message.error("Lỗi khi tải ảnh lên!");
                    options.onError(err);
                }
            });
        } catch (error) {
            message.error("Đã xảy ra lỗi hệ thống!");
        }
    };

    const handleSaveChanges = async () => {
        // 2. Thêm logic Validate kiểm tra không null / khoảng trắng
        if (!form.fullName || !form.fullName.trim()) {
            return message.error("Vui lòng nhập họ và tên!");
        }
        if (!form.phoneNumber || !form.phoneNumber.trim()) {
            return message.error("Vui lòng nhập số điện thoại!");
        }

        try {
            const payload = {
                fullName: form.fullName,
                phoneNumber: form.phoneNumber,
                address: form.address,
                avatar: form.avatar,
            };
            const res = await updateProfileAPI(payload);
            const updated = res?.data || res;

            if (updated) {
                setForm((prev) => ({
                    ...prev,
                    fullName: updated.fullName || prev.fullName,
                    phoneNumber: updated.phoneNumber || prev.phoneNumber,
                    address: updated.address || prev.address,
                    avatar: updated.avatar || prev.avatar,
                }));
            }

            message.success("Đã lưu thay đổi thành công!");
        } catch (error) {
            message.error(
                error?.response?.data?.message ||
                error?.message ||
                "Cập nhật hồ sơ thất bại"
            );
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };


    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />

            <main className="max-w-[1170px] mx-auto px-4 py-10">
                <div className="bg-white rounded shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] max-w-[870px] mx-auto px-10 py-10">
                    <h2 className="text-xl text-[#db4444] mb-8">Edit Your Profile</h2>

                    <div className="flex gap-12 mb-8">
                        {/* 3. Truyền prop required và sửa lỗi cú pháp */}
                        <FormField
                            label="Full Name"
                            value={form.fullName}
                            onChange={setField("fullName")}
                            required
                        />
                        <FormField
                            label="Phone number"
                            value={form.phoneNumber}
                            onChange={setField("phoneNumber")}
                            required
                        />
                    </div>

                    <div className="flex gap-12 mb-8">
                        <FormField
                            label="Email"
                            value={form.email}
                            disabled
                        />
                        <FormField
                            label="Address"
                            value={form.address}
                            onChange={setField("address")}
                            
                        />
                    </div>

                    <div className="mb-8">
                        <p className="text-base text-black mb-3">Avatar</p>
                        <div className="flex items-start gap-10">
                            {/* Hiển thị Avatar hiện tại */}
                            <div className="w-[298px] h-[166px] overflow-hidden rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
                                <img
                                    src={form.avatar}
                                    alt="Avatar"
                                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => {
                                        setPreviewImage(form.avatar);
                                        setPreviewOpen(true);
                                    }}
                                />
                            </div>

                            {/* Nút Upload dùng Ant Design */}
                            <div className="mt-4">
                                <Upload
                                    customRequest={handleCustomUpload}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    maxCount={1}
                                    showUploadList={false}
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <PlusOutlined style={{ fontSize: '24px' }} />
                                        <span className="text-sm text-black opacity-50">Upload new photo</span>
                                    </div>
                                </Upload>
                            </div>
                        </div>
                    </div>

                    {/* Component Preview ảnh của Ant Design */}
                    {previewImage && (
                        <Image
                            wrapperStyle={{ display: 'none' }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}

                    <div className="flex items-center justify-end gap-8 mt-4">
                        <button
                            onClick={handleSaveChanges}
                            disabled={loading} // Vô hiệu hóa nút khi đang loading nếu cần
                            className="bg-[#db4444] text-white px-12 py-4 rounded hover:bg-[#c03c3c] transition-colors"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={handleCancel}
                            className="text-base text-black hover:opacity-70 transition-opacity"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Profile;