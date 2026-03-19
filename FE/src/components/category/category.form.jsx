import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { createCategoryAPI } from '../../service/category/api';

const CategoryForm = ({ isOpenCreateModal, setIsOpenCreateModal, loadCategories }) => {
    const [form] = Form.useForm();
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const onFinish = async (values) => {
        setIsSubmitLoading(true);
        try {
            // Gọi API thêm mới
            const res = await createCategoryAPI(values);

            // Xử lý response (tùy theo format axios custom của bạn)
            if (res && res.status === 201 || res.status === 200) {
                message.success("Thêm mới danh mục thành công!");
                form.resetFields(); // Xóa trắng form
                setIsOpenCreateModal(false); // Đóng modal
                await loadCategories(); // Tải lại danh sách
            } else {
                message.error(res?.message || "Có lỗi xảy ra khi thêm mới");
            }
        } catch (error) {
            console.error("Lỗi create API:", error);
            message.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm mới");
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsOpenCreateModal(false);
    };

    return (
        <Modal
            title="Thêm mới danh mục"
            open={isOpenCreateModal}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            confirmLoading={isSubmitLoading}
            okText="Lưu lại"
            cancelText="Hủy"
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal_create"
                onFinish={onFinish}
            >
                <Form.Item
                    name="name"
                    label="Tên danh mục"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên danh mục!' },
                        { min: 3, message: 'Tên danh mục phải có ít nhất 3 ký tự!' }
                    ]}
                >
                    <Input placeholder="Nhập tên danh mục (VD: Điện thoại)" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Nhập mô tả cho danh mục này..."
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryForm;