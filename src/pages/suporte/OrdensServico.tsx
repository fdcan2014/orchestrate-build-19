import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Filter, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2,
  Download,
  FileText
} from "lucide-react";
import { OrdemServico, STATUS_CORES, PRIORIDADE_CORES } from "@/types/suporte";
import { useToast } from "@/hooks/use-toast";
import { OSDetailsModal } from "@/components/modals/OSDetailsModal";
import { EditOSModal } from "@/components/modals/EditOSModal";
import { NovaOSModal } from "@/components/modals/NovaOSModal";

export function OrdensServico() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>("todos");
  const [selectedOS, setSelectedOS] = useState<OrdemServico | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNovaOSModalOpen, setIsNovaOSModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulando dados das ordens de serviço
    const mockOrdens: OrdemServico[] = [
      {
        id: "1",
        numero: "OS-2024-001",
        cliente_id: "1",
        cliente: {
          id: "1",
          nome: "João Silva",
          telefone: "(11) 99999-9999",
          cpf_cnpj: "123.456.789-00",
          endereco: "Rua das Flores, 123",
          cidade: "São Paulo",
          cep: "01234-567",
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        },
        tipo_dispositivo: "Smartphone",
        marca: "Apple",
        modelo: "iPhone 14 Pro",
        numero_serie: "F2LX1234ABC",
        imei: "123456789012345",
        problema_relatado: "Tela quebrada após queda",
        diagnostico_tecnico: "Necessária substituição do display",
        tipo_garantia: "fabrica",
        status_garantia: "valida",
        data_expiracao_garantia: "2025-01-15",
        status: "em_manutencao",
        prioridade: "alta",
        tipo_defeito: "Dano físico",
        sla_prazo: "3 dias",
        tecnico_responsavel: "Carlos Técnico",
        valor_orcamento: 800.00,
        valor_total: 850.00,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        data_previsao: "2024-01-18"
      },
      {
        id: "2",
        numero: "OS-2024-002",
        cliente_id: "2",
        cliente: {
          id: "2",
          nome: "Maria Santos",
          telefone: "(11) 88888-8888",
          cpf_cnpj: "987.654.321-00",
          endereco: "Av. Paulista, 1000",
          cidade: "São Paulo", 
          cep: "01310-100",
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        },
        tipo_dispositivo: "Smartphone",
        marca: "Samsung",
        modelo: "Galaxy S23",
        numero_serie: "SM-S911B123456",
        problema_relatado: "Não liga após atualização",
        diagnostico_tecnico: "Problema no sistema, necessário reflash",
        tipo_garantia: "loja",
        status_garantia: "valida",
        status: "aguardando_peca",
        prioridade: "media",
        tipo_defeito: "Software",
        sla_prazo: "5 dias",
        tecnico_responsavel: "Ana Técnica",
        valor_orcamento: 200.00,
        created_at: "2024-01-14T14:30:00Z",
        updated_at: "2024-01-14T14:30:00Z",
        data_previsao: "2024-01-19"
      },
      {
        id: "3",
        numero: "OS-2024-003",
        cliente_id: "3",
        cliente: {
          id: "3",
          nome: "Pedro Costa",
          telefone: "(11) 77777-7777",
          cpf_cnpj: "456.789.123-00",
          endereco: "Rua dos Jardins, 456",
          cidade: "São Paulo",
          cep: "04567-890",
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        },
        tipo_dispositivo: "Notebook",
        marca: "Apple",
        modelo: "MacBook Pro 16\"",
        numero_serie: "C02XY1234ABC",
        problema_relatado: "Superaquecimento e lentidão",
        diagnostico_tecnico: "Necessária limpeza interna e troca de pasta térmica",
        tipo_garantia: "nenhuma",
        status_garantia: "nao_aplicavel",
        status: "aberta",
        prioridade: "critica",
        tipo_defeito: "Hardware",
        sla_prazo: "1 dia",
        tecnico_responsavel: "José Técnico",
        valor_orcamento: 350.00,
        created_at: "2024-01-13T09:15:00Z",
        updated_at: "2024-01-13T09:15:00Z",
        data_previsao: "2024-01-14"
      }
    ];
    
    setOrdens(mockOrdens);
  }, []);

  const filteredOrdens = ordens.filter(ordem => {
    const matchesSearch = 
      ordem.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.modelo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || ordem.status === statusFilter;
    const matchesPrioridade = prioridadeFilter === "todos" || ordem.prioridade === prioridadeFilter;
    
    return matchesSearch && matchesStatus && matchesPrioridade;
  });

  const handleStatusChange = (ordemId: string, novoStatus: string) => {
    setOrdens(prev => prev.map(ordem => 
      ordem.id === ordemId ? { ...ordem, status: novoStatus as any } : ordem
    ));
    
    toast({
      title: "Status atualizado",
      description: "Status da OS foi atualizada com sucesso.",
    });
  };

  const handleViewOS = (os: OrdemServico) => {
    setSelectedOS(os);
    setIsDetailsModalOpen(true);
  };

  const handleEditOS = (os: OrdemServico) => {
    setSelectedOS(os);
    setIsEditModalOpen(true);
  };

  const handleSaveOS = (data: any) => {
    if (selectedOS) {
      setOrdens(prev => prev.map(ordem => 
        ordem.id === selectedOS.id ? { ...ordem, ...data } : ordem
      ));
    }
  };

  const handleDeleteOS = (ordemId: string) => {
    setOrdens(prev => prev.filter(ordem => ordem.id !== ordemId));
    toast({
      title: "OS excluída",
      description: "A ordem de serviço foi excluída com sucesso.",
    });
  };

  const handleCreateOS = (data: any) => {
    const novaOS: OrdemServico = {
      id: Date.now().toString(),
      numero: `OS-2024-${String(ordens.length + 1).padStart(3, '0')}`,
      cliente_id: data.cliente_id,
      cliente: {
        id: data.cliente_id,
        nome: "Cliente Exemplo", // This would come from the selected cliente
        telefone: "(11) 99999-9999",
        cpf_cnpj: "123.456.789-00",
        endereco: "Endereço exemplo",
        cidade: "São Paulo",
        cep: "01234-567",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      tipo_dispositivo: data.tipo_dispositivo,
      marca: data.marca,
      modelo: data.modelo,
      numero_serie: data.numero_serie,
      imei: data.imei,
      codigo_interno: data.codigo_interno,
      problema_relatado: data.problema_relatado,
      diagnostico_tecnico: data.diagnostico_tecnico,
      tipo_garantia: data.tipo_garantia,
      status_garantia: data.status_garantia,
      data_expiracao_garantia: data.data_expiracao_garantia?.toISOString(),
      status: "aberta",
      prioridade: data.prioridade,
      tipo_defeito: data.tipo_defeito,
      sla_prazo: data.sla_prazo,
      tecnico_responsavel: data.tecnico_responsavel,
      valor_orcamento: data.valor_orcamento,
      observacoes: data.observacoes,
      checklist_entrada: data.checklist_entrada,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOrdens(prev => [novaOS, ...prev]);
    toast({
      title: "OS criada com sucesso!",
      description: `Nova ordem de serviço ${novaOS.numero} foi registrada.`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h1>
          <p className="text-muted-foreground">
            Gerencie todas as ordens de serviço técnico
          </p>
        </div>
        <Button onClick={() => setIsNovaOSModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova OS
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por número, cliente, marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="aberta">Aberta</SelectItem>
                <SelectItem value="aguardando_peca">Aguardando Peça</SelectItem>
                <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Prioridades</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Ordens */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens</CardTitle>
          <CardDescription>
            {filteredOrdens.length} ordem(ns) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Previsão</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrdens.map((ordem) => (
                <TableRow key={ordem.id}>
                  <TableCell className="font-medium">{ordem.numero}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ordem.cliente?.nome}</p>
                      <p className="text-sm text-muted-foreground">{ordem.cliente?.telefone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ordem.marca} {ordem.modelo}</p>
                      <p className="text-sm text-muted-foreground">{ordem.tipo_dispositivo}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_CORES[ordem.status]}>
                      {ordem.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={PRIORIDADE_CORES[ordem.prioridade]}>
                      {ordem.prioridade}
                    </Badge>
                  </TableCell>
                  <TableCell>{ordem.tecnico_responsavel}</TableCell>
                  <TableCell>
                    {ordem.data_previsao ? new Date(ordem.data_previsao).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell>
                    {ordem.valor_orcamento ? formatCurrency(ordem.valor_orcamento) : '-'}
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
                        <DropdownMenuItem onClick={() => handleViewOS(ordem)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditOS(ordem)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Comprovante
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteOS(ordem.id)}
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

      {/* Modals */}
      <OSDetailsModal
        os={selectedOS}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={() => {
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onStatusChange={(novoStatus) => selectedOS && handleStatusChange(selectedOS.id, novoStatus)}
      />

      <EditOSModal
        os={selectedOS}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveOS}
      />

      <NovaOSModal
        isOpen={isNovaOSModalOpen}
        onClose={() => setIsNovaOSModalOpen(false)}
        onSave={handleCreateOS}
      />
    </div>
  );
}