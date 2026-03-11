import axios from "../../utils/axios.custom"


const fetchAllUsersAPI = (page, size, searchText = "") => {
    const URL_BACKEND = `/api/admin/users`;
    
    return axios.get(URL_BACKEND, {
        params: {
            page: page,
            size: size,
            fullName: searchText 
        }
    });
}


const createUserAPI = (data) => {
    const URL_BACKEND = `/api/admin/users`;
    return axios.post(URL_BACKEND, data);
}

const createUserByAdminAPI = (data) => {
    const URL_BACKEND = `/api/admin/users`;
    return axios.post(URL_BACKEND, data);
}

const updateUserByAdminAPI = (id, data) => {
    const URL_BACKEND = `/api/admin/users/${id}`;
    return axios.put(URL_BACKEND, data);
}


const updateUserAPI = (id, data) => {
    const URL_BACKEND = `/api/admin/users/${id}`;
    return axios.put(URL_BACKEND, data);
}

const deleteUserAPI = (id) => {
    const URL_BACKEND = `/api/admin/users/${id}`;
    return axios.delete(URL_BACKEND);
}

const lockUserByAdminAPI = (id) => {
    const URL_BACKEND = `/api/admin/users/lock/${id}`;
    return axios.put(URL_BACKEND);
}

const fetchProfileAPI = () => {
    const URL_BACKEND = `/api/client/profile`;
    return axios.get(URL_BACKEND);
}

const updateProfileAPI = (data) => {
    const URL_BACKEND = `/api/client/profile`;
    return axios.put(URL_BACKEND, data);
}

const lockedAccountAPI = () => {
    const URL_BACKEND = `/api/client/locked`;
    return axios.delete(URL_BACKEND);
}

export {
    fetchAllUsersAPI,
    deleteUserAPI,
    createUserAPI,
    updateUserAPI,
    createUserByAdminAPI,
    updateUserByAdminAPI,
    fetchProfileAPI,
    updateProfileAPI,
    lockedAccountAPI,
    lockUserByAdminAPI
}