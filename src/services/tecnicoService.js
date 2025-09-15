import api from "./api";

const getAllTecnicos = async () => {
  const res = await api.get("/tecnicos");
  return res.data;
};

const getTecnicoById = async (id) => {
  const res = await api.get(`/tecnicos/${id}`);
  return res.data;
};

const criarTecnico = async (dados) => {
  const res = await api.post("/tecnicos", dados);
  return res.data;
};

const atualizarTecnico = async (id, dados) => {
  const res = await api.put(`/tecnicos/${id}`, dados);
  return res.data;
};

const excluirTecnico = async (id) => {
  const res = await api.delete(`/tecnicos/${id}`);
  return res.data;
};

export default {
  getAllTecnicos,
  getTecnicoById,
  criarTecnico,
  atualizarTecnico,
  excluirTecnico
};
