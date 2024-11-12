import axios from "axios";
import Cookie from 'js-cookie';

// Json config 
const axiosConfig = axios.create({
    baseURL: "https://projectledg.azurewebsites.net/api/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Multipart config
const axiosConfigMultipart = axios.create({
    baseURL: "https://projectledg.azurewebsites.net/api/",
    withCredentials: true,
});

// JWT Interceptor that adds JWT token to the auth bearer for the axios calls
const attachJwtInterceptor = (instance) => {
    instance.interceptors.request.use(
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
};

// Add the JWT to each axios call
attachJwtInterceptor(axiosConfig)
attachJwtInterceptor(axiosConfigMultipart)

export { axiosConfig, axiosConfigMultipart};