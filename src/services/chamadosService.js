import api from "./api";

// Buscar chamados do cliente pelo ID do cliente
const getChamadosDoCliente = async (clienteId) => {
  const res = await api.get(`/chamados?clienteId=${clienteId}`);
  return res.data;
};

// Outros serviços existentes
const getAllChamados = async () => {
  const res = await api.get("/chamados");
  return res.data;
};

const criarChamado = async (dados) => {
  const res = await api.post("/chamados", dados);
  return res.data;
};

const atualizarChamado = async (id, dados) => {
  const res = await api.put(`/chamados/${id}`, dados);
  return res.data;
};

const excluirChamado = async (id) => {
  const res = await api.delete(`/chamados/${id}`);
  return res.data;
};

export default {
  getChamadosDoCliente,
  getAllChamados,
  criarChamado,
  atualizarChamado,
  excluirChamado,
};
