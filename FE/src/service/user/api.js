import axios from "../../utils/axios.custom"


const fetchAllUsersAPI = () => {
    const URL_BACKEND = `/api/users`;
    return axios.get(URL_BACKEND);
}

const createUserAPI = (data) => {
    const URL_BACKEND = `/api/users`;
    return axios.post(URL_BACKEND, data);
}

const updateUserAPI = (id, data) => {
    const URL_BACKEND = `/api/users/${id}`;
    return axios.put(URL_BACKEND, data);
}

const deleteUserAPI = (id) => {
    const URL_BACKEND = `/api/users/${id}`;
    return axios.delete(URL_BACKEND);
}

export {
    fetchAllUsersAPI,
    deleteUserAPI,
    createUserAPI,
    updateUserAPI,
}