import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import clienteService from "../services/clienteService";

const ClientesContext = createContext();

// Hook para facilitar o uso do contexto
export const useClientes = () => {
  const context = useContext(ClientesContext);
  if (!context) {
    throw new Error("useClientes deve ser usado dentro de um ClientesProvider");
  }
  return context;
};

export const ClientesProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função utilitária para checar permissão de admin
  const checkAdmin = () => {
    if (!user || user.role !== "admin") {
      throw new Error("Acesso negado: apenas administradores podem realizar esta ação.");
    }
  };

  // Busca todos os clientes da API (apenas se admin)
  const fetchClientes = async () => {
    if (!token || user?.role !== "admin") {
      setClientes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await clienteService.getAllClientes(token);
      setClientes(data);
    } catch (err) {
      console.error("[ClientesContext] Erro ao carregar clientes:", err);
      setError(err?.message || "Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  // Adiciona cliente no backend e recarrega lista
  const addCliente = async (novoCliente) => {
    try {
      checkAdmin();
      await clienteService.criarCliente(novoCliente, token);
      await fetchClientes();
    } catch (err) {
      console.error("[ClientesContext] Erro ao criar cliente:", err);
      setError(err?.message || "Erro ao criar cliente");
      throw err;
    }
  };

  // Atualiza cliente via backend e no estado local
  const updateCliente = async (id, dados) => {
    try {
      checkAdmin();
      const atualizado = await clienteService.atualizarCliente(id, dados, token);
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.id === id ? { ...cliente, ...atualizado } : cliente
        )
      );
    } catch (err) {
      console.error("[ClientesContext] Erro ao atualizar cliente:", err);
      setError(err?.message || "Erro ao atualizar cliente");
      throw err;
    }
  };

  // Remove cliente no backend e atualiza estado local
  const deleteCliente = async (id) => {
    try {
      checkAdmin();
      await clienteService.excluirCliente(id, token);
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
    } catch (err) {
      console.error("[ClientesContext] Erro ao excluir cliente:", err);
      setError(err?.message || "Erro ao excluir cliente");
      throw err;
    }
  };

  // Busca clientes ao montar componente, se admin
  useEffect(() => {
    fetchClientes();
  }, [token, user]);

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        loading,
        error,
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
