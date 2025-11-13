import { Button } from "@/components/ui/button";
import { SearchInput } from "./SearchInput";
import { Plus, BookOpen } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

export function Navbar({ searchQuery, onSearchChange, onAddClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4 md:px-8">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-primary/10 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display font-bold text-xl hidden sm:block">
            Meu Catálogo
          </h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Buscar por título ou autor..."
          />
        </div>

        <Button
          onClick={onAddClick}
          className="flex-shrink-0"
          data-testid="button-add-item"
        >
          <Plus className="w-5 h-5 sm:mr-2" />
          <span className="hidden sm:inline">Novo Item</span>
        </Button>
      </div>
    </header>
  );
}
