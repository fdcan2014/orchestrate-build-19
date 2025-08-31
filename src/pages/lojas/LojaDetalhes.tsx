import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Minus, Heart, Star, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Dados de exemplo de produtos para a loja
const produtos = [
  {
    id: 1,
    nome: "Espátula Plástica Ponta Fina CRT-868 Preta",
    preco: 4.90,
    precoOriginal: 6.86,
    desconto: "29%",
    imagem: "🔧",
    categoria: "Ferramentas",
    estoque: 15,
    favorito: false,
    avaliacoes: 4.5,
    totalAvaliacoes: 12
  },
  {
    id: 2,
    nome: "Espátula Flexível Spudger Qianli 0.1mm",
    preco: 12.90,
    precoOriginal: 22.28,
    desconto: "42%",
    imagem: "🛠️",
    categoria: "Ferramentas",
    estoque: 8,
    favorito: true,
    avaliacoes: 4.8,
    totalAvaliacoes: 25
  },
  {
    id: 3,
    nome: "Pincel Antiestático Para Limpeza Sunshine SS 022B",
    preco: 22.90,
    precoOriginal: 31.76,
    desconto: "28%",
    imagem: "🖌️",
    categoria: "Limpeza",
    estoque: 20,
    favorito: false,
    avaliacoes: 4.3,
    totalAvaliacoes: 18
  },
  {
    id: 4,
    nome: "Chave Phillips Magnética Professional",
    preco: 18.50,
    precoOriginal: 24.90,
    desconto: "26%",
    imagem: "🔩",
    categoria: "Ferramentas",
    estoque: 12,
    favorito: false,
    avaliacoes: 4.7,
    totalAvaliacoes: 33
  },
  {
    id: 5,
    nome: "Kit Ventosas para Tela LCD",
    preco: 35.90,
    precoOriginal: 45.00,
    desconto: "20%",
    imagem: "🔴",
    categoria: "Acessórios",
    estoque: 6,
    favorito: true,
    avaliacoes: 4.6,
    totalAvaliacoes: 41
  },
  {
    id: 6,
    nome: "Fita Dupla Face 3M Transparente",
    preco: 8.90,
    precoOriginal: 12.50,
    desconto: "29%",
    imagem: "📏",
    categoria: "Adesivos",
    estoque: 25,
    favorito: false,
    avaliacoes: 4.4,
    totalAvaliacoes: 16
  }
];

export default function LojaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [carrinho, setCarrinho] = useState<{[key: number]: number}>({});
  const [favoritos, setFavoritos] = useState<number[]>([2, 5]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busca, setBusca] = useState("");

  // Mock da loja (normalmente viria do hook useStores)
  const loja = {
    id: id || "1",
    nome: "Loja Centro Técnico",
    endereco: "Rua das Flores, 123 - Centro",
    status: "Ativa"
  };

  const produtosFiltrados = produtos.filter(produto => {
    const matchesBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
    const matchesCategoria = !filtroCategoria || produto.categoria === filtroCategoria;
    return matchesBusca && matchesCategoria;
  });

  const adicionarAoCarrinho = (produtoId: number) => {
    setCarrinho(prev => ({
      ...prev,
      [produtoId]: (prev[produtoId] || 0) + 1
    }));
    toast({
      title: "Produto adicionado",
      description: "Item adicionado ao carrinho com sucesso!",
    });
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho(prev => {
      const newCart = { ...prev };
      if (newCart[produtoId] > 1) {
        newCart[produtoId]--;
      } else {
        delete newCart[produtoId];
      }
      return newCart;
    });
  };

  const toggleFavorito = (produtoId: number) => {
    setFavoritos(prev => 
      prev.includes(produtoId) 
        ? prev.filter(id => id !== produtoId)
        : [...prev, produtoId]
    );
  };

  const totalItensCarrinho = Object.values(carrinho).reduce((sum, qty) => sum + qty, 0);
  const valorTotalCarrinho = Object.entries(carrinho).reduce((sum, [id, qty]) => {
    const produto = produtos.find(p => p.id === parseInt(id));
    return sum + (produto?.preco || 0) * qty;
  }, 0);

  const categorias = [...new Set(produtos.map(p => p.categoria))];

  return (
    <div className="space-y-6">
      {/* Header da Loja */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/lojas")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar às Lojas
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{loja.nome}</h1>
            <p className="text-muted-foreground">{loja.endereco}</p>
          </div>
        </div>
        
        {/* Carrinho */}
        <div className="flex items-center gap-4">
          <Button variant="outline" className="relative">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Carrinho
            {totalItensCarrinho > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {totalItensCarrinho}
              </Badge>
            )}
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-bold text-lg">R$ {valorTotalCarrinho.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map(categoria => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          {produtosFiltrados.length} produto(s) encontrado(s)
        </p>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {produtosFiltrados.map((produto) => (
          <Card key={produto.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="mb-2">
                  {produto.categoria}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorito(produto.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favoritos.includes(produto.id)
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
              </div>
              
              {/* Imagem do Produto */}
              <div className="flex justify-center items-center h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4">
                <span className="text-4xl">{produto.imagem}</span>
              </div>
              
              <h3 className="font-semibold text-sm leading-tight h-10 overflow-hidden">
                {produto.nome}
              </h3>
              
              {/* Avaliações */}
              <div className="flex items-center gap-1 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(produto.avaliacoes)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({produto.totalAvaliacoes})
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Preços */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs px-2">
                    -{produto.desconto}
                  </Badge>
                  <span className="text-xs text-muted-foreground line-through">
                    R$ {produto.precoOriginal.toFixed(2)}
                  </span>
                </div>
                <div className="text-xl font-bold text-green-600">
                  R$ {produto.preco.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Em estoque: {produto.estoque} unidades
                </p>
              </div>
              
              {/* Controles do Carrinho */}
              {carrinho[produto.id] ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removerDoCarrinho(produto.id)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="font-medium px-2">
                      {carrinho[produto.id]}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adicionarAoCarrinho(produto.id)}
                      disabled={carrinho[produto.id] >= produto.estoque}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => adicionarAoCarrinho(produto.id)}
                  disabled={produto.estoque === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {produto.estoque === 0 ? "Sem Estoque" : "Comprar"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {produtosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Nenhum produto encontrado com os filtros aplicados
          </p>
        </div>
      )}
    </div>
  );
}