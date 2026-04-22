import React, { useEffect, useState } from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import { Upload, message, Image } from 'antd';
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from "../../service/img/api";
import { fetchProfileAPI, updateProfileAPI } from "../../service/user/api";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

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
                className={`h-[50px] w-[330px] rounded px-4 text-base text-black outline-none focus:ring-2 focus:ring-[#db4444] placeholder:italic placeholder:text-gray-400 ${disabled ? "bg-[#c2c2c2] cursor-not-allowed" : "bg-[#f5f5f5]"}`}
            />
        </div>
    );
}

function SelectField({ label, required, options = [], value, onChange, name }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-base text-black">
                {label} {required && <span className="text-[#db4444] ml-1">*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="h-[50px] w-[330px] bg-[#f5f5f5] rounded px-4 text-base text-black outline-none focus:ring-2 focus:ring-[#db4444]"
            >
                <option value="" disabled>-- Chọn {label.toLowerCase()} --</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

const Profile = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "", 
        avatar: "https://via.placeholder.com/298x166" 
    });
    const [loading, setLoading] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);

    const [cities, setCities] = useState([]);
    const [wards, setWards] = useState([]);
    
    const [selectedCity, setSelectedCity] = useState({ id: "", name: "" });
    const [selectedWard, setSelectedWard] = useState({ id: "", name: "" });

    const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const res = await fetchProfileAPI();
                
                const user = res?.data?.data || res?.data || res;

                if (!user) return;

                setForm((prev) => ({
                    ...prev,
                    fullName: user.fullName || "",
                    phoneNumber: user.phoneNumber || "",
                    email: user.email || "",
                    address: user.address || "", 
                    avatar: user.avatar || prev.avatar,
                }));

                if (user.cityId) {
                    setSelectedCity(prev => ({ ...prev, id: user.cityId.toString() }));
                }
                if (user.wardId) {
                    setSelectedWard(prev => ({ ...prev, id: user.wardId.toString() }));
                }

            } catch (error) {
                message.error("Không thể tải thông tin hồ sơ");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch("http://localhost:8082/api/address/provinces");
                const data = await res.json();
                
                if (data && data.provinces) {
                    const mappedCities = data.provinces.map((p) => ({
                        id: p.code, 
                        name: p.name
                    }));
                    setCities(mappedCities);
                } else {
                    setCities([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thành phố:", error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const fetchWards = async () => {
            if (!selectedCity.id) {
                setWards([]);
                return;
            }
            try {
                const res = await fetch(`http://localhost:8082/api/address/wards?provinceId=${selectedCity.id}`);
                const data = await res.json();
                
                let mappedWards = [];
                if (data && data.communes) {
                    mappedWards = data.communes.map((w) => ({
                        id: w.code,
                        name: w.name
                    }));
                } else if (Array.isArray(data)) {
                    mappedWards = data.map((w) => ({
                        id: w.code || w.id,
                        name: w.name
                    }));
                }
                
                setWards(mappedWards);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách xã/phường:", error);
            }
        };
        fetchWards();
    }, [selectedCity.id]);

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        const cityObj = cities.find(c => c.id.toString() === cityId);
        setSelectedCity({ id: cityId, name: cityObj?.name || "" });
        setSelectedWard({ id: "", name: "" }); 
    };

    const handleWardChange = (e) => {
        const wardId = e.target.value;
        const wardObj = wards.find(w => w.id.toString() === wardId);
        setSelectedWard({ id: wardId, name: wardObj?.name || "" });
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
        if (!form.fullName || !form.fullName.trim()) {
            return message.error("Vui lòng nhập họ và tên!");
        }
        if (!form.phoneNumber || !form.phoneNumber.trim()) {
            return message.error("Vui lòng nhập số điện thoại!");
        }

        try {
            setLoading(true);
            
            const payload = {
                fullName: form.fullName,
                phoneNumber: form.phoneNumber,
                address: form.address, 
                cityId: selectedCity.id, 
                wardId: selectedWard.id, 
                avatar: form.avatar,
            };

            const res = await updateProfileAPI(payload);
            
            const updated = res?.data?.data || res?.data || res;

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
        } finally {
            setLoading(false);
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
                    <h2 className="text-xl text-[#db4444] mb-8">Cập nhật tài khoản</h2>

                    <div className="flex gap-12 mb-8">
                        <FormField
                            label="Họ và tên"
                            value={form.fullName}
                            onChange={setField("fullName")}
                            required
                        />
                        <FormField
                            label="Số điện thoại"
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
                        <SelectField 
                            label="Tỉnh/Thành phố"
                            name="city"
                            options={cities}
                            value={selectedCity.id}
                            onChange={handleCityChange}
                        />
                    </div>

                    <div className="flex gap-12 mb-8">
                        <SelectField 
                            label="Xã/Phường"
                            name="ward"
                            options={wards}
                            value={selectedWard.id}
                            onChange={handleWardChange}
                        />
                        <FormField
                            label="Địa chỉ cụ thể / Số nhà"
                            value={form.address}
                            onChange={setField("address")}
                            placeholder="Ví dụ: Số 123, Đường Lê Lợi"
                        />
                    </div>

                    <div className="mb-8">
                        <p className="text-base text-black mb-3">Ảnh đại diện</p>
                        <div className="flex items-start gap-10">
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
                                        <span className="text-sm text-black opacity-50">Tải mới</span>
                                    </div>
                                </Upload>
                            </div>
                        </div>
                    </div>

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
                            disabled={loading}
                            className="bg-[#db4444] text-white px-12 py-4 rounded hover:bg-[#c03c3c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Đang xử lý..." : "Xác nhận cập nhật"}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="text-base text-black hover:opacity-70 transition-opacity"
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Profile;