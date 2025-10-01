import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import clienteService from "../services/clienteService"; // Importa as funções da API

const ClientesContext = createContext();

export function ClientesProvider({ children }) {
  const { token, user } = useAuth(); // Dados do usuário autenticado
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega clientes ao iniciar, se o usuário for admin
  useEffect(() => {
    if (!token || user?.role !== "admin") {
      setClientes([]);
      return;
    }
    fetchClientes();
  }, [token, user]);

  // Busca todos os clientes da API
  async function fetchClientes() {
    setLoading(true);
    setError(null);
    try {
      const data = await clienteService.getAllClientes(token);
      setClientes(data);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Adiciona novo cliente via API e atualiza a lista
  async function addCliente(dados) {
    if (user?.role !== "admin") throw new Error("Sem permissão");
    try {
      const novoCliente = await clienteService.criarCliente(dados, token);
      setClientes((prev) => [...prev, novoCliente]);
    } catch (err) {
      throw err;
    }
  }

  // Atualiza cliente via API e atualiza no estado
  async function updateCliente(id, dados) {
    if (user?.role !== "admin") throw new Error("Sem permissão");
    try {
      const atualizado = await clienteService.atualizarCliente(id, dados, token);
      setClientes((prev) =>
        prev.map((cliente) => (cliente.id === id ? atualizado : cliente))
      );
    } catch (err) {
      throw err;
    }
  }

  // Remove cliente via API e atualiza o estado
  async function deleteCliente(id) {
    if (user?.role !== "admin") throw new Error("Sem permissão");
    try {
      await clienteService.excluirCliente(id, token);
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
    } catch (err) {
      throw err;
    }
  }

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
        setClientes, // Disponível para uso interno se necessário
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
}

export function useClientes() {
  const context = useContext(ClientesContext);
  if (!context) {
    throw new Error("useClientes deve ser usado dentro de um ClientesProvider");
  }
  return context;
}
