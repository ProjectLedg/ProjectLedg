import axios from "axios";
import Cookies from "js-cookie";

const jwtToken = Cookies.get("JWTToken");

const axiosConfig = axios.create({
    baseURL: "https://localhost:7223/api",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
});

export default axiosConfig;
        