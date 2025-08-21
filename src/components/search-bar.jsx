import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from "../context/search-context";
import '../index.css';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

const SearchBar = () => {
  const { search, setSearch, filters, setFilters } = useSearch(); // Agora inclui filters
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Opções de filtro baseadas nos seus dados
  const filterOptions = {
    status: ['Em espera', 'Em andamento', 'Finalizado'],
    technician: ['Carlos Silva', 'Carlos Magno'], // Você pode tornar isso dinâmico
    client: ['André Costa', 'André lima'], // Você pode tornar isso dinâmico
    description: ['Instalação de Rede', 'Instalação de cpu', 'Manutenção'] // Exemplos
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Aplicar/remover filtro
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[filterType]) {
        newFilters[filterType] = [];
      }
      
      if (newFilters[filterType].includes(value)) {
        // Remove o filtro se já estiver selecionado
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        // Adiciona o filtro se não estiver selecionado
        newFilters[filterType] = [...newFilters[filterType], value];
      }
      
      // Remove o array vazio se não houver filtros
      if (newFilters[filterType].length === 0) {
        delete newFilters[filterType];
      }
      
      return newFilters;
    });
  };

  // Remover filtro específico
  const removeFilter = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[filterType]) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        if (newFilters[filterType].length === 0) {
          delete newFilters[filterType];
        }
      }
      return newFilters;
    });
  };

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setFilters({});
  };

  // Contar filtros ativos
  const activeFiltersCount = Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);

  return (
    <div>
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="search-input"
          />
        </div>
        
        <div className="filter-container" ref={dropdownRef}>
          <button 
            className={`filter-button ${activeFiltersCount > 0 ? 'active' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Filter />
            {activeFiltersCount > 0 && (
              <span className="filter-count">{activeFiltersCount}</span>
            )}
            <ChevronDown className={`chevron ${isDropdownOpen ? 'open' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <h3>Filtros</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearAllFilters} className="clear-all-btn">
                    Limpar todos
                  </button>
                )}
              </div>

              {Object.entries(filterOptions).map(([filterType, options]) => (
                <div key={filterType} className="filter-section">
                  <h4 className="filter-title">
                    {filterType === 'status' ? 'Status' :
                     filterType === 'technician' ? 'Técnico' :
                     filterType === 'client' ? 'Cliente' :
                     filterType === 'description' ? 'Tipo de Serviço' : filterType}
                  </h4>
                  <div className="filter-options">
                    {options.map((option) => (
                      <label key={option} className="filter-option">
                        <input
                          type="checkbox"
                          checked={filters[filterType]?.includes(option) || false}
                          onChange={() => handleFilterChange(filterType, option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tags dos filtros ativos */}
      {activeFiltersCount > 0 && (
        <div className="active-filters">
          {Object.entries(filters).map(([filterType, values]) =>
            values.map((value) => (
              <span key={`${filterType}-${value}`} className="filter-tag">
                {value}
                <button
                  onClick={() => removeFilter(filterType, value)}
                  className="remove-filter-btn"
                >
                  <X size={14} />
                </button>
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;