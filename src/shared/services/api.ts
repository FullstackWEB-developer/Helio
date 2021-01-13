import axios from "axios";

const Api = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT
});

Api.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';

export default Api;
