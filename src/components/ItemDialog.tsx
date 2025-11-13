import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertItemSchema, type InsertItem, type Item } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
  onSubmit: (data: InsertItem) => Promise<void>;
  isPending: boolean;
}

export function ItemDialog({ open, onOpenChange, item, onSubmit, isPending }: ItemDialogProps) {
  const form = useForm<InsertItem>({
    resolver: zodResolver(insertItemSchema),
    defaultValues: {
      titulo: "",
      autor: "",
      ano: new Date().getFullYear(),
      genero: "",
      detalhes: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        titulo: item?.titulo || "",
        autor: item?.autor || "",
        ano: item?.ano || new Date().getFullYear(),
        genero: item?.genero || "",
        detalhes: item?.detalhes || "",
      });
    }
  }, [open, item, form]);

  const handleSubmit = async (data: InsertItem) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {item ? "Editar Item" : "Adicionar Novo Item"}
          </DialogTitle>
          <DialogDescription>
            {item
              ? "Atualize as informações do livro ou filme."
              : "Preencha os dados para adicionar um novo item ao catálogo."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 1984, Matrix, Harry Potter..."
                      {...field}
                      data-testid="input-titulo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autor/Diretor *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: George Orwell, Wachowski Sisters..."
                      {...field}
                      data-testid="input-autor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 2024"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-ano"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gênero *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Ficção, Drama, Ação..."
                        {...field}
                        data-testid="input-genero"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="detalhes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalhes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione uma sinopse, comentários ou outras informações..."
                      rows={4}
                      className="resize-none"
                      {...field}
                      data-testid="input-detalhes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                data-testid="button-submit"
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {item ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
