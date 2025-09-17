import axios from "axios";

const api = axios.create({
  baseURL: "https://api-sdc-teste.onrender.com",
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  let token = null;

  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      token = parsedUser.token;
    } catch (err) {
      token = null;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("api.js - Nenhum token encontrado para enviar");
  }

  return config;
});

export default api;
