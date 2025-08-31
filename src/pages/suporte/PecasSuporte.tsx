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
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Peca } from "@/types/suporte";
import { useToast } from "@/hooks/use-toast";
import { PecaModal } from "@/components/modals/PecaModal";

export function PecasSuporte() {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todas");
  const [estoqueFilter, setEstoqueFilter] = useState<string>("todos");
  const [selectedPeca, setSelectedPeca] = useState<Peca | null>(null);
  const [isPecaModalOpen, setIsPecaModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();

  useEffect(() => {
    // Simulando dados das peças
    const mockPecas: Peca[] = [
      {
        id: "1",
        nome: "Tela iPhone 14 Pro",
        codigo: "IP14P-LCD-01",
        descricao: "Display LCD para iPhone 14 Pro com touch screen",
        estoque_atual: 15,
        estoque_minimo: 5,
        preco_custo: 450.00,
        preco_venda: 650.00,
        fornecedor: "TechParts Ltda",
        categoria: "Displays",
        created_at: "2024-01-01T10:00:00Z",
        updated_at: "2024-01-01T10:00:00Z"
      },
      {
        id: "2",
        nome: "Bateria Samsung Galaxy S23",
        codigo: "SGS23-BAT-01",
        descricao: "Bateria original para Samsung Galaxy S23",
        estoque_atual: 8,
        estoque_minimo: 10,
        preco_custo: 80.00,
        preco_venda: 120.00,
        fornecedor: "Mobile Parts",
        categoria: "Baterias",
        created_at: "2024-01-02T10:00:00Z",
        updated_at: "2024-01-02T10:00:00Z"
      },
      {
        id: "3",
        nome: "Conector de Carga iPhone",
        codigo: "IP-CHG-CONN",
        descricao: "Conector Lightning para carregamento iPhone",
        estoque_atual: 25,
        estoque_minimo: 15,
        preco_custo: 25.00,
        preco_venda: 45.00,
        fornecedor: "Apple Parts",
        categoria: "Conectores",
        created_at: "2024-01-03T10:00:00Z",
        updated_at: "2024-01-03T10:00:00Z"
      },
      {
        id: "4",
        nome: "Câmera Traseira Xiaomi Redmi Note 12",
        codigo: "XRN12-CAM-01",
        descricao: "Módulo câmera traseira principal 50MP",
        estoque_atual: 3,
        estoque_minimo: 8,
        preco_custo: 120.00,
        preco_venda: 180.00,
        fornecedor: "Xiaomi Parts",
        categoria: "Câmeras",
        created_at: "2024-01-04T10:00:00Z",
        updated_at: "2024-01-04T10:00:00Z"
      },
      {
        id: "5",
        nome: "Alto-falante MacBook Pro",
        codigo: "MBP-SPK-01",
        descricao: "Alto-falante interno para MacBook Pro 13\"",
        estoque_atual: 12,
        estoque_minimo: 5,
        preco_custo: 90.00,
        preco_venda: 150.00,
        fornecedor: "Mac Parts",
        categoria: "Audio",
        created_at: "2024-01-05T10:00:00Z",
        updated_at: "2024-01-05T10:00:00Z"
      },
      {
        id: "6",
        nome: "Pasta Térmica Premium",
        codigo: "PASTE-TERM-01",
        descricao: "Pasta térmica para processadores e chips",
        estoque_atual: 45,
        estoque_minimo: 20,
        preco_custo: 15.00,
        preco_venda: 25.00,
        fornecedor: "Thermal Solutions",
        categoria: "Consumíveis",
        created_at: "2024-01-06T10:00:00Z",
        updated_at: "2024-01-06T10:00:00Z"
      }
    ];
    
    setPecas(mockPecas);
  }, []);

  const categorias = ["todas", "Displays", "Baterias", "Conectores", "Câmeras", "Audio", "Consumíveis"];

  const filteredPecas = pecas.filter(peca => {
    const matchesSearch = 
      peca.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peca.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (peca.fornecedor && peca.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategoria = categoriaFilter === "todas" || peca.categoria === categoriaFilter;
    
    let matchesEstoque = true;
    if (estoqueFilter === "baixo") {
      matchesEstoque = peca.estoque_atual <= peca.estoque_minimo;
    } else if (estoqueFilter === "zerado") {
      matchesEstoque = peca.estoque_atual === 0;
    }
    
    return matchesSearch && matchesCategoria && matchesEstoque;
  });

  const getEstoqueBadge = (peca: Peca) => {
    if (peca.estoque_atual === 0) {
      return <Badge variant="destructive">Zerado</Badge>;
    } else if (peca.estoque_atual <= peca.estoque_minimo) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Baixo</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800">Normal</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularMargem = (custo: number, venda: number) => {
    return ((venda - custo) / venda * 100).toFixed(1);
  };

  const handleDeletePeca = (pecaId: string) => {
    setPecas(prev => prev.filter(p => p.id !== pecaId));
    toast({
      title: "Peça removida",
      description: "Peça foi removida com sucesso.",
    });
  };

  const totalEstoque = pecas.reduce((total, peca) => total + peca.estoque_atual, 0);
  const valorTotalEstoque = pecas.reduce((total, peca) => total + (peca.estoque_atual * peca.preco_custo), 0);
  const pecasBaixoEstoque = pecas.filter(peca => peca.estoque_atual <= peca.estoque_minimo).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Peças e Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie o estoque de peças para manutenção
          </p>
        </div>
        <Button onClick={() => { setSelectedPeca(null); setModalMode("create"); setIsPecaModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Peça
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Peças</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEstoque}</div>
            <p className="text-xs text-muted-foreground">
              {pecas.length} tipos diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(valorTotalEstoque)}</div>
            <p className="text-xs text-muted-foreground">
              Custo total do estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baixo Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pecasBaixoEstoque}</div>
            <p className="text-xs text-muted-foreground">
              Peças abaixo do mínimo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorias.length - 1}</div>
            <p className="text-xs text-muted-foreground">
              Categorias ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar Peças</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome, código ou fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria === "todas" ? "Todas as Categorias" : categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={estoqueFilter} onValueChange={setEstoqueFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estoque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="baixo">Estoque Baixo</SelectItem>
                <SelectItem value="zerado">Estoque Zerado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Peças */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Peças</CardTitle>
          <CardDescription>
            {filteredPecas.length} peça(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código/Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Preços</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPecas.map((peca) => (
                <TableRow key={peca.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{peca.nome}</p>
                      <p className="text-sm text-muted-foreground">{peca.codigo}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{peca.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{peca.estoque_atual}</span>
                        {getEstoqueBadge(peca)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mín: {peca.estoque_minimo}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-3 w-3 text-red-500" />
                        <span className="text-sm">{formatCurrency(peca.preco_custo)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm font-medium">{formatCurrency(peca.preco_venda)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {calcularMargem(peca.preco_custo, peca.preco_venda)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{peca.fornecedor}</span>
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
                        <DropdownMenuItem onClick={() => { setSelectedPeca(peca); setModalMode("edit"); setIsPecaModalOpen(true); }}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedPeca(peca); setModalMode("edit"); setIsPecaModalOpen(true); }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Package className="mr-2 h-4 w-4" />
                          Ajustar Estoque
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeletePeca(peca.id)}
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

      {/* Peca Modal */}
      <PecaModal
        peca={selectedPeca}
        isOpen={isPecaModalOpen}
        onClose={() => setIsPecaModalOpen(false)}
        onSave={(data) => {
          if (modalMode === "create") {
            const newPeca: Peca = {
              id: Date.now().toString(),
              nome: data.nome || "",
              codigo: data.codigo || "",
              descricao: data.descricao || "",
              estoque_atual: data.estoque_atual || 0,
              estoque_minimo: data.estoque_minimo || 0,
              preco_custo: data.preco_custo || 0,
              preco_venda: data.preco_venda || 0,
              fornecedor: data.fornecedor || "",
              categoria: data.categoria || "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setPecas(prev => [...prev, newPeca]);
          } else if (selectedPeca) {
            setPecas(prev => prev.map(peca => 
              peca.id === selectedPeca.id 
                ? { ...peca, ...data, updated_at: new Date().toISOString() }
                : peca
            ));
          }
        }}
        mode={modalMode}
      />
    </div>
  );
}