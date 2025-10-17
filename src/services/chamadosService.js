import api from "./api";

const getChamadosDoCliente = async () => {
  const res = await api.get("/chamados");
  return res.data;
};

const criarChamado = async (dados) => {
  const res = await api.post("/chamados", {
    titulo: dados.titulo,
    descricao: dados.descricao,
  });
  return res.data;
};

const atualizarChamado = async (id, dados) => {
  const res = await api.put(`/chamados/${id}`, dados);
  return res.data;
};

const atribuirChamado = async (id, dados) => {
  const res = await api.put(`/chamados/${id}/atribuir`, dados);
  return res.data;
};

const excluirChamado = async (id) => {
  const res = await api.delete(`/chamados/${id}`);
  return res.data;
};

const getChamadosAbertosDisponiveis = async () => {
  const res = await api.get("/chamados/abertos");
  return res.data;
};

const getMensagensDoChamado = async (id) => {
  const res = await api.get(`/chamados/mensagens/${id}`);
  return res.data.mensagens || [];
}

const enviarMensagemNoChamado = async (id, mensagem) => {
  const res = await api.post(`/chamados/mensagens/${id}`, { mensagem });
  return res.data;
}

export default {
  getChamadosDoCliente,
  criarChamado,
  atualizarChamado,
  atribuirChamado,
  excluirChamado,
  getChamadosAbertosDisponiveis,
  getMensagensDoChamado,
  enviarMensagemNoChamado,
};
