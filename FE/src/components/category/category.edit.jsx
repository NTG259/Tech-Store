import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { updateCategoryAPI } from '../../service/category/api';

const CategoryEdit = ({ isOpenEditModal, setIsOpenEditModal, selectedCategory, loadCategories }) => {
    const [form] = Form.useForm();
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    // Mỗi khi modal mở hoặc selectedCategory thay đổi, ta sẽ điền dữ liệu cũ vào form
    useEffect(() => {
        if (selectedCategory && isOpenEditModal) {
            form.setFieldsValue({
                id: selectedCategory.id, // Bổ sung ID vào Form
                name: selectedCategory.name,
                slug: selectedCategory.slug,
                description: selectedCategory.description,
            });
        }
    }, [selectedCategory, isOpenEditModal, form]);

    const onFinish = async (values) => {
        setIsSubmitLoading(true);
        try {
            // Lúc này biến 'values' đã chứa { id, name, description }
            // Gọi API cập nhật kèm theo ID được lấy trực tiếp từ values
            const res = await updateCategoryAPI(values.id, values);

            if (res && res.status === 200) {
                message.success("Cập nhật danh mục thành công!");
                setIsOpenEditModal(false); // Đóng modal
                await loadCategories(); // Tải lại danh sách
            } else {
                message.error(res?.message || "Có lỗi xảy ra khi cập nhật");
            }
        } catch (error) {
            console.error("Lỗi update API:", error);
            message.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleCancel = () => {
        setIsOpenEditModal(false);
    };

    return (
        <Modal
            title="Chỉnh sửa danh mục"
            open={isOpenEditModal}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            confirmLoading={isSubmitLoading}
            okText="Cập nhật"
            cancelText="Hủy"
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal_edit"
                onFinish={onFinish}
            >
                {/* Trường ẩn chứa ID */}
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Tên danh mục"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên danh mục!' },
                    ]}
                >
                    <Input placeholder="Nhập tên danh mục..." />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Nhập mô tả..."
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryEdit;