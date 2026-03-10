import axios from "../../utils/axios.custom"



const fetchAllProductsByAdminAPI = (page, size, searchText, categoryId, status) => {
    const URL_BACKEND = `/api/admin/products`;
    
    return axios.get(URL_BACKEND, {
        params: {
            page: page,
            size: size,
            name: searchText || undefined,
            categoryId: categoryId || undefined,
            status: status || undefined
        }
    });
}

const fetchAllProductsAPI = (page, size, status, categoryId) => {
    const URL_BACKEND = `/api/client/products`;
    return axios.get(URL_BACKEND, {
        params: {
            page: page,
            size: size,
            status : status,
            categoryId : categoryId,
        }
    });
}

const createProductAPI = (data) => {
    const URL_BACKEND = `/api/admin/products`;
    return axios.post(URL_BACKEND, data);
}

const deleteProductAPI = (id) => {
    const URL_BACKEND = `/api/admin/products/${id}`;
    return axios.delete(URL_BACKEND);
}

const updateProductAPI = (id, data) => {
    console.log(data);
    const URL_BACKEND = `/api/admin/products/${id}`;
    return axios.put(URL_BACKEND, data);
}

const fetchProductDetailAPI = (id) => {
    const URL_BACKEND = `/api/client/products/${id}`;
    return axios.get(URL_BACKEND);
}

export {
    fetchAllProductsAPI,
    deleteProductAPI,
    createProductAPI,
    updateProductAPI,
    fetchAllProductsByAdminAPI,
    fetchProductDetailAPI
}