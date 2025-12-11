import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchInputProps {
  onSearch: (startupName: string) => void;
  isLoading: boolean;
}

export function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const suggestions = ['Stripe', 'Figma', 'Notion', 'Airtable', 'Canva'];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="pl-5 pr-3">
              <Search className="w-5 h-5 text-white/30" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter startup name..."
              className="flex-1 bg-transparent py-4 pr-4 text-white placeholder:text-white/30 focus:outline-none text-lg"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="m-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-medium text-white flex items-center gap-2 hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              Analyze
            </button>
          </div>
        </div>
      </form>

      {!isLoading && (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-white/30">Try:</span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  onSearch(suggestion);
                }}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/50 hover:text-white/80 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
