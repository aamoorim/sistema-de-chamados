import api from "./api";

const login = async (email, senha) => {
  const res = await api.post("/api-sdc/auth/login", { email, senha });
  return res.data;
};

const logout = async () => {
  await api.post("/api-sdc/auth/logout");
};

const verifyToken = async () => {
  const res = await api.get("/api-sdc/auth/verify");
  return res.data;
};

export default { login, logout, verifyToken };
