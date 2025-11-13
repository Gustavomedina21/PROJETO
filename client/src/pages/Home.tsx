import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/Navbar";
import { ItemCard } from "@/components/ItemCard";
import { ItemListRow } from "@/components/ItemListRow";
import { ItemDialog } from "@/components/ItemDialog";
import { ItemDetailDialog } from "@/components/ItemDetailDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Grid3x3, List, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { ItemWithRatings, InsertItem } from "@shared/schema";

type ViewMode = "grid" | "list";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithRatings | null>(null);
  const [itemToEdit, setItemToEdit] = useState<ItemWithRatings | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ItemWithRatings | null>(null);
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery<ItemWithRatings[]>({
    queryKey: searchQuery ? ["/api/items/search", searchQuery] : ["/api/items"],
    queryFn: searchQuery 
      ? async () => {
          const response = await fetch(`/api/items/search/${encodeURIComponent(searchQuery)}`);
          if (!response.ok) throw new Error('Search failed');
          return response.json();
        }
      : undefined,
  });

  const filteredItems = items;

  useEffect(() => {
    if (selectedItem && isDetailDialogOpen && items.length > 0) {
      const updatedItem = items.find(item => item.id === selectedItem.id);
      if (updatedItem && JSON.stringify(updatedItem) !== JSON.stringify(selectedItem)) {
        setSelectedItem(updatedItem);
      }
    }
  }, [items, selectedItem, isDetailDialogOpen]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertItem) => {
      return await apiRequest("POST", "/api/items", data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      await queryClient.refetchQueries({ queryKey: ["/api/items"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Item adicionado!",
        description: "O item foi adicionado ao catálogo com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Create mutation error:", error);
      toast({
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o item. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertItem }) => {
      return await apiRequest("PATCH", `/api/items/${id}`, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      await queryClient.refetchQueries({ queryKey: ["/api/items"] });
      setIsAddDialogOpen(false);
      setItemToEdit(null);
      toast({
        title: "Item atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Update mutation error:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o item. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/items/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      setIsDeleteDialogOpen(false);
      setIsDetailDialogOpen(false);
      setItemToDelete(null);
      toast({
        title: "Item excluído!",
        description: "O item foi removido do catálogo.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o item. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const rateMutation = useMutation({
    mutationFn: async ({ itemId, rating }: { itemId: number; rating: number }) => {
      return await apiRequest("POST", "/api/ratings", { itemId, rating });
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      if (selectedItem && selectedItem.id === variables.itemId) {
        const response = await fetch(`/api/items/${variables.itemId}`);
        if (response.ok) {
          const updatedItem = await response.json();
          setSelectedItem(updatedItem);
        }
      }
      toast({
        title: "Avaliação registrada!",
        description: "Sua avaliação foi adicionada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao avaliar",
        description: "Não foi possível registrar sua avaliação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleAddClick = () => {
    setItemToEdit(null);
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (item: ItemWithRatings) => {
    setItemToEdit(item);
    setIsDetailDialogOpen(false);
    setIsAddDialogOpen(true);
  };

  const handleDeleteClick = (item: ItemWithRatings) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (item: ItemWithRatings) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const handleSubmit = async (data: InsertItem) => {
    if (itemToEdit) {
      await updateMutation.mutateAsync({ id: itemToEdit.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
  };

  const handleRate = (rating: number) => {
    if (selectedItem) {
      rateMutation.mutate({ itemId: selectedItem.id, rating });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleAddClick}
      />

      <main className="container max-w-7xl mx-auto px-4 md:px-8 py-8">
        {isLoading ? (
          <div className="space-y-8">
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : filteredItems.length === 0 && !searchQuery ? (
          <EmptyState onAddClick={handleAddClick} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  {searchQuery ? "Resultados da Busca" : "Todos os Itens"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {filteredItems.length} {filteredItems.length === 1 ? "item encontrado" : "itens encontrados"}
                </p>
              </div>

              <div className="flex items-center gap-2" data-testid="view-toggle">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-view-grid"
                  aria-label="Visualização em grade"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  data-testid="button-view-list"
                  aria-label="Visualização em lista"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh] px-4">
                <p className="text-xl font-medium mb-2" data-testid="text-no-results">
                  Nenhum resultado encontrado
                </p>
                <p className="text-muted-foreground text-center">
                  Tente ajustar sua busca ou adicione novos itens ao catálogo
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={() => handleViewDetails(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium">Título</th>
                      <th className="px-4 py-3 text-left font-medium">Autor/Diretor</th>
                      <th className="px-4 py-3 text-center font-medium">Ano</th>
                      <th className="px-4 py-3 text-left font-medium">Gênero</th>
                      <th className="px-4 py-3 text-left font-medium">Avaliação</th>
                      <th className="px-4 py-3 text-right font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <ItemListRow
                        key={item.id}
                        item={item}
                        onView={() => handleViewDetails(item)}
                        onEdit={() => handleEditClick(item)}
                        onDelete={() => handleDeleteClick(item)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      <ItemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        item={itemToEdit}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <ItemDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        item={selectedItem}
        onEdit={() => {
          if (selectedItem) {
            handleEditClick(selectedItem);
            setIsDetailDialogOpen(false);
          }
        }}
        onDelete={() => {
          if (selectedItem) {
            handleDeleteClick(selectedItem);
          }
        }}
        onRate={handleRate}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemTitle={itemToDelete?.titulo || ""}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
