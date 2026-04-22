import React, { useState, useEffect } from "react";
import { fetchAllCategoriesAPI } from "../../service/category/api";

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
                <svg
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="text-gray-600 transition-transform duration-200"
                >
                    {isOpen ? (
                        <polyline points="18 15 12 9 6 15"></polyline>
                    ) : (
                        <polyline points="9 18 15 12 9 6"></polyline>
                    )}
                </svg>
            </div>
            {isOpen && <div className="mt-4 flex flex-col gap-3">{children}</div>}
        </div>
    );
};

export default function Sidebar({ 
    searchName, onSearchChange, onApplySearch,
    categoryId, onCategoryChange,
    minPrice, maxPrice, onPriceChange, onApplyPrice 
}) {
    const [openSections, setOpenSections] = useState({
        category: true,
        priceRange: true
    });

    const [categories, setCategories] = useState([]);
    const [isLoadingCats, setIsLoadingCats] = useState(false);

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

    const handleReloadPage = () => {
        window.location.reload();
    };

    return (
        <aside className="w-[240px] shrink-0 flex flex-col">
            
            
            <div className="pb-4 border-b border-dashed border-gray-300">
                <span className="block text-base font-medium text-black tracking-wide mb-3">
                    Tìm kiếm
                </span>
                <input
                    type="text"
                    placeholder="Nhập tên sản phẩm"
                    value={searchName || ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        onSearchChange(val);
                        
                        if (val === "") {
                            handleReloadPage();
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); 
                            onApplySearch();    
                        }
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#db4444] focus:ring-1 focus:ring-[#db4444] transition-colors"
                />
            </div>

            
            <FilterSection
                title="Danh mục"
                isOpen={openSections.category}
                onToggle={() => toggleSection("category")}
            >
                {isLoadingCats ? (
                    <span className="text-sm text-gray-500 italic">Đang tải danh mục...</span>
                ) : (
                    <>
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value=""
                                checked={!categoryId} 
                                onChange={() => {
                                    onCategoryChange("");
                                    handleReloadPage();
                                }}
                                className="w-[18px] h-[18px] accent-[#db4444] cursor-pointer"
                            />
                            <span className={`text-[15px] tracking-wide group-hover:text-[#db4444] transition-colors ${!categoryId ? "text-[#db4444] font-medium" : "text-[#333]"}`}>
                                Tất cả
                            </span>
                        </label>

                        {categories.map((cat) => {
                            const val = cat.id;
                            const isChecked = String(categoryId) === String(val);

                            return (
                                <label key={val} className="flex items-center gap-4 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={val}
                                        checked={isChecked}
                                        onChange={(e) => onCategoryChange(e.target.value)}
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

            
            <FilterSection
                title="Lọc theo giá"
                isOpen={openSections.priceRange}
                onToggle={() => toggleSection("priceRange")}
                hideBorder={true}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="text" 
                            placeholder="Từ"
                            value={minPrice || ""}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                onPriceChange("minPrice", val);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    onApplyPrice();
                                }
                            }}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#db4444] focus:ring-1 focus:ring-[#db4444] transition-colors"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="text" 
                            placeholder="Đến"
                            value={maxPrice || ""}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                onPriceChange("maxPrice", val);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    onApplyPrice();
                                }
                            }}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#db4444] focus:ring-1 focus:ring-[#db4444] transition-colors"
                        />
                    </div>
                    
                    
                    <button
                        type="button" 
                        onClick={onApplyPrice}
                        className="w-full py-2 bg-black text-white text-sm font-medium rounded hover:bg-[#db4444] transition-colors mt-2"
                    >
                        Áp dụng giá
                    </button>
                    
                    
                    <button
                        type="button" 
                        onClick={handleReloadPage}
                        className="w-full py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 transition-colors"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            </FilterSection>
        </aside>
    );
}