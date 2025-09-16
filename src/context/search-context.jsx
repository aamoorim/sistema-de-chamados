import React, { createContext, useContext, useState } from "react";

// Cria o contexto para search e filtros
const SearchContext = createContext(null);

// Provider para envolver a aplicação e prover search + filtros
export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");     // termo de busca
  const [filters, setFilters] = useState({});   // filtros aplicados

  return (
    <SearchContext.Provider value={{ search, setSearch, filters, setFilters }}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook customizado para consumir o contexto de search
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
