import axios from "../../utils/axios.custom"

const getCart = () => {
    const URL_BACKEND = `/api/client/cart`;
    return axios.get(URL_BACKEND);
}

const addToCart = (data) => {
    const URL_BACKEND = `/api/client/cart/add`;
    return axios.post(URL_BACKEND, data);
}

const updateCart = (data) => {
    const URL_BACKEND = `/api/client/cart`;
    return axios.put(URL_BACKEND, data);
}
    
const deleteCart = (id) => {
    const URL_BACKEND = `/api/client/cart/${id}`;
    return axios.delete(URL_BACKEND);
}

const checkoutCart = (data) => {
    const URL_BACKEND = `/api/client/cart/checkout`;
    return axios.post(URL_BACKEND, data);
}

export {
    getCart,
    addToCart,
    updateCart,
    deleteCart,
    checkoutCart,
}
