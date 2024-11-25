import axios from "axios";
import Cookie from 'js-cookie';

// Json config 
const axiosConfig = axios.create({
    baseURL: "https://projectledgserver.azurewebsites.net/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Multipart config
const axiosConfigMultipart = axios.create({
    baseURL: "https://projectledgserver.azurewebsites.net/api",
    withCredentials: true,
});

// JWT Interceptor that adds JWT token to the auth bearer for the axios calls
const attachJwtAndRoleInterceptor = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const jwtToken = Cookie.get("JWTTolkien");

            const userRole = Cookie.get("UserRole");

            if (jwtToken) {
                config.headers.Authorization = `Bearer ${jwtToken}`;
            }
            if (userRole) {
                config.headers.Role = userRole; // Add the user role to the headers
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Add the JWT to each axios call
attachJwtAndRoleInterceptor(axiosConfig)
attachJwtAndRoleInterceptor(axiosConfigMultipart)

export { axiosConfig, axiosConfigMultipart};