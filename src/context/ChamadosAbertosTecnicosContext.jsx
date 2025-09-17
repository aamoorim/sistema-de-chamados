import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

// Cria o contexto
export const ChamadosAbertosTecnicosContext = createContext();

// Provider do contexto
export function ChamadosAbertosTecnicosProvider({ children }) {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChamados = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/chamados/abertos");
      setChamados(response.data);
    } catch (err) {
      setError("Erro ao carregar chamados abertos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChamados();
  }, []);

  return (
    <ChamadosAbertosTecnicosContext.Provider
      value={{ chamados, loading, error, fetchChamados }}
    >
      {children}
    </ChamadosAbertosTecnicosContext.Provider>
  );
}
