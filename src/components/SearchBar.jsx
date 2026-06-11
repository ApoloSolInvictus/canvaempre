import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Buscar clases' }) => (
  <label className="mx-8 flex min-h-[58px] items-center gap-4 rounded-[1.35rem] border border-gray-200 bg-white px-4 text-muted shadow-[0_8px_28px_rgba(9,11,31,0.03)]">
    <Search className="h-8 w-8 shrink-0 text-ink" strokeWidth={2.2} />
    <input
      className="w-full bg-transparent text-base font-medium text-ink outline-none placeholder:text-muted"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);

export default SearchBar;
