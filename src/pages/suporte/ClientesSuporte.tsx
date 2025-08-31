import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2,
  Phone,
  Mail,
  MapPin,
  User
} from "lucide-react";
import { Cliente } from "@/types/suporte";
import { useToast } from "@/hooks/use-toast";
import { ClienteModal } from "@/components/modals/ClienteModal";

export function ClientesSuporte() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();

  useEffect(() => {
    // Simulando dados dos clientes
    const mockClientes: Cliente[] = [
      {
        id: "1",
        nome: "João Silva",
        telefone: "(11) 99999-9999",
        cpf_cnpj: "123.456.789-00",
        email: "joao.silva@email.com",
        endereco: "Rua das Flores, 123",
        cidade: "São Paulo",
        cep: "01234-567",
        created_at: "2024-01-01T10:00:00Z",
        updated_at: "2024-01-01T10:00:00Z"
      },
      {
        id: "2",
        nome: "Maria Santos",
        telefone: "(11) 88888-8888",
        cpf_cnpj: "987.654.321-00",
        email: "maria.santos@email.com",
        endereco: "Av. Paulista, 1000",
        cidade: "São Paulo",
        cep: "01310-100",
        created_at: "2024-01-02T10:00:00Z",
        updated_at: "2024-01-02T10:00:00Z"
      },
      {
        id: "3",
        nome: "Pedro Costa",
        telefone: "(11) 77777-7777",
        cpf_cnpj: "456.789.123-00",
        email: "pedro.costa@email.com",
        endereco: "Rua dos Jardins, 456",
        cidade: "São Paulo",
        cep: "04567-890",
        created_at: "2024-01-03T10:00:00Z",
        updated_at: "2024-01-03T10:00:00Z"
      },
      {
        id: "4",
        nome: "Ana Oliveira",
        telefone: "(11) 66666-6666",
        cpf_cnpj: "789.123.456-00",
        email: "ana.oliveira@email.com",
        endereco: "Rua das Acácias, 789",
        cidade: "São Paulo",
        cep: "05678-901",
        created_at: "2024-01-04T10:00:00Z",
        updated_at: "2024-01-04T10:00:00Z"
      },
      {
        id: "5",
        nome: "TechCorp Ltda",
        telefone: "(11) 3333-3333",
        cpf_cnpj: "12.345.678/0001-90",
        email: "contato@techcorp.com.br",
        endereco: "Av. Empresarial, 2000",
        cidade: "São Paulo",
        cep: "04456-000",
        created_at: "2024-01-05T10:00:00Z",
        updated_at: "2024-01-05T10:00:00Z"
      }
    ];
    
    setClientes(mockClientes);
  }, []);

  const filteredClientes = clientes.filter(cliente => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(searchLower) ||
      cliente.telefone.includes(searchTerm) ||
      cliente.cpf_cnpj.includes(searchTerm) ||
      (cliente.email && cliente.email.toLowerCase().includes(searchLower))
    );
  });

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    // For now, we'll just show the edit modal in view mode
    setModalMode("edit");
    setIsClienteModalOpen(true);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalMode("edit");
    setIsClienteModalOpen(true);
  };

  const handleNewCliente = () => {
    setSelectedCliente(null);
    setModalMode("create");
    setIsClienteModalOpen(true);
  };

  const handleSaveCliente = (data: any) => {
    if (modalMode === "create") {
      const newCliente: Cliente = {
        id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setClientes(prev => [...prev, newCliente]);
    } else if (selectedCliente) {
      setClientes(prev => prev.map(cliente => 
        cliente.id === selectedCliente.id 
          ? { ...cliente, ...data, updated_at: new Date().toISOString() }
          : cliente
      ));
    }
  };

  const handleDeleteCliente = (clienteId: string) => {
    setClientes(prev => prev.filter(c => c.id !== clienteId));
    toast({
      title: "Cliente removido",
      description: "Cliente foi removido com sucesso.",
    });
  };

  const formatCpfCnpj = (cpfCnpj: string) => {
    // Simples formatação para identificar se é CPF ou CNPJ
    return cpfCnpj.length <= 14 ? "CPF" : "CNPJ";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes do suporte técnico
          </p>
        </div>
        <Button onClick={handleNewCliente}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome, telefone, CPF/CNPJ ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClientes.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{cliente.nome}</p>
                        {cliente.email && (
                          <p className="text-sm text-muted-foreground">{cliente.email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{cliente.telefone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline">
                        {formatCpfCnpj(cliente.cpf_cnpj)}
                      </Badge>
                      <p className="text-sm mt-1">{cliente.cpf_cnpj}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p>{cliente.cidade}</p>
                        <p className="text-muted-foreground">{cliente.cep}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewCliente(cliente)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCliente(cliente)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteCliente(cliente.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cliente Modal */}
      <ClienteModal
        cliente={selectedCliente}
        isOpen={isClienteModalOpen}
        onClose={() => setIsClienteModalOpen(false)}
        onSave={handleSaveCliente}
        mode={modalMode}
      />
    </div>
  );
}