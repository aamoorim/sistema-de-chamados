import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import tecnicoService from "../services/tecnicoService"; 

const TecnicosContext = createContext();

export function TecnicosProvider({ children }) {
  const { token, user } = useAuth();
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      setTecnicos([]);
      return;
    }
    fetchTecnicos();
  }, [token, user]);

  async function fetchTecnicos() {
    setLoading(true);
    setError(null);
    try {
      const data = await tecnicoService.getAllTecnicos();
      setTecnicos(data);
    } catch (err) {
      setError(err.message);
      console.error("Falha ao carregar técnicos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addTecnico(tecnicoData) {
    if (user?.role !== "admin") throw new Error("Sem permissão");
    try {
      await tecnicoService.criarTecnico(tecnicoData);
      await fetchTecnicos();
    } catch (err) {
      throw err;
    }
  }

  async function updateTecnico(tecnicoId, tecnicoData) {
    if (user?.role !== "admin") throw new Error("Sem permissão");
    try {
      const updated = await tecnicoService.atualizarTecnico(tecnicoId, tecnicoData);
      setTecnicos((prev) =>
        prev.map((t) => (t.id === tecnicoId ? updated : t))
      );
    } catch (err) {
      throw err;
    }
  }

  async function deleteTecnico(tecnicoId) {
    if (user?.role !== "admin") throw new Error("Sem permissão");
    try {
      await tecnicoService.excluirTecnico(tecnicoId);
      await fetchTecnicos();
    } catch (err) {
      throw err;
    }
  }

  return (
    <TecnicosContext.Provider
      value={{
        tecnicos,
        loading,
        error,
        addTecnico,
        updateTecnico,
        deleteTecnico,
        fetchTecnicos,
        setTecnicos,
      }}
    >
      {children}
    </TecnicosContext.Provider>
  );
}

export function useTecnicos() {
  const context = useContext(TecnicosContext);
  if (!context) {
    throw new Error("useTecnicos deve ser usado dentro de um TecnicosProvider");
  }
  return context;
}
