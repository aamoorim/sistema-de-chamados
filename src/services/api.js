import axios from "axios";

const API_URL = "https://api-sdc-php.onrender.com"; // URL do backend no Render

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
