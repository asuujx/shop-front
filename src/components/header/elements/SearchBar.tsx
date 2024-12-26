import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

function SearchBar() {
  return (
    <div className="flex items-center w-full space-x-2 rounded-lg border px-4 py-2">
      <SearchIcon className="h-4 w-4" />
      <Input
        type="search"
        placeholder="Wyszukaj..."
        className="w-full border-0 h-6"
      />
    </div>
  );
}

export default SearchBar