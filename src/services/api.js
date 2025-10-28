import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Cria instância do axios com baseURL da API
const api = axios.create({
  baseURL: "https://api-sdc.onrender.com",
});

// Adiciona token em toda requisição, se existir
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");

  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      const token = parsedUser.token;

      // Verifica se o token está expirado
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login?reason=expired"; // Redireciona pro login
        return Promise.reject(new Error("Token expirado"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      // Token inválido ou malformado
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login?reason=invalid"; // Redireciona pro login
      return Promise.reject(err);
    }
  }

  return config;
});

// Interceptor de resposta para capturar 401s da API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido, expirado ou acesso negado
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
