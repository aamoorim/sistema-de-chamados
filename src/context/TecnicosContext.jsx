import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context"; // Ajuste conforme seu contexto de auth

const TecnicosContext = createContext();

export function TecnicosProvider({ children }) {
  const { token } = useAuth(); // pega token do auth
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchTecnicos();
  }, [token]);

  async function fetchTecnicos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api-sdc.onrender.com/tecnicos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erro ao buscar técnicos");
      const data = await res.json();
      setTecnicos(data);
    } catch (err) {
      setError(err.message);
      console.error("Falha ao carregar técnicos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addTecnico(tecnicoData) {
    try {
      const res = await fetch("https://api-sdc.onrender.com/tecnicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tecnicoData),
      });
      if (!res.ok) throw new Error("Erro ao criar técnico");
      await fetchTecnicos();
    } catch (err) {
      throw err;
    }
  }

  async function deleteTecnico(tecnicoId) {
    try {
      const res = await fetch(
        `https://api-sdc.onrender.com/tecnicos/${tecnicoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Erro ao deletar técnico");
      await fetchTecnicos();
    } catch (err) {
      throw err;
    }
  }

  return (
    <TecnicosContext.Provider
      value={{ tecnicos, loading, error, addTecnico, deleteTecnico, fetchTecnicos }}
    >
      {children}
    </TecnicosContext.Provider>
  );
}

export function useTecnicos() {
  const context = useContext(TecnicosContext);
  if (!context)
    throw new Error("useTecnicos deve ser usado dentro de um TecnicosProvider");
  return context;
}
