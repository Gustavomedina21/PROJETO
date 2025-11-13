import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, BookOpen, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItemWithRatings } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

interface ItemDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemWithRatings | null;
  onEdit: () => void;
  onDelete: () => void;
  onRate: (rating: number) => void;
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

export function ItemDetailDialog({
  open,
  onOpenChange,
  item,
  onEdit,
  onDelete,
  onRate,
}: ItemDetailDialogProps) {
  if (!item) return null;

  const gradient = genreGradients[item.genero] || "from-gray-500 to-gray-700";
  const isFilm = item.genero.toLowerCase().includes("filme") || 
                 item.genero.toLowerCase().includes("ação") ||
                 item.genero.toLowerCase().includes("drama") ||
                 item.genero.toLowerCase().includes("comédia");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-6">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-gradient-to-br">
              <div className={cn("absolute inset-0 bg-gradient-to-br", gradient, "opacity-90")} />
              <div className="absolute inset-0 flex items-center justify-center">
                {isFilm ? (
                  <Film className="w-24 h-24 text-white/80" />
                ) : (
                  <BookOpen className="w-24 h-24 text-white/80" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avaliação Atual</p>
                <StarRating
                  rating={item.averageRating}
                  count={item.ratingsCount}
                  size="md"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avaliar este item</p>
                <StarRating
                  rating={0}
                  interactive
                  onRate={onRate}
                  size="lg"
                  showCount={false}
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <Button
                  onClick={onEdit}
                  variant="default"
                  className="w-full"
                  data-testid="button-edit-detail"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={onDelete}
                  variant="destructive"
                  className="w-full"
                  data-testid="button-delete-detail"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="font-display text-3xl leading-tight" data-testid="text-detail-title">
                {item.titulo}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Autor/Diretor</p>
                <p className="text-lg" data-testid="text-detail-author">{item.autor}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Ano</p>
                  <Badge variant="secondary" className="text-base px-3 py-1" data-testid="text-detail-year">
                    {item.ano}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Gênero</p>
                  <Badge variant="outline" className="text-base px-3 py-1" data-testid="text-detail-genre">
                    {item.genero}
                  </Badge>
                </div>
              </div>

              {item.detalhes && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Detalhes</p>
                  <p className="text-base leading-relaxed whitespace-pre-wrap" data-testid="text-detail-details">
                    {item.detalhes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
