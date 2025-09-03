import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Send,
  Paperclip,
  Phone,
  Video,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  messages: TicketMessage[];
  satisfaction_rating?: number;
  resolution_time?: number;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  author: {
    id: string;
    name: string;
    type: 'customer' | 'agent' | 'system';
  };
  content: string;
  attachments?: string[];
  created_at: string;
  is_internal?: boolean;
}

export function TicketSystem() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    // Mock ticket data
    const mockTickets: Ticket[] = [
      {
        id: "TKT-001",
        title: "Problema com login no sistema",
        description: "Não consigo fazer login na minha conta há 2 dias",
        status: "open",
        priority: "high",
        category: "Acesso",
        customer: {
          id: "1",
          name: "João Silva",
          email: "joao@email.com",
          phone: "(11) 99999-9999"
        },
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        messages: [
          {
            id: "1",
            ticket_id: "TKT-001",
            author: { id: "1", name: "João Silva", type: "customer" },
            content: "Olá, estou com problemas para acessar minha conta. Quando tento fazer login, aparece uma mensagem de erro.",
            created_at: "2024-01-15T10:00:00Z"
          }
        ]
      },
      {
        id: "TKT-002",
        title: "Dúvida sobre funcionalidade",
        description: "Como configurar relatórios personalizados?",
        status: "in_progress",
        priority: "medium",
        category: "Dúvida",
        customer: {
          id: "2",
          name: "Maria Santos",
          email: "maria@email.com"
        },
        assigned_to: "Suporte Ana",
        created_at: "2024-01-14T15:30:00Z",
        updated_at: "2024-01-15T09:00:00Z",
        messages: [
          {
            id: "2",
            ticket_id: "TKT-002",
            author: { id: "2", name: "Maria Santos", type: "customer" },
            content: "Preciso de ajuda para configurar relatórios personalizados no sistema.",
            created_at: "2024-01-14T15:30:00Z"
          },
          {
            id: "3",
            ticket_id: "TKT-002",
            author: { id: "agent1", name: "Suporte Ana", type: "agent" },
            content: "Olá Maria! Vou te ajudar com isso. Você pode acessar os relatórios através do menu lateral...",
            created_at: "2024-01-15T09:00:00Z"
          }
        ]
      }
    ];
    
    setTickets(mockTickets);
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: Ticket['status']) => {
    const variants = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      waiting_customer: 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      open: 'Aberto',
      in_progress: 'Em Andamento',
      waiting_customer: 'Aguardando Cliente',
      resolved: 'Resolvido',
      closed: 'Fechado'
    };
    
    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Ticket['priority']) => {
    const variants = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente'
    };
    
    return (
      <Badge className={variants[priority]}>
        {labels[priority]}
      </Badge>
    );
  };

  const sendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return;
    
    const message: TicketMessage = {
      id: Date.now().toString(),
      ticket_id: selectedTicket.id,
      author: { id: "agent1", name: "Suporte", type: "agent" },
      content: newMessage,
      created_at: new Date().toISOString()
    };
    
    setTickets(prev => prev.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { ...ticket, messages: [...ticket.messages, message] }
        : ticket
    ));
    
    setNewMessage("");
    
    toast({
      title: "Mensagem enviada",
      description: "Sua resposta foi enviada ao cliente",
    });
  };

  const updateTicketStatus = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() }
        : ticket
    ));
    
    toast({
      title: "Status atualizado",
      description: "Status do ticket foi atualizado com sucesso",
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 24) {
      return `${Math.floor(diffHours / 24)} dia(s) atrás`;
    } else if (diffHours > 0) {
      return `${diffHours}h atrás`;
    } else if (diffMins > 0) {
      return `${diffMins}min atrás`;
    } else {
      return 'agora';
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Lista de Tickets */}
      <div className="w-1/3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Tickets de Suporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  placeholder="Buscar tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="open">Abertos</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="resolved">Resolvidos</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de Tickets */}
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredTickets.map((ticket) => (
                  <Card 
                    key={ticket.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTicket?.id === ticket.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm leading-tight">
                            {ticket.title}
                          </h4>
                          <div className="flex gap-1">
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{ticket.customer.name}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{getTimeAgo(ticket.updated_at)}</span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {ticket.description}
                        </p>
                        
                        {ticket.assigned_to && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-muted-foreground">Atribuído a:</span>
                            <span className="font-medium">{ticket.assigned_to}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes do Ticket */}
      <div className="flex-1">
        {selectedTicket ? (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedTicket.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ticket #{selectedTicket.id} • {selectedTicket.category}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Videochamada
                  </Button>
                  <Select 
                    value={selectedTicket.status} 
                    onValueChange={(value) => updateTicketStatus(selectedTicket.id, value as Ticket['status'])}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Aberto</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="waiting_customer">Aguardando Cliente</SelectItem>
                      <SelectItem value="resolved">Resolvido</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{selectedTicket.customer.name}</span>
                  <span>({selectedTicket.customer.email})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Criado {getTimeAgo(selectedTicket.created_at)}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex flex-col h-full">
              {/* Mensagens */}
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={
                          message.author.type === 'customer' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-green-100 text-green-600'
                        }>
                          {message.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.author.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {message.author.type === 'customer' ? 'Cliente' : 'Suporte'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(message.created_at)}
                          </span>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${
                          message.author.type === 'customer' 
                            ? 'bg-muted' 
                            : 'bg-primary/10'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {message.attachments.map((attachment, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Paperclip className="h-3 w-3 mr-1" />
                                {attachment}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Separator className="my-4" />
              
              {/* Resposta */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Digite sua resposta..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Anexar
                    </Button>
                    
                    <Select defaultValue="public">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Público</SelectItem>
                        <SelectItem value="internal">Interno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              </div>
              
              {/* Avaliação de Satisfação */}
              {selectedTicket.status === 'resolved' && !selectedTicket.satisfaction_rating && (
                <Card className="mt-4 bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-800">Solicitar Avaliação</h4>
                        <p className="text-sm text-green-600">
                          Envie uma pesquisa de satisfação para o cliente
                        </p>
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Star className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecione um ticket</h3>
                <p className="text-muted-foreground">
                  Escolha um ticket da lista para ver os detalhes e responder
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}