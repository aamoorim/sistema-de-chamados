import api from "./api";

const getChamadosDoCliente = async () => {
  const res = await api.get("/chamados");
  return res.data;
};

const criarChamado = async (dados) => {
  const res = await api.post("/chamados", {
    titulo: dados.titulo,
    descricao: dados.descricao,
    // sem status aqui, backend vai forçar 'aberto'
  });
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
  criarChamado,
  atualizarChamado,
  excluirChamado,
};
