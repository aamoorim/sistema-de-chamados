import api from "./api";

const getAllClientes = async () => {
  const res = await api.get("/clientes");
  return res.data;
};

const getClienteById = async (id) => {
  const res = await api.get(`/clientes/${id}`);
  return res.data;
};

const criarCliente = async (dados) => {
  const res = await api.post("/clientes", dados);
  return res.data;
};

const atualizarCliente = async (id, dados) => {
  const res = await api.put(`/clientes/${id}`, dados);
  return res.data;
};

const excluirCliente = async (id) => {
  const res = await api.delete(`/clientes/${id}`);
  return res.data;
};

export default {
  getAllClientes,
  getClienteById,
  criarCliente,
  atualizarCliente,
  excluirCliente
};
