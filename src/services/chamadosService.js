import api from "./api";

// Chamados do admin
const getAllChamados = async () => {
  const res = await api.get("/chamados");
  return res.data;
};

// Criar chamado (cliente)
const criarChamado = async (dados) => {
  const res = await api.post("/chamados", dados);
  return res.data;
};

// Atualizar chamado (admin ou técnico)
const atualizarChamado = async (id, dados) => {
  const res = await api.put(`/chamados/${id}`, dados);
  return res.data;
};

// Excluir chamado (admin)
const excluirChamado = async (id) => {
  const res = await api.delete(`/chamados/${id}`);
  return res.data;
};

export default {
  getAllChamados,
  criarChamado,
  atualizarChamado,
  excluirChamado
};
