import React, { useState } from 'react';
import { useSearch } from "../context/search-context";
import '../styles/search-bar/search-bar.scss';
import Botao from "./Button";
import { Search } from 'lucide-react';
import { Send } from '@mui/icons-material';

const SearchBar = () => {  
  const { search, setSearch } = useSearch(); // Pegando o valor da pesquisa e a função para alterá-lo
  const [error, setError] = useState('');

  // Função chamada quando o formulário é enviado
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página ao enviar o formulário

    setError('');
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className="search-bar-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Atualiza o valor da pesquisa
            placeholder="Pesquisar"
            className="search-input"
          />
        </div>

        <div className="botao-enviar-search">
          <Botao type="submit" icon={Send} />
        </div>
      </form>

      {/* Exibindo erro se houver */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default SearchBar;
