import { createContext, useContext, useEffect, useState } from "react";
import clienteService from "../services/clienteService";

const ClientesContext = createContext();

// Hook para usar o contexto facilmente
export const useClientes = () => {
  return useContext(ClientesContext);
};

export const ClientesProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [erro, setErro] = useState(null); // Armazena erro, se houver

  // Busca todos os clientes na API
  const fetchClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.getAllClientes();
      setClientes(data);
    } catch (error) {
      console.error("[ClientesContext] Erro ao carregar clientes:", error);
      setErro("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  // Adiciona cliente e recarrega lista do backend
  const addCliente = async (novoCliente) => {
    try {
      await clienteService.criarCliente(novoCliente); // só cria
      await fetchClientes(); // recarrega com dados reais
    } catch (error) {
      console.error("[ClientesContext] Erro ao criar cliente:", error);
      throw error;
    }
  };

  // Atualiza cliente localmente
  const updateCliente = (id, dados) => {
    setClientes((prevClientes) =>
      prevClientes.map((cliente) =>
        cliente.id === id ? { ...cliente, ...dados } : cliente
      )
    );
  };

  // Remove cliente do backend e atualiza estado local
  const deleteCliente = async (id) => {
    try {
      await clienteService.excluirCliente(id);
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
    } catch (error) {
      console.error("[ClientesContext] Erro ao excluir cliente:", error);
      throw error;
    }
  };

  // Busca clientes ao montar componente
  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        loading,
        erro,
        fetchClientes,
        addCliente,
        updateCliente,
        deleteCliente,
        setLoading,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};
