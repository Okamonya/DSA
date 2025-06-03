import axios from "axios";

const BASE_URL = "https://sea-lion-app-dhbjb.ondigitalocean.app";
// http://127.0.0.1:3001
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export { api }