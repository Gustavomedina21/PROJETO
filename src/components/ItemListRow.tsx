import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { Edit, Trash2 } from "lucide-react";
import type { ItemWithRatings } from "@shared/schema";

interface ItemListRowProps {
  item: ItemWithRatings;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ItemListRow({ item, onView, onEdit, onDelete }: ItemListRowProps) {
  return (
    <tr
      className="hover-elevate cursor-pointer transition-colors"
      onClick={onView}
      data-testid={`row-item-${item.id}`}
    >
      <td className="px-4 py-3 font-medium" data-testid={`text-title-${item.id}`}>
        {item.titulo}
      </td>
      <td className="px-4 py-3 text-muted-foreground" data-testid={`text-author-${item.id}`}>
        {item.autor}
      </td>
      <td className="px-4 py-3 text-center" data-testid={`text-year-${item.id}`}>
        {item.ano}
      </td>
      <td className="px-4 py-3" data-testid={`text-genre-${item.id}`}>
        {item.genero}
      </td>
      <td className="px-4 py-3">
        <StarRating
          rating={item.averageRating}
          count={item.ratingsCount}
          size="sm"
          showCount={false}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            data-testid={`button-edit-${item.id}`}
            aria-label="Editar item"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            data-testid={`button-delete-${item.id}`}
            aria-label="Excluir item"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
