import React, { useState } from 'react';
import { useSearch } from "../context/search-context";
import { useAuth } from '../context/auth-context';  // Usando useAuth para acessar o papel do usuário
import '../styles/search-bar/search-bar.scss';
import Botao from "./Button";
import { Search } from 'lucide-react';
import { Send } from '@mui/icons-material';

const SearchBar = () => {
  const { search, setSearch } = useSearch();
  const { role } = useAuth();  // Acessando o papel do usuário
  const [error, setError] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setError('');
  };

  // Aplique a classe condicionalmente com base no papel do usuário
  const roleClass = role || 'cliente';  // Caso não tenha role, por padrão é 'cliente'

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className={`search-bar-container ${roleClass}`}>
        <div className={`search-input-wrapper ${roleClass}`}>
          <Search className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar"
            className="search-input"
          />
        </div>

        <div className={`botao-enviar-search ${roleClass}`}>
          <Botao type="submit" icon={Send} />
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default SearchBar;
