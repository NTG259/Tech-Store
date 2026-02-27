import axios from "../../utils/axios.custom"


const fetchAllProductsAPI = () => {
    const URL_BACKEND = `/api/products`;
    return axios.get(URL_BACKEND);
}


const createProductAPI = (data) => {
    const URL_BACKEND = `/api/products`;
    return axios.post(URL_BACKEND, data);
}

const deleteProductAPI = (id) => {
    const URL_BACKEND = `/api/products/${id}`;
    return axios.delete(URL_BACKEND);
}

const updateProductAPI = (id, data) => {
    console.log(data);
    const URL_BACKEND = `/api/products/${id}`;
    return axios.put(URL_BACKEND, data);
}

export {
    fetchAllProductsAPI,
    deleteProductAPI,
    createProductAPI,
    updateProductAPI
}