import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context"; // Ajuste conforme seu contexto de auth

const TecnicosContext = createContext();

export function TecnicosProvider({ children }) {
  const { token, user } = useAuth(); // pega token e dados do usuário (incluindo role)
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Só busca técnicos se for admin e tiver token
    if (!token || user?.role !== "admin") {
      setTecnicos([]); // limpa lista se não for admin
      return;
    }
    fetchTecnicos();
  }, [token, user]);

  async function fetchTecnicos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api-sdc-teste.onrender.com/tecnicos", {
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
    if (user?.role !== "admin") throw new Error("Sem permissão");
    try {
      const res = await fetch("https://api-sdc-teste.onrender.com/tecnicos", {
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
    if (user?.role !== "admin") throw new Error("Sem permissão");
    try {
      const res = await fetch(
        `https://api-sdc-teste.onrender.com/tecnicos/${tecnicoId}`,
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
