import axios from "axios";
import Cookie from 'js-cookie';

const axiosConfig = axios.create({
    baseURL: "https://localhost:7223/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


axiosConfig.interceptors.request.use(
    (config) => {
        const jwtToken = Cookie.get("JWTToken");
        if (jwtToken) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosConfig;
        