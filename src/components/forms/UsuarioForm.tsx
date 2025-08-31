import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const usuarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  papel: z.enum(["Super Admin", "Admin", "Usuário"]),
  loja: z.string().min(1, "Selecione uma loja"),
  status: z.enum(["Ativo", "Inativo"]),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
  permissoes: z.array(z.string()).default([]),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface UsuarioFormProps {
  usuario?: UsuarioFormData & { id: number };
  onSubmit: (data: UsuarioFormData) => void;
  onCancel: () => void;
}

const permissoesDisponiveis = [
  { id: "vendas", label: "Gerenciar Vendas" },
  { id: "produtos", label: "Gerenciar Produtos" },
  { id: "relatorios", label: "Visualizar Relatórios" },
  { id: "usuarios", label: "Gerenciar Usuários" },
  { id: "lojas", label: "Gerenciar Lojas" },
];

const lojas = [
  { id: "1", nome: "Loja Centro" },
  { id: "2", nome: "Loja Shopping" },
  { id: "3", nome: "Loja Online" },
];

export default function UsuarioForm({ usuario, onSubmit, onCancel }: UsuarioFormProps) {
  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: usuario || {
      nome: "",
      email: "",
      telefone: "",
      papel: "Usuário",
      loja: "",
      status: "Ativo",
      senha: "",
      permissoes: [],
    },
  });

  const handleSubmit = (data: UsuarioFormData) => {
    if (usuario && !data.senha) {
      delete data.senha; // Remove senha vazia em edição
    }
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="usuario@exemplo.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{usuario ? "Nova Senha (opcional)" : "Senha"}</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="papel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Papel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o papel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Usuário">Usuário</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loja"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loja</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a loja" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lojas.map((loja) => (
                      <SelectItem key={loja.id} value={loja.id}>
                        {loja.nome}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="permissoes"
          render={() => (
            <FormItem>
              <FormLabel>Permissões</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {permissoesDisponiveis.map((permissao) => (
                  <FormField
                    key={permissao.id}
                    control={form.control}
                    name="permissoes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(permissao.id)}
                            onCheckedChange={(checked) => {
                              const updatedPermissoes = checked
                                ? [...(field.value || []), permissao.id]
                                : (field.value || []).filter((value) => value !== permissao.id);
                              field.onChange(updatedPermissoes);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {permissao.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {usuario ? "Atualizar" : "Criar"} Usuário
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}