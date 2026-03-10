import React, { useState, useEffect } from "react";
// Nhớ sửa lại đường dẫn import file API này cho đúng với cấu trúc thư mục của bạn nhé
import { fetchAllCategoriesAPI } from "../../service/category/api";

// Component hỗ trợ tạo các mục Accordion (Dropdown) có viền đứt
const FilterSection = ({ title, isOpen, onToggle, children, hideBorder }) => {
    return (
        <div className={`py-4 ${hideBorder ? "" : "border-b border-dashed border-gray-300"}`}>
            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={onToggle}
            >
                <span className="text-base font-medium text-black tracking-wide group-hover:text-[#db4444] transition-colors">
                    {title}
                </span>
                {/* Đổi icon dựa trên trạng thái (Mở: hướng lên, Đóng: hướng sang phải) */}
                <svg
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="text-gray-600 transition-transform duration-200"
                >
                    {isOpen ? (
                        <polyline points="18 15 12 9 6 15"></polyline> // Hướng lên
                    ) : (
                        <polyline points="9 18 15 12 9 6"></polyline> // Hướng phải
                    )}
                </svg>
            </div>
            {/* Nội dung bên trong sẽ hiển thị nếu isOpen = true */}
            {isOpen && <div className="mt-4 flex flex-col gap-3">{children}</div>}
        </div>
    );
};

export default function Sidebar({ searchValue, onSearchChange, filters, onFilterChange }) {
    // 1. State quản lý việc đóng mở của các mục filter
    const [openSections, setOpenSections] = useState({
        availability: false,
        category: true, // Mặc định mở để dễ thao tác
        colors: false,
        priceRange: false
    });

    // 2. State lưu danh sách Category từ API
    const [categories, setCategories] = useState([]);
    const [isLoadingCats, setIsLoadingCats] = useState(false);

    // 3. Gọi API lấy danh mục khi Sidebar vừa render
    useEffect(() => {
        const loadCategories = async () => {
            setIsLoadingCats(true);
            try {
                const res = await fetchAllCategoriesAPI();
                if (res && res.data) {
                    setCategories(res.data);
                } else if (Array.isArray(res)) {
                    setCategories(res);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            } finally {
                setIsLoadingCats(false);
            }
        };

        loadCategories();
    }, []);

    const toggleSection = (sectionName) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    return (
        <aside className="w-[240px] shrink-0 flex flex-col">
            {/* Availability Section */}
            <FilterSection
                title="Availability"
                isOpen={openSections.availability}
                onToggle={() => toggleSection("availability")}
            >
                <label className="flex items-center gap-4 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={filters.availability || false}
                        onChange={(e) => onFilterChange("availability", e.target.checked)}
                        className="w-[18px] h-[18px] border-gray-300 rounded-sm accent-[#db4444] cursor-pointer"
                    />
                    <span className="text-[15px] text-[#333] group-hover:text-black tracking-wide">
                        Availability
                    </span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={filters.outOfStock || false}
                        onChange={(e) => onFilterChange("outOfStock", e.target.checked)}
                        className="w-[18px] h-[18px] border-gray-300 rounded-sm accent-[#db4444] cursor-pointer"
                    />
                    <span className="text-[15px] text-[#333] group-hover:text-black tracking-wide">
                        Out Of Stock
                    </span>
                </label>
            </FilterSection>

            {/* Category Section (Đã kết nối API) */}
            <FilterSection
                title="Category"
                isOpen={openSections.category}
                onToggle={() => toggleSection("category")}
            >
                {isLoadingCats ? (
                    <span className="text-sm text-gray-500 italic">Đang tải danh mục...</span>
                ) : (
                    <>
                        {/* THÊM TÙY CHỌN "TẤT CẢ" ĐỂ XÓA LỌC */}
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value=""
                                checked={!filters.category} // Nếu rỗng thì coi như đang chọn "Tất cả"
                                onChange={(e) => onFilterChange("category", "")}
                                className="w-[18px] h-[18px] accent-[#db4444] cursor-pointer"
                            />
                            <span className={`text-[15px] tracking-wide group-hover:text-[#db4444] transition-colors ${!filters.category ? "text-[#db4444] font-medium" : "text-[#333]"}`}>
                                Tất cả
                            </span>
                        </label>

                        {/* RENDER DANH MỤC TỪ API */}
                        {categories.map((cat) => {
                            const val = cat.id;

                            // Ép kiểu val về string để so sánh an toàn
                            const isChecked = String(filters.category) === String(val);

                            return (
                                <label key={val} className="flex items-center gap-4 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={val}
                                        checked={isChecked}
                                        onChange={(e) => onFilterChange("category", e.target.value)}
                                        className="w-[18px] h-[18px] accent-[#db4444] cursor-pointer"
                                    />
                                    <span className={`text-[15px] tracking-wide group-hover:text-[#db4444] transition-colors ${isChecked ? "text-[#db4444] font-medium" : "text-[#333]"}`}>
                                        {cat.name}
                                    </span>
                                </label>
                            );
                        })}
                    </>
                )}
            </FilterSection>
        </aside>
    );
}