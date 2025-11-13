import { Card } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItemWithRatings } from "@shared/schema";

interface ItemCardProps {
  item: ItemWithRatings;
  onClick: () => void;
}

const genreGradients: Record<string, string> = {
  "Ficção": "from-blue-500 to-purple-600",
  "Não-Ficção": "from-green-500 to-teal-600",
  "Romance": "from-pink-500 to-rose-600",
  "Mistério": "from-indigo-500 to-purple-700",
  "Fantasia": "from-violet-500 to-fuchsia-600",
  "Terror": "from-red-600 to-gray-900",
  "Biografia": "from-amber-500 to-orange-600",
  "Drama": "from-slate-600 to-gray-700",
  "Ação": "from-red-500 to-orange-600",
  "Comédia": "from-yellow-400 to-orange-500",
  "Aventura": "from-cyan-500 to-blue-600",
  "Documentário": "from-emerald-500 to-green-700",
};

export function ItemCard({ item, onClick }: ItemCardProps) {
  const gradient = genreGradients[item.genero] || "from-gray-500 to-gray-700";
  const isFilm = item.genero.toLowerCase().includes("filme") || 
                 item.genero.toLowerCase().includes("ação") ||
                 item.genero.toLowerCase().includes("drama") ||
                 item.genero.toLowerCase().includes("comédia");

  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover-elevate"
      onClick={onClick}
      data-testid={`card-item-${item.id}`}
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br" style={{
        backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
      }}>
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradient, "opacity-90")} />
        <div className="absolute inset-0 flex items-center justify-center">
          {isFilm ? (
            <Film className="w-16 h-16 md:w-20 md:h-20 text-white/80" />
          ) : (
            <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-white/80" />
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-lg leading-tight line-clamp-2 min-h-[3.5rem]" data-testid={`text-title-${item.id}`}>
            {item.titulo}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1" data-testid={`text-author-${item.id}`}>
            {item.autor}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs" data-testid={`badge-year-${item.id}`}>
            {item.ano}
          </Badge>
          <Badge variant="outline" className="text-xs" data-testid={`badge-genre-${item.id}`}>
            {item.genero}
          </Badge>
        </div>
        
        <StarRating
          rating={item.averageRating}
          count={item.ratingsCount}
          size="sm"
        />
      </div>
    </Card>
  );
}
