import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, DollarSign, ShoppingCart, Clock, TrendingUp } from "lucide-react";
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
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaleDetailsModal } from "@/components/vendas/SaleDetailsModal";
import { useToast } from "@/hooks/use-toast";

const vendas = [
  {
    id: "VND-001",
    cliente: "João Silva",
    loja: "Loja Centro",
    vendedor: "Maria Santos",
    valor: "R$ 1.259,00",
    status: "concluida",
    data: "2024-01-15T10:30:00",
    itens: 3,
    formaPagamento: "Cartão de Crédito"
  },
  {
    id: "VND-002",
    cliente: "Ana Costa",
    loja: "Loja Shopping", 
    vendedor: "Pedro Lima",
    valor: "R$ 892,50",
    status: "concluida",
    data: "2024-01-15T14:20:00",
    itens: 2,
    formaPagamento: "PIX"
  },
  {
    id: "VND-003",
    cliente: "Carlos Mendes",
    loja: "Loja Centro",
    vendedor: "Ana Oliveira", 
    valor: "R$ 2.150,75",
    status: "pendente",
    data: "2024-01-15T16:45:00",
    itens: 5,
    formaPagamento: "Boleto"
  },
  {
    id: "VND-004",
    cliente: "Lucia Santos",
    loja: "Loja Norte",
    vendedor: "João Pedro",
    valor: "R$ 756,25",
    status: "cancelada",
    data: "2024-01-14T11:15:00",
    itens: 1,
    formaPagamento: "Dinheiro"
  },
  {
    id: "VND-005",
    cliente: "Roberto Silva",
    loja: "Loja Shopping",
    vendedor: "Maria Santos", 
    valor: "R$ 3.890,00",
    status: "concluida",
    data: "2024-01-14T09:30:00",
    itens: 4,
    formaPagamento: "Cartão de Débito"
  }
];

const statusColors = {
  concluida: "bg-success/10 text-success",
  pendente: "bg-warning/10 text-warning", 
  cancelada: "bg-destructive/10 text-destructive"
};

const statusLabels = {
  concluida: "Concluída",
  pendente: "Pendente",
  cancelada: "Cancelada"
};

export default function VendasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLoja, setFilterLoja] = useState<string>("all");
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [showSaleDetails, setShowSaleDetails] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredVendas = vendas.filter(venda => {
    const matchesSearch = venda.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venda.vendedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || venda.status === filterStatus;
    const matchesLoja = filterLoja === "all" || venda.loja === filterLoja;
    
    return matchesSearch && matchesStatus && matchesLoja;
  });

  const vendasConcluidas = vendas.filter(v => v.status === "concluida").length;
  const vendasPendentes = vendas.filter(v => v.status === "pendente").length;
  const vendasCanceladas = vendas.filter(v => v.status === "cancelada").length;
  const faturamentoTotal = vendas
    .filter(v => v.status === "concluida")
    .reduce((acc, v) => acc + parseFloat(v.valor.replace("R$ ", "").replace(".", "").replace(",", ".")), 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  };

  const handleNewSale = () => {
    navigate('/vendas/pdv');
    toast({
      title: "Redirecionando...",
      description: "Abrindo o sistema PDV para nova venda",
    });
  };

  const handleViewSale = (sale: any) => {
    setSelectedSale(sale);
    setShowSaleDetails(true);
  };

  const closeSaleDetails = () => {
    setSelectedSale(null);
    setShowSaleDetails(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as vendas realizadas
          </p>
        </div>
        <Button 
          className="btn-primary-gradient"
          onClick={handleNewSale}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {faturamentoTotal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Vendas concluídas
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{vendasConcluidas}</div>
            <p className="text-xs text-muted-foreground">
              Vendas finalizadas
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{vendasPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{vendasCanceladas}</div>
            <p className="text-xs text-muted-foreground">
              Vendas canceladas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vendas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterLoja} onValueChange={setFilterLoja}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Loja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Loja Centro">Loja Centro</SelectItem>
                <SelectItem value="Loja Shopping">Loja Shopping</SelectItem>
                <SelectItem value="Loja Norte">Loja Norte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>
            Todas as vendas realizadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Loja</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell className="font-medium text-primary">{venda.id}</TableCell>
                  <TableCell>{venda.cliente}</TableCell>
                  <TableCell>{venda.vendedor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{venda.loja}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-success">{venda.valor}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={statusColors[venda.status as keyof typeof statusColors]}
                    >
                      {statusLabels[venda.status as keyof typeof statusLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(venda.data)}</TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="text-sm font-medium">{venda.itens}</span>
                      <span className="text-xs text-muted-foreground ml-1">itens</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {venda.formaPagamento}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewSale(venda)}
                      title="Ver detalhes da venda"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Detalhes da Venda */}
      <SaleDetailsModal
        sale={selectedSale}
        isOpen={showSaleDetails}
        onClose={closeSaleDetails}
      />
    </div>
  );
}