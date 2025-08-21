import { useSearch } from "../context/search-context";
import '../index.css';
import { Search, Filter } from 'lucide-react'; // usando lucide-react para ícones

const SearchBar = () => {
  const { search, setSearch } = useSearch();

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <Search className="icon search-icon" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="search-input"
        />
      </div>
      <button className="filter-button">
        <Filter />
      </button>
    </div>
  );
};

export default SearchBar;
