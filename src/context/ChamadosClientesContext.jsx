import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const ClientesContext = createContext();

export const ClientesProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [errorClientes, setErrorClientes] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoadingClientes(true);
        setErrorClientes(null);
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.token) {
          throw new Error("Usuário não autenticado");
        }

        // Se tiver role/permissão vem do user
        if (user.role !== "admin" && user.role !== "tecnico") {
          // Se cliente, não deve carregar clientes
          return;
        }

        const res = await api.get("/clientes");
        setClientes(res.data);
      } catch (err) {
        console.error("Falha ao carregar clientes:", err);
        setErrorClientes(err);
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, []);

  return (
    <ClientesContext.Provider value={{
      clientes,
      loadingClientes,
      errorClientes
    }}>
      {children}
    </ClientesContext.Provider>
  );
};
