import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

// Schema de validação com Zod
const schema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100),
  status: z.enum(["Ativa", "Inativa"]),
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres").max(255),
  telefone: z.string().min(10, "O telefone deve ter pelo menos 10 caracteres").max(20).optional(),
  email: z.string().email("Digite um email válido").max(100).optional(),
  descricao: z.string().max(500).optional(),
});

export type LojaFormData = z.infer<typeof schema>;

export interface LojaFormProps {
  onSubmit: (data: LojaFormData) => void;
  onCancel: () => void;
  loja?: {
    id: string;
    nome: string;
    status: string;
    endereco: string;
    telefone?: string;
    email?: string;
    descricao?: string;
  };
}

export default function LojaForm({ onSubmit, onCancel, loja }: LojaFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, watch, setValue } = useForm<LojaFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: loja?.nome || "",
      status: loja?.status === 'active' ? "Ativa" : loja?.status === 'inactive' ? "Inativa" : "Ativa",
      endereco: loja?.endereco || "",
      telefone: loja?.telefone || "",
      email: loja?.email || "",
      descricao: loja?.descricao || "",
    },
    mode: "onChange", // Validação em tempo real
  });

  // Formatar telefone automaticamente (exemplo simplificado)
  const phoneValue = watch('telefone');
  useEffect(() => {
    if (phoneValue && !errors.telefone) {
      // Remover caracteres não numéricos
      const numericValue = phoneValue.replace(/\D/g, '');
      if (numericValue.length > 0) {
        let formattedValue = '';
        
        if (numericValue.length <= 2) {
          formattedValue = `(${numericValue}`;
        } else if (numericValue.length <= 6) {
          formattedValue = `(${numericValue.substring(0, 2)}) ${numericValue.substring(2)}`;
        } else if (numericValue.length <= 10) {
          formattedValue = `(${numericValue.substring(0, 2)}) ${numericValue.substring(2, 6)}-${numericValue.substring(6)}`;
        } else {
          formattedValue = `(${numericValue.substring(0, 2)}) ${numericValue.substring(2, 7)}-${numericValue.substring(7, 11)}`;
        }
        
        // Atualizar valor do campo sem disparar a validação novamente
        setValue('telefone', formattedValue, { shouldValidate: false });
      }
    }
  }, [phoneValue, errors.telefone, setValue]);

  // Handler para submissão do formulário
  const onSubmitHandler = handleSubmit((data) => {
    // Transformar status para o formato esperado pelo back-end
    const formattedData = {
      ...data,
      status: data.status === 'Ativa' ? 'active' : 'inactive'
    };
    onSubmit(formattedData);
  });

  return (
    <form onSubmit={onSubmitHandler} className="space-y-6 animate-fade-in">
      {/* Aviso de edição */}
      {loja && (
        <Alert className="bg-primary/10 text-primary border-primary/20">
          <AlertDescription className="font-medium">
            Editando loja: {loja.nome}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-sm font-medium transition-colors duration-200">
            Nome da Loja *
          </Label>
          <Input
            id="nome"
            placeholder="Digite o nome da loja"
            className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary/30 peer ${errors.nome ? "border-destructive focus:border-destructive focus:ring-destructive/30" : "focus:border-primary"}`}
            {...register("nome")}
          />
          {errors.nome && (
            <p className="mt-1 text-destructive text-xs animate-fade-in">
              {errors.nome.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium transition-colors duration-200">
            Status *
          </Label>
          <div className="relative">
            <Select defaultValue={watch("status")}>
              <SelectTrigger 
                className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary/30 peer ${errors.status ? "border-destructive focus:border-primary focus:ring-destructive/30" : "focus:border-primary"}`}
                id="status"
              >
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativa">Ativa</SelectItem>
                <SelectItem value="Inativa">Inativa</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="mt-1 text-destructive text-xs animate-fade-in">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="endereco" className="text-sm font-medium transition-colors duration-200">
            Endereço *
          </Label>
          <Input
            id="endereco"
            placeholder="Digite o endereço completo"
            className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary/30 peer ${errors.endereco ? "border-destructive focus:border-destructive focus:ring-destructive/30" : "focus:border-primary"}`}
            {...register("endereco")}
          />
          {errors.endereco && (
            <p className="mt-1 text-destructive text-xs animate-fade-in">
              {errors.endereco.message}
            </p>
          )}
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-sm font-medium transition-colors duration-200">
            Telefone
          </Label>
          <Input
            id="telefone"
            placeholder="(00) 0000-0000"
            className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary/30 peer ${errors.telefone ? "border-destructive focus:border-destructive focus:ring-destructive/30" : "focus:border-primary"}`}
            {...register("telefone")}
          />
          {errors.telefone && (
            <p className="mt-1 text-destructive text-xs animate-fade-in">
              {errors.telefone.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium transition-colors duration-200">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@loja.com"
            className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary/30 peer ${errors.email ? "border-destructive focus:border-destructive focus:ring-destructive/30" : "focus:border-primary"}`}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-destructive text-xs animate-fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Descrição */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="descricao" className="text-sm font-medium transition-colors duration-200">
            Descrição
          </Label>
          <Textarea
            id="descricao"
            placeholder="Descrição da loja (opcional)"
            className={`min-h-[100px] transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary/30 peer resize-y ${errors.descricao ? "border-destructive focus:border-destructive focus:ring-destructive/30" : "focus:border-primary"}`}
            {...register("descricao")}
          />
          {errors.descricao && (
            <p className="mt-1 text-destructive text-xs animate-fade-in">
              {errors.descricao.message}
            </p>
          )}
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end gap-3 pt-2 border-t border-muted/20">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          className="transition-all duration-200 ease-in-out hover:bg-secondary/80"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="transition-all duration-200 ease-in-out hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loja ? "Atualizar Loja" : "Criar Loja"}
        </Button>
      </div>
    </form>
  );
}