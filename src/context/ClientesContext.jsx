import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./auth-context";

const ClientesContext = createContext();

export function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const { token } = useAuth(); // pega token do contexto

  useEffect(() => {
    if (!token) {
      // Se não tiver token, não tenta buscar
      console.warn("ClientesContext: token indefinido, não buscando clientes");
      return;
    }

    fetch("https://api-sdc.onrender.com/clientes", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro ao buscar clientes: HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((dados) => {
        setClientes(dados);
      })
      .catch((err) => {
        console.error("Falha ao carregar clientes:", err);
      });
  }, [token]);

  const addCliente = (cliente) => {
    setClientes((prev) => [...prev, cliente]);
  };

  return (
    <ClientesContext.Provider value={{ clientes, setClientes, addCliente }}>
      {children}
    </ClientesContext.Provider>
  );
}

export function useClientes() {
  return useContext(ClientesContext);
}
