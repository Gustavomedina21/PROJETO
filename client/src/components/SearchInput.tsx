import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Buscar por título ou autor..." }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 pr-12 h-12 rounded-full border-2 focus-visible:ring-2"
        data-testid="input-search"
      />
      {value && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
          onClick={() => onChange("")}
          data-testid="button-clear-search"
          aria-label="Limpar busca"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
