import axios from "../utils/axios.custom"


const fetchAllUsersAPI = () => {
    const URL_BACKEND = `/api/users`;
    return axios.get(URL_BACKEND);
}

const deleteUserAPI = (id) => {
    const URL_BACKEND = `/api/users/${id}`;
    return axios.delete(URL_BACKEND);
}

export {
    fetchAllUsersAPI,
    deleteUserAPI,
}