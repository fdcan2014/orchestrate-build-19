import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Star,
  Tag,
  Clock,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  helpful_votes: number;
  not_helpful_votes: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  article_count: number;
}

export function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Mock data
    const mockCategories: Category[] = [
      { id: "1", name: "Primeiros Passos", description: "Guias básicos para começar", icon: "🚀", article_count: 5 },
      { id: "2", name: "PDV", description: "Sistema de ponto de venda", icon: "💳", article_count: 8 },
      { id: "3", name: "Estoque", description: "Gestão de produtos e estoque", icon: "📦", article_count: 6 },
      { id: "4", name: "Relatórios", description: "Como gerar e interpretar relatórios", icon: "📊", article_count: 4 },
      { id: "5", name: "Suporte Técnico", description: "Ordens de serviço e manutenção", icon: "🔧", article_count: 7 },
      { id: "6", name: "Integrações", description: "Conectar com outros sistemas", icon: "🔗", article_count: 3 }
    ];

    const mockArticles: Article[] = [
      {
        id: "1",
        title: "Como fazer seu primeiro login no sistema",
        content: `# Como fazer seu primeiro login

## Passo 1: Acesse o sistema
Abra seu navegador e digite o endereço fornecido pela nossa equipe.

## Passo 2: Digite suas credenciais
- Email: Use o email cadastrado
- Senha: Use a senha temporária enviada por email

## Passo 3: Altere sua senha
No primeiro login, você será solicitado a criar uma nova senha segura.

## Dicas de segurança:
- Use pelo menos 8 caracteres
- Inclua letras maiúsculas e minúsculas
- Adicione números e símbolos
- Não compartilhe sua senha`,
        summary: "Guia passo a passo para realizar o primeiro acesso ao sistema",
        category: "Primeiros Passos",
        tags: ["login", "primeiro-acesso", "senha"],
        author: "Equipe Suporte",
        status: "published",
        views: 1247,
        helpful_votes: 89,
        not_helpful_votes: 3,
        created_at: "2024-01-01T10:00:00Z",
        updated_at: "2024-01-10T15:30:00Z"
      },
      {
        id: "2",
        title: "Como processar uma venda no PDV",
        content: `# Como processar uma venda no PDV

## Preparação
1. Certifique-se de que o caixa está aberto
2. Verifique se há produtos em estoque

## Processo de venda
1. **Buscar produtos**: Use o campo de busca ou código de barras
2. **Adicionar ao carrinho**: Clique no produto ou use F2
3. **Ajustar quantidades**: Use os botões + e - 
4. **Adicionar cliente**: Opcional, mas recomendado para fidelidade
5. **Processar pagamento**: Clique em "Processar Pagamento" ou F2

## Formas de pagamento aceitas
- Dinheiro
- Cartão de crédito/débito
- PIX
- Carteira digital

## Dicas importantes
- Sempre confirme o valor com o cliente
- Verifique se o troco está correto
- Ofereça o cupom fiscal`,
        summary: "Tutorial completo para realizar vendas no sistema PDV",
        category: "PDV",
        tags: ["venda", "pdv", "pagamento", "tutorial"],
        author: "Equipe Suporte",
        status: "published",
        views: 892,
        helpful_votes: 76,
        not_helpful_votes: 2,
        created_at: "2024-01-02T10:00:00Z",
        updated_at: "2024-01-12T09:15:00Z"
      },
      {
        id: "3",
        title: "Gerenciando estoque de produtos",
        content: `# Gerenciamento de Estoque

## Visão Geral
O sistema oferece controle completo do estoque com alertas automáticos.

## Funcionalidades principais
- **Controle por loja**: Cada loja tem seu estoque independente
- **Alertas automáticos**: Notificações quando estoque está baixo
- **Movimentações**: Histórico completo de entradas e saídas
- **Transferências**: Mova produtos entre lojas

## Como ajustar estoque
1. Acesse "Produtos > Estoque"
2. Encontre o produto desejado
3. Clique em "Gerenciar"
4. Informe a nova quantidade e motivo
5. Confirme o ajuste

## Boas práticas
- Mantenha sempre o estoque mínimo configurado
- Faça inventários regulares
- Documente todos os ajustes`,
        summary: "Guia completo para gerenciar estoque de produtos",
        category: "Estoque",
        tags: ["estoque", "produtos", "inventário"],
        author: "Equipe Suporte",
        status: "published",
        views: 654,
        helpful_votes: 45,
        not_helpful_votes: 1,
        created_at: "2024-01-03T10:00:00Z",
        updated_at: "2024-01-08T14:20:00Z"
      }
    ];

    setCategories(mockCategories);
    setArticles(mockArticles);
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory && article.status === 'published';
  });

  const handleVote = (articleId: string, helpful: boolean) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { 
            ...article, 
            helpful_votes: helpful ? article.helpful_votes + 1 : article.helpful_votes,
            not_helpful_votes: !helpful ? article.not_helpful_votes + 1 : article.not_helpful_votes
          }
        : article
    ));
    
    toast({
      title: "Obrigado pelo feedback!",
      description: helpful ? "Marcado como útil" : "Vamos melhorar este artigo",
    });
  };

  const saveArticle = () => {
    if (!newArticle.title || !newArticle.content) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && selectedArticle) {
      setArticles(prev => prev.map(article => 
        article.id === selectedArticle.id 
          ? { ...article, ...newArticle, updated_at: new Date().toISOString() }
          : article
      ));
      toast({
        title: "Artigo atualizado",
        description: "O artigo foi atualizado com sucesso",
      });
    } else {
      const article: Article = {
        id: Date.now().toString(),
        title: newArticle.title!,
        content: newArticle.content!,
        summary: newArticle.summary || '',
        category: newArticle.category || 'Geral',
        tags: newArticle.tags || [],
        author: "Equipe Suporte",
        status: 'published',
        views: 0,
        helpful_votes: 0,
        not_helpful_votes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setArticles(prev => [article, ...prev]);
      toast({
        title: "Artigo criado",
        description: "Novo artigo adicionado à base de conhecimento",
      });
    }
    
    setShowArticleModal(false);
    setNewArticle({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Base de Conhecimento</h1>
          <p className="text-muted-foreground">
            Artigos e tutoriais para ajudar usuários e equipe
          </p>
        </div>
        <Button onClick={() => { setIsEditing(false); setNewArticle({}); setShowArticleModal(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Artigos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">
              {articles.filter(a => a.status === 'published').length} publicados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.reduce((sum, a) => sum + a.views, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de visualizações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Positivas</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {articles.reduce((sum, a) => sum + a.helpful_votes, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Artigos marcados como úteis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Categorias organizadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Categorias */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("all")}
                >
                  Todas as categorias
                </Button>
                
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span className="flex-1 text-left">{category.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {category.article_count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Artigos */}
        <div className="lg:col-span-3 space-y-4">
          {/* Busca */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar artigos, tags ou conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Artigos */}
          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.views} visualizações</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Atualizado {new Date(article.updated_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline">{article.category}</Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedArticle(article);
                              setArticles(prev => prev.map(a => 
                                a.id === article.id ? { ...a, views: a.views + 1 } : a
                              ));
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedArticle(article);
                              setNewArticle(article);
                              setIsEditing(true);
                              setShowArticleModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Avaliações */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(article.id, true)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {article.helpful_votes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(article.id, false)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          {article.not_helpful_votes}
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {Math.round((article.helpful_votes / (article.helpful_votes + article.not_helpful_votes)) * 100) || 0}% útil
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Visualização de Artigo */}
      <Dialog open={!!selectedArticle && !showArticleModal} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedArticle && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="outline">{selectedArticle.category}</Badge>
                <span>Por {selectedArticle.author}</span>
                <span>Atualizado em {new Date(selectedArticle.updated_at).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <Separator />
              
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, '<br>') }} />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Este artigo foi útil?</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote(selectedArticle.id, true)}
                    className="text-green-600"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Sim ({selectedArticle.helpful_votes})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote(selectedArticle.id, false)}
                    className="text-red-600"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Não ({selectedArticle.not_helpful_votes})
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewArticle(selectedArticle);
                      setIsEditing(true);
                      setShowArticleModal(true);
                      setSelectedArticle(null);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Criação/Edição */}
      <Dialog open={showArticleModal} onOpenChange={setShowArticleModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Artigo" : "Novo Artigo"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Título *</label>
                <Input
                  value={newArticle.title || ''}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título do artigo"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <Select 
                  value={newArticle.category || ''} 
                  onValueChange={(value) => setNewArticle(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Resumo</label>
              <Input
                value={newArticle.summary || ''}
                onChange={(e) => setNewArticle(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Breve descrição do artigo"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Tags (separadas por vírgula)</label>
              <Input
                value={newArticle.tags?.join(', ') || ''}
                onChange={(e) => setNewArticle(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                }))}
                placeholder="tutorial, pdv, estoque"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Conteúdo *</label>
              <Textarea
                value={newArticle.content || ''}
                onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Conteúdo do artigo em Markdown..."
                rows={15}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Você pode usar Markdown para formatação (# para títulos, ** para negrito, etc.)
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowArticleModal(false)}>
                Cancelar
              </Button>
              <Button onClick={saveArticle}>
                {isEditing ? "Atualizar" : "Criar"} Artigo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}