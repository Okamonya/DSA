import axios from "axios";

const BASE_URL = "https://ce00-105-160-118-138.ngrok-free.app";
// http://127.0.0.1:3001
 const api = axios.create({
    baseURL: BASE_URL,
});

export {api}