import axios from "../../utils/axios.custom"


const getSummaryAPI = () => {
    const URL_BACKEND = `/api/admin/dashboard/summary`;
    return axios.get(URL_BACKEND);
}

const getYearRevenueAPI = (year) => {
    const URL_BACKEND = `/api/admin/dashboard/year-revenue`;
    return axios.get(URL_BACKEND,{
        params: {
            year: year,
        }});
}

const getMonthRevenueAPI = (year, month) => {
    const URL_BACKEND = `/api/admin/dashboard/month-revenue`;
    return axios.get(URL_BACKEND,{
        params: {
            year: year,
            month : month
        }});
}

const getDayRevenueAPI = (year, month, week) => {
    const URL_BACKEND = `/api/admin/dashboard/week-revenue`;
    return axios.get(URL_BACKEND,{
        params: {
            year: year,
            month : month,
            week: week
        }});
}

const getTop10Products = () => {
    const URL_BACKEND = `/api/admin/dashboard/hot-products`;
    return axios.get(URL_BACKEND);
}

export {
    getSummaryAPI,
    getTop10Products,
    getYearRevenueAPI,
    getDayRevenueAPI,
    getMonthRevenueAPI,
}