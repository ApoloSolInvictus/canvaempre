import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Buscar clases' }) => (
  <label className="mx-5 flex min-h-12 items-center gap-3 rounded-3xl bg-gray-100 px-4 text-muted">
    <Search className="h-5 w-5 shrink-0" />
    <input
      className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);

export default SearchBar;
