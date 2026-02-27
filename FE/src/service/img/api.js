import { message } from "antd";

const uploadToCloudinary = async ({ file, onSuccess, onError, onProgress }) => {
    const cloudName = "dw2jazqf8";
    const uploadPreset = "FE_uploads"; 

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            onSuccess(data, file); 
            message.success("Tải ảnh lên thành công!");
        } else {
            onError(new Error(data.error.message));
            message.error("Lỗi: " + data.error.message);
        }
    } catch (error) {
        onError(error);
        message.error("Không thể kết nối tới Cloudinary");
    }
};

export {
    uploadToCloudinary,
}