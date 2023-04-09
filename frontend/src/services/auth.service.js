import axios from "axios";

const USER_API_URL = "http://localhost:8000/users/";

const register = ( phone, first_name, last_name, email, password ) => {
    var data = {
        phone: phone,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
    };
    return axios.post(USER_API_URL + "signup", data);
};

const login = ( phone, password ) => {
    var data = {
        phone: phone,
        password: password
    };
    return axios.post(USER_API_URL + "login", data).then((response) => {
        console.log(response.data);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        localStorage.setItem("user", JSON.stringify(response.data.data));
        return response.data;
    });
};

const logout = () => {
    localStorage.removeItem("user");
};

export default {
    register,
    login,
    logout,
};