import axios from "../../utils/axios.custom"


const getSummaryAPI = () => {
    const URL_BACKEND = `/api/admin/dashboard/summary`;
    return axios.get(URL_BACKEND);
}

export {
    getSummaryAPI
}