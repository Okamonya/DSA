import axios from "axios";

const BASE_URL = "https://b209-105-160-60-209.ngrok-free.app";
// http://127.0.0.1:3001
 const api = axios.create({
    baseURL: BASE_URL,
});

export {api}