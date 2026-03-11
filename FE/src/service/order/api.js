import axios from "../../utils/axios.custom"

const fetchOrderDetailAPI = (id) => {
    const URL_BACKEND = `/api/admin/orders/${id}`;
    return axios.get(URL_BACKEND);
}

const fetchAllOrdersAPI = (page, size, status) => {
    const URL_BACKEND = `/api/client/orders`;
    return axios.get(URL_BACKEND, {
        params: {
            page: page,
            size: size,
            status: status
        }
    });
}

const fetchAllOrdersByAdminAPI = (page, size, name, status) => {
    const URL_BACKEND = `/api/admin/orders`;
    return axios.get(URL_BACKEND, {
        params: {
            page: page,
            size: size,
            status: status ?  status : null,
            name: name ? name : null,
        }
    });
}

const updateOrdersAPI = (orderId, orderStatus) => {
    const URL_BACKEND = `/api/client/orders/${orderId}`;
    return axios.put(URL_BACKEND, orderStatus);
}

const updateOrdersByAdminAPI = (orderId, orderStatus) => {
    const URL_BACKEND = `/api/admin/orders/${orderId}`;
    return axios.put(URL_BACKEND, orderStatus);
}
export {
    fetchOrderDetailAPI,
    fetchAllOrdersAPI,
    fetchAllOrdersByAdminAPI,
    updateOrdersAPI,
    updateOrdersByAdminAPI
}
