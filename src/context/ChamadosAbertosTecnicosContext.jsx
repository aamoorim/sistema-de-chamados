import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { useAuth } from "./auth-context"; 

// Cria o contexto
export const ChamadosAbertosTecnicosContext = createContext();

// Provider do contexto
export function ChamadosAbertosTecnicosProvider({ children }) {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token, role } = useAuth(); 

  const fetchChamados = async () => {
    // Verifica se está autenticado e é técnico
    if (!token || role !== "tecnico") return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/chamados/abertos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  }, [token, role]); // Executa quando token ou role mudar

  return (
    <ChamadosAbertosTecnicosContext.Provider
      value={{ chamados, loading, error, fetchChamados }}
    >
      {children}
    </ChamadosAbertosTecnicosContext.Provider>
  );
}
