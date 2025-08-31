import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Save, 
  X, 
  Package,
  DollarSign,
  Truck
} from "lucide-react";
import { Peca } from "@/types/suporte";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const pecaSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  codigo: z.string().min(1, "Código é obrigatório"),
  descricao: z.string().optional(),
  estoque_atual: z.number().min(0, "Estoque deve ser positivo"),
  estoque_minimo: z.number().min(0, "Estoque mínimo deve ser positivo"),
  preco_custo: z.number().min(0, "Preço de custo deve ser positivo"),
  preco_venda: z.number().min(0, "Preço de venda deve ser positivo"),
  fornecedor: z.string().optional(),
  categoria: z.string().min(1, "Categoria é obrigatória"),
});

type PecaFormData = z.infer<typeof pecaSchema>;

interface PecaModalProps {
  peca: Peca | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PecaFormData) => void;
  mode: "create" | "edit";
}

export function PecaModal({ peca, isOpen, onClose, onSave, mode }: PecaModalProps) {
  const { toast } = useToast();

  const form = useForm<PecaFormData>({
    resolver: zodResolver(pecaSchema),
    defaultValues: {
      nome: peca?.nome || "",
      codigo: peca?.codigo || "",
      descricao: peca?.descricao || "",
      estoque_atual: peca?.estoque_atual || 0,
      estoque_minimo: peca?.estoque_minimo || 0,
      preco_custo: peca?.preco_custo || 0,
      preco_venda: peca?.preco_venda || 0,
      fornecedor: peca?.fornecedor || "",
      categoria: peca?.categoria || "",
    },
  });

  const categorias = [
    "Displays",
    "Baterias", 
    "Conectores",
    "Câmeras",
    "Audio",
    "Consumíveis",
    "Ferramentas",
    "Outros"
  ];

  const handleSubmit = (data: PecaFormData) => {
    onSave(data);
    onClose();
    
    toast({
      title: mode === "create" ? "Peça cadastrada" : "Peça atualizada",
      description: mode === "create" 
        ? "A peça foi cadastrada com sucesso." 
        : "As informações da peça foram atualizadas.",
    });
  };

  const calcularMargem = () => {
    const custo = form.watch("preco_custo");
    const venda = form.watch("preco_venda");
    if (custo > 0 && venda > 0) {
      return ((venda - custo) / venda * 100).toFixed(1);
    }
    return "0.0";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {mode === "create" ? "Nova Peça" : "Editar Peça"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Cadastre uma nova peça no estoque" 
              : "Atualize as informações da peça"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Informações da Peça
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Peça *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Tela iPhone 14 Pro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: IP14P-LCD-01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrição detalhada da peça..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background border shadow-lg z-[100]">
                            {categorias.map((categoria) => (
                              <SelectItem key={categoria} value={categoria}>
                                {categoria}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fornecedor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fornecedor</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do fornecedor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Estoque */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Controle de Estoque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="estoque_atual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque Atual *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estoque_minimo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque Mínimo *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preços */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Preços e Margem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preco_custo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de Custo *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preco_venda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de Venda *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Margem de Lucro */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Margem de Lucro:</span>
                    <span className="text-lg font-bold text-green-600">
                      {calcularMargem()}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                    <span>Lucro por unidade:</span>
                    <span>
                      {formatCurrency((form.watch("preco_venda") || 0) - (form.watch("preco_custo") || 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {mode === "create" ? "Cadastrar Peça" : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}