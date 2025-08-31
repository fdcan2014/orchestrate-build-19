import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  Plus,
  Trash2,
  FileText
} from "lucide-react";
import { OrdemServico } from "@/types/suporte";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const editOSSchema = z.object({
  diagnostico_tecnico: z.string().optional(),
  status: z.enum(["aberta", "aguardando_peca", "em_manutencao", "concluida", "entregue", "cancelada"]),
  prioridade: z.enum(["baixa", "media", "alta", "critica"]),
  tecnico_responsavel: z.string().min(1, "Selecione um técnico"),
  valor_orcamento: z.number().min(0).optional(),
  valor_total: z.number().min(0).optional(),
  observacoes: z.string().optional(),
  checklist_saida: z.string().optional(),
});

type EditOSFormData = z.infer<typeof editOSSchema>;

interface EditOSModalProps {
  os: OrdemServico | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditOSFormData) => void;
}

export function EditOSModal({ os, isOpen, onClose, onSave }: EditOSModalProps) {
  const [pecasUtilizadas, setPecasUtilizadas] = useState([
    { id: "1", peca_id: "1", nome: "Tela iPhone 14 Pro", quantidade: 1, valor_unitario: 650.00 },
  ]);
  const [novaPeca, setNovaPeca] = useState({ peca_id: "", quantidade: 1, valor_unitario: 0 });
  const { toast } = useToast();

  const form = useForm<EditOSFormData>({
    resolver: zodResolver(editOSSchema),
    defaultValues: {
      diagnostico_tecnico: os?.diagnostico_tecnico || "",
      status: os?.status || "aberta",
      prioridade: os?.prioridade || "media",
      tecnico_responsavel: os?.tecnico_responsavel || "",
      valor_orcamento: os?.valor_orcamento || 0,
      valor_total: os?.valor_total || 0,
      observacoes: os?.observacoes || "",
      checklist_saida: "",
    },
  });

  if (!os) return null;

  const tecnicos = [
    { id: "1", nome: "Carlos Técnico" },
    { id: "2", nome: "Ana Técnica" },
    { id: "3", nome: "José Técnico" },
    { id: "4", nome: "Maria Técnica" },
  ];

  const pecasDisponiveis = [
    { id: "1", nome: "Tela iPhone 14 Pro", preco: 650.00, estoque: 15 },
    { id: "2", nome: "Bateria iPhone 14 Pro", preco: 280.00, estoque: 8 },
    { id: "3", nome: "Película Protetora", preco: 25.00, estoque: 50 },
  ];

  const handleSubmit = (data: EditOSFormData) => {
    // Calcular valor total baseado nas peças
    const valorPecas = pecasUtilizadas.reduce((total, peca) => 
      total + (peca.quantidade * peca.valor_unitario), 0
    );
    
    const finalData = {
      ...data,
      valor_total: valorPecas + (data.valor_orcamento || 0),
      pecas_utilizadas: pecasUtilizadas,
    };

    onSave(finalData);
    onClose();
    
    toast({
      title: "OS atualizada",
      description: "A ordem de serviço foi atualizada com sucesso.",
    });
  };

  const adicionarPeca = () => {
    if (!novaPeca.peca_id) return;
    
    const peca = pecasDisponiveis.find(p => p.id === novaPeca.peca_id);
    if (!peca) return;

    const novaPecaItem = {
      id: Date.now().toString(),
      peca_id: novaPeca.peca_id,
      nome: peca.nome,
      quantidade: novaPeca.quantidade,
      valor_unitario: novaPeca.valor_unitario || peca.preco,
    };

    setPecasUtilizadas([...pecasUtilizadas, novaPecaItem]);
    setNovaPeca({ peca_id: "", quantidade: 1, valor_unitario: 0 });
  };

  const removerPeca = (id: string) => {
    setPecasUtilizadas(pecasUtilizadas.filter(p => p.id !== id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const valorTotalPecas = pecasUtilizadas.reduce((total, peca) => 
    total + (peca.quantidade * peca.valor_unitario), 0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Editar Ordem de Serviço - {os.numero}
          </DialogTitle>
          <DialogDescription>
            Atualize as informações da ordem de serviço
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Status e Prioridade */}
            <Card>
              <CardHeader>
                <CardTitle>Status e Controle</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border shadow-lg z-[100]">
                          <SelectItem value="aberta">Aberta</SelectItem>
                          <SelectItem value="aguardando_peca">Aguardando Peça</SelectItem>
                          <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                          <SelectItem value="concluida">Concluída</SelectItem>
                          <SelectItem value="entregue">Entregue</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prioridade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border shadow-lg z-[100]">
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="critica">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tecnico_responsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Técnico Responsável *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border shadow-lg z-[100]">
                          {tecnicos.map((tecnico) => (
                            <SelectItem key={tecnico.id} value={tecnico.nome}>
                              {tecnico.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Diagnóstico */}
            <Card>
              <CardHeader>
                <CardTitle>Diagnóstico e Observações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="diagnostico_tecnico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnóstico Técnico</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o diagnóstico técnico detalhado..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observações adicionais..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checklist_saida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Checklist de Saída</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o estado do dispositivo na entrega..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Peças Utilizadas */}
            <Card>
              <CardHeader>
                <CardTitle>Peças Utilizadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Lista de Peças */}
                <div className="space-y-2">
                  {pecasUtilizadas.map((peca) => (
                    <div key={peca.id} className="flex justify-between items-center p-3 border rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{peca.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {peca.quantidade} x {formatCurrency(peca.valor_unitario)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatCurrency(peca.quantidade * peca.valor_unitario)}</span>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          onClick={() => removerPeca(peca.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adicionar Nova Peça */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Adicionar Peça</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Select value={novaPeca.peca_id} onValueChange={(value) => 
                      setNovaPeca({ ...novaPeca, peca_id: value })
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar peça" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-[100]">
                        {pecasDisponiveis.map((peca) => (
                          <SelectItem key={peca.id} value={peca.id}>
                            <div className="flex flex-col">
                              <span>{peca.nome}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatCurrency(peca.preco)} - Est: {peca.estoque}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qtd"
                      value={novaPeca.quantidade}
                      onChange={(e) => setNovaPeca({ ...novaPeca, quantidade: Number(e.target.value) })}
                    />
                    
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Valor unit."
                      value={novaPeca.valor_unitario}
                      onChange={(e) => setNovaPeca({ ...novaPeca, valor_unitario: Number(e.target.value) })}
                    />
                    
                    <Button type="button" onClick={adicionarPeca}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />
                <div className="flex justify-between items-center font-medium">
                  <span>Total em Peças:</span>
                  <span>{formatCurrency(valorTotalPecas)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Valores */}
            <Card>
              <CardHeader>
                <CardTitle>Valores</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valor_orcamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Mão de Obra</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
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
                  name="valor_total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          value={valorTotalPecas + (form.watch("valor_orcamento") || 0)}
                          readOnly
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}