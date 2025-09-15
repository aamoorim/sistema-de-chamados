import api from "./api";

const login = async (email, senha) => {
  const res = await api.post("/auth/login", { email, senha });
  return res.data;
};

const logout = async () => {
  await api.post("/auth/logout");
};

const verifyToken = async () => {
  const res = await api.get("/auth/verify");
  return res.data;
};

export default { login, logout, verifyToken };
