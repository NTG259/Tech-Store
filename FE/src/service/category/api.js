import axios from "../../utils/axios.custom"


const fetchAllCategoriesByAdminAPI = (page, size, searchText, sortBy, direction) => {
    const URL_BACKEND = `/api/admin/categories`;
    return axios.get(URL_BACKEND, {
        params: {
            page: page, // (Hoặc page - 1 nếu backend của bạn bắt đầu từ 0)
            size: size,
            name: searchText || undefined,
            sortBy: sortBy || undefined,
            direction: direction || undefined
        }
    });
};


const createCategoryAPI = (data) => {
    const URL_BACKEND = `/api/admin/categories`;
    return axios.post(URL_BACKEND, data);
}

const deleteCategoryAPI = (id) => {
    const URL_BACKEND = `/api/admin/categories/${id}`;
    return axios.delete(URL_BACKEND);
}

const updateCategoryAPI = (id, data) => {
    console.log(data);
    const URL_BACKEND = `/api/admin/categories/${id}`;
    return axios.put(URL_BACKEND, data);
}

const fetchCategoryDetailAPI = (id) => {
    const URL_BACKEND = `/api/admin/categories/${id}`;
    return axios.get(URL_BACKEND);
}

const fetchAllCategoriesAPI = () => {
    const URL_BACKEND = `/api/client/categories`;
    return axios.get(URL_BACKEND);
}

export {
    fetchAllCategoriesAPI,
    fetchCategoryDetailAPI,
    deleteCategoryAPI,
    updateCategoryAPI,
    createCategoryAPI,
    fetchAllCategoriesByAdminAPI
}