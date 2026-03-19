import axios from "../../utils/axios.custom"


const loginAPI = (data) => {
    const URL_BACKEND = `/api/auth/login`;
    return axios.post(URL_BACKEND, data);
}

const registerAPI = (data) => {
    const URL_BACKEND = `/api/auth/register`;
    return axios.post(URL_BACKEND, data);
}

const refreshTokenAPI = () => {
    const URL_BACKEND = `/api/auth/refresh`;
    return axios.post(URL_BACKEND);
}

const logoutAPI = () => {
    const URL_BACKEND = `/api/auth/logout`;
    return axios.post(URL_BACKEND);
}
export { loginAPI, registerAPI, refreshTokenAPI, logoutAPI };