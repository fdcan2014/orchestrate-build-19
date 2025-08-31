import { useState } from "react";
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProdutoForm from "@/components/forms/ProdutoForm";

const produtos = [
  {
    id: "1",
    nome: "Smartphone Galaxy S24",
    categoria: "Eletrônicos",
    preco: "R$ 2.299,00",
    estoque: 45,
    estoqueMin: 10,
    status: "ativo",
    vendas: 128,
    lucro: "R$ 12.450,00"
  },
  {
    id: "2",
    nome: "Notebook Dell Inspiron",
    categoria: "Eletrônicos", 
    preco: "R$ 3.499,00",
    estoque: 12,
    estoqueMin: 5,
    status: "ativo",
    vendas: 89,
    lucro: "R$ 8.900,00"
  },
  {
    id: "3",
    nome: "Camiseta Polo Masculina",
    categoria: "Vestuário",
    preco: "R$ 89,90",
    estoque: 156,
    estoqueMin: 20,
    status: "ativo", 
    vendas: 245,
    lucro: "R$ 3.245,00"
  },
  {
    id: "4",
    nome: "Tênis Running Nike",
    categoria: "Calçados",
    preco: "R$ 299,90", 
    estoque: 3,
    estoqueMin: 15,
    status: "baixo_estoque",
    vendas: 67,
    lucro: "R$ 1.890,00"
  },
  {
    id: "5", 
    nome: "Perfume Importado",
    categoria: "Beleza",
    preco: "R$ 159,90",
    estoque: 0,
    estoqueMin: 10,
    status: "sem_estoque",
    vendas: 34,
    lucro: "R$ 567,00"
  }
];

const categorias = ["Todas", "Eletrônicos", "Vestuário", "Calçados", "Beleza"];

export default function ProdutosPage() {
  const [items, setItems] = useState(produtos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<string>("Todas");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const parseCurrency = (str: string) => {
    try {
      return parseFloat(str.replace(/[R$\s.]/g, "").replace(",", ".")) || 0;
    } catch {
      return 0;
    }
  };

  const deriveStatus = (estoque: number, estoqueMin: number) => {
    if (estoque === 0) return "sem_estoque";
    if (estoque <= estoqueMin) return "baixo_estoque";
    return "ativo";
  };

  const filteredProdutos = items.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === "Todas" || produto.categoria === filterCategoria;
    const matchesStatus = filterStatus === "all" || produto.status === filterStatus;
    
    return matchesSearch && matchesCategoria && matchesStatus;
  });

  const toFormDefaults = (p: any) => ({
    nome: p?.nome ?? "",
    codigo: "",
    categoria: p?.categoria ?? "",
    preco: p ? parseCurrency(p.preco) : 0,
    estoque: p?.estoque ?? 0,
    estoqueMinimo: p?.estoqueMin ?? 5,
    descricao: "",
    status: "Ativo" as const,
    promocao: false,
    precoPromocional: 0,
    tags: [],
  });

  const handleCreate = (data: any) => {
    const novo = {
      id: String(Date.now()),
      nome: data.nome,
      categoria: data.categoria,
      preco: formatCurrency(Number(data.preco || 0)),
      estoque: Number(data.estoque || 0),
      estoqueMin: Number(data.estoqueMinimo || 0),
      status: deriveStatus(Number(data.estoque || 0), Number(data.estoqueMinimo || 0)),
      vendas: 0,
      lucro: formatCurrency(0),
    };
    setItems((prev) => [novo, ...prev]);
    setIsCreateOpen(false);
  };

  const handleUpdate = (data: any) => {
    if (!editing) return;
    setItems((prev) =>
      prev.map((p) =>
        p.id === editing.id
          ? {
              ...p,
              nome: data.nome,
              categoria: data.categoria,
              preco: formatCurrency(Number(data.preco || 0)),
              estoque: Number(data.estoque || 0),
              estoqueMin: Number(data.estoqueMinimo || 0),
              status: deriveStatus(Number(data.estoque || 0), Number(data.estoqueMinimo || 0)),
            }
          : p
      )
    );
    setEditing(null);
  };

  const getStatusBadge = (produto: any) => {
    if (produto.estoque === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>;
    }
    if (produto.estoque <= produto.estoqueMin) {
      return <Badge variant="secondary" className="bg-warning/10 text-warning">Baixo Estoque</Badge>;
    }
    return <Badge variant="default">Disponível</Badge>;
  };

  const produtosAtivos = items.filter(p => p.status === "ativo").length;
  const produtosBaixoEstoque = items.filter(p => p.estoque <= p.estoqueMin && p.estoque > 0).length;
  const produtosSemEstoque = items.filter(p => p.estoque === 0).length;
  const valorTotalEstoque = items.reduce((acc, p) => acc + (p.estoque * parseCurrency(p.preco)), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie seu catálogo de produtos
          </p>
        </div>
        <Button className="btn-primary-gradient" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
          </DialogHeader>
          <ProdutoForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProdutoForm
              produto={{ id: 1, ...toFormDefaults(editing) } as any}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produtos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">
              {produtosAtivos} ativos
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baixo Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{produtosBaixoEstoque}</div>
            <p className="text-xs text-muted-foreground">
              Necessitam reposição
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{produtosSemEstoque}</div>
            <p className="text-xs text-muted-foreground">
              Indisponíveis
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Estoque</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {valorTotalEstoque.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total investido
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
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Disponível</SelectItem>
                <SelectItem value="baixo_estoque">Baixo Estoque</SelectItem>
                <SelectItem value="sem_estoque">Sem Estoque</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle>Catálogo de Produtos</CardTitle>
          <CardDescription>
            Gerencie todos os produtos do seu estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vendas</TableHead>
                <TableHead>Lucro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{produto.categoria}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{produto.preco}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={
                        produto.estoque === 0 ? "text-destructive" :
                        produto.estoque <= produto.estoqueMin ? "text-warning" :
                        "text-foreground"
                      }>
                        {produto.estoque}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (min: {produto.estoqueMin})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(produto)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      <span>{produto.vendas}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-success font-medium">{produto.lucro}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(produto)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setItems((prev) => prev.filter((p) => p.id !== produto.id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}