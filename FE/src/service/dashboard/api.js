import axios from "../../utils/axios.custom"


const getSummaryAPI = (year) => {
    const URL_BACKEND = `/api/admin/dashboard/summary`;
    return axios.get(URL_BACKEND,{
        params: {
            year: year,
        }});
}

export {
    getSummaryAPI
}