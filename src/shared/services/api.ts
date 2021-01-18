import axios from "axios";

import store from '../../app/store';
const Api = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT
});

Api.interceptors.request.use(function (config) {
    const token = store.getState().appUserState.auth.accessToken;
    config.headers.Authorization = token;
    return config;
});

export default Api;
