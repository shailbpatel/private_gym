import axios from "axios";
import authHeader from "./auth-header";

const USER_API_URL = "http://localhost:8000/users/";

const getUserDetails = () => {
    return axios.get(USER_API_URL + "details", { headers: authHeader() });
}

export default {
    getUserDetails
};