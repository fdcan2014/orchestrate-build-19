import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  CalendarIcon, 
  Upload, 
  Search, 
  User, 
  Smartphone,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ordemServicoSchema = z.object({
  cliente_id: z.string().min(1, "Selecione um cliente"),
  tipo_dispositivo: z.string().min(1, "Tipo de dispositivo é obrigatório"),
  marca: z.string().min(1, "Marca é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  numero_serie: z.string().optional(),
  imei: z.string().optional(),
  codigo_interno: z.string().optional(),
  problema_relatado: z.string().min(10, "Descreva o problema com pelo menos 10 caracteres"),
  diagnostico_tecnico: z.string().optional(),
  tipo_garantia: z.enum(["fabrica", "loja", "nenhuma"]),
  status_garantia: z.enum(["valida", "expirada", "nao_aplicavel"]),
  data_expiracao_garantia: z.date().optional(),
  prioridade: z.enum(["baixa", "media", "alta", "critica"]),
  tipo_defeito: z.string().min(1, "Tipo de defeito é obrigatório"),
  sla_prazo: z.string().optional(),
  tecnico_responsavel: z.string().min(1, "Selecione um técnico responsável"),
  valor_orcamento: z.number().min(0, "Valor deve ser positivo").optional(),
  observacoes: z.string().optional(),
  checklist_entrada: z.string().optional(),
});

type OrdemServicoFormData = z.infer<typeof ordemServicoSchema>;

interface OrdemServicoFormProps {
  onSubmit: (data: OrdemServicoFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<OrdemServicoFormData>;
}

export function OrdemServicoForm({ onSubmit, isLoading = false, initialData }: OrdemServicoFormProps) {
  const [searchClienteOpen, setSearchClienteOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [anexos, setAnexos] = useState<File[]>([]);
  const { toast } = useToast();

  const form = useForm<OrdemServicoFormData>({
    resolver: zodResolver(ordemServicoSchema),
    defaultValues: {
      tipo_garantia: "nenhuma",
      status_garantia: "nao_aplicavel",
      prioridade: "media",
      ...initialData,
    },
  });

  const tiposDispositivo = [
    "Smartphone",
    "Tablet",
    "Notebook",
    "Desktop",
    "Monitor",
    "TV",
    "Console",
    "Outros"
  ];

  const marcas = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "Motorola",
    "LG",
    "Sony",
    "Asus",
    "Dell",
    "HP",
    "Lenovo",
    "Outros"
  ];

  const tecnicos = [
    { id: "1", nome: "Carlos Técnico" },
    { id: "2", nome: "Ana Técnica" },
    { id: "3", nome: "José Técnico" },
    { id: "4", nome: "Maria Técnica" },
  ];

  const clientes = [
    { id: "1", nome: "João Silva", telefone: "(11) 99999-9999", cpf_cnpj: "123.456.789-00" },
    { id: "2", nome: "Maria Santos", telefone: "(11) 88888-8888", cpf_cnpj: "987.654.321-00" },
    { id: "3", nome: "Pedro Costa", telefone: "(11) 77777-7777", cpf_cnpj: "456.789.123-00" },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAnexos(prev => [...prev, ...files]);
    
    toast({
      title: "Arquivos anexados",
      description: `${files.length} arquivo(s) anexado(s) com sucesso.`,
    });
  };

  const removeAnexo = (index: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: OrdemServicoFormData) => {
    // Adicionar informações do cliente selecionado
    const formData = {
      ...data,
      anexos: anexos,
    };
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Informações do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="cliente_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <div className="flex gap-2">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{cliente.nome}</span>
                              <span className="text-sm text-muted-foreground">
                                {cliente.telefone} - {cliente.cpf_cnpj}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Informações do Dispositivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Informações do Dispositivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo_dispositivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Dispositivo *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposDispositivo.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
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
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a marca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marcas.map((marca) => (
                          <SelectItem key={marca} value={marca}>
                            {marca}
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
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: iPhone 14 Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero_serie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Série</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: F2LX1234ABC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imei"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IMEI</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123456789012345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigo_interno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Interno</FormLabel>
                    <FormControl>
                      <Input placeholder="Código de controle interno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Problema e Diagnóstico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Problema e Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="problema_relatado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problema Relatado *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
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
              name="diagnostico_tecnico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnóstico Técnico</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Diagnóstico técnico após análise inicial..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Campo preenchido após análise técnica inicial
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo_defeito"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Defeito *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Dano físico">Dano físico</SelectItem>
                        <SelectItem value="Água/Umidade">Água/Umidade</SelectItem>
                        <SelectItem value="Bateria">Bateria</SelectItem>
                        <SelectItem value="Tela/Display">Tela/Display</SelectItem>
                        <SelectItem value="Conectores">Conectores</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
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
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
            </div>
          </CardContent>
        </Card>

        {/* Garantia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Informações de Garantia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo_garantia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Garantia</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fabrica">Garantia de Fábrica</SelectItem>
                        <SelectItem value="loja">Garantia da Loja</SelectItem>
                        <SelectItem value="nenhuma">Sem Garantia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status_garantia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status da Garantia</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="valida">Válida</SelectItem>
                        <SelectItem value="expirada">Expirada</SelectItem>
                        <SelectItem value="nao_aplicavel">Não Aplicável</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_expiracao_garantia"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Expiração da Garantia</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Técnico e Orçamento */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Técnicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tecnico_responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Técnico Responsável *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um técnico" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

              <FormField
                control={form.control}
                name="valor_orcamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Orçamento</FormLabel>
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
                name="sla_prazo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SLA/Prazo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 3 dias úteis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Checklist e Anexos */}
        <Card>
          <CardHeader>
            <CardTitle>Checklist e Anexos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="checklist_entrada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Checklist de Entrada</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o estado do dispositivo na entrada (acessórios, danos visíveis, etc.)..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Anexos</FormLabel>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Adicionar Arquivos
                  </Button>
                </div>
                
                {anexos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {anexos.map((arquivo, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{arquivo.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAnexo(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações Gerais</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais sobre a OS..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar OS"}
          </Button>
        </div>
      </form>
    </Form>
  );
}