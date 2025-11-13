import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative bg-primary/20 p-8 rounded-full">
          <BookOpen className="w-20 h-20 text-primary" />
        </div>
      </div>
      
      <h2 className="font-display text-2xl font-bold mb-2 text-center" data-testid="text-empty-title">
        Seu catálogo está vazio
      </h2>
      <p className="text-muted-foreground text-center mb-8 max-w-md">
        Comece adicionando livros e filmes à sua coleção para acompanhar suas leituras e assistidos
      </p>
      
      <Button
        size="lg"
        onClick={onAddClick}
        data-testid="button-add-first-item"
      >
        <Plus className="w-5 h-5 mr-2" />
        Adicionar primeiro item
      </Button>
    </div>
  );
}
