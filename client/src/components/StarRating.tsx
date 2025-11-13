import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function StarRating({
  rating,
  count = 0,
  interactive = false,
  onRate,
  size = "md",
  showCount = true,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };
  
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;
  
  const handleClick = (starRating: number) => {
    if (interactive && onRate) {
      onRate(starRating);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              "transition-all duration-150",
              interactive && "cursor-pointer hover:scale-110 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center -mx-2",
              !interactive && "cursor-default"
            )}
            data-testid={interactive ? `button-star-${star}` : `star-${star}`}
            aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-all duration-150",
                star <= displayRating
                  ? "fill-primary text-primary"
                  : "fill-none text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>
      {!interactive && showCount && (
        <div className="flex items-center gap-1.5">
          <span className={cn("font-medium text-foreground", textSizeClasses[size])} data-testid="text-rating-average">
            {rating > 0 ? rating.toFixed(1) : "—"}
          </span>
          <span className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")} data-testid="text-rating-count">
            {count > 0 ? `(${count} ${count === 1 ? 'avaliação' : 'avaliações'})` : "(Sem avaliações)"}
          </span>
        </div>
      )}
    </div>
  );
}
