import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreHorizontal,
  Clock,
  CheckCheck,
  AlertCircle,
  User,
  Bot
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  chat_id: string;
  sender: {
    id: string;
    name: string;
    type: 'customer' | 'agent' | 'bot';
    avatar?: string;
  };
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

interface ChatSession {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: 'online' | 'away' | 'offline';
  };
  agent?: {
    id: string;
    name: string;
  };
  status: 'waiting' | 'active' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  department: string;
  created_at: string;
  last_message_at: string;
  messages: ChatMessage[];
  unread_count: number;
  satisfaction_rating?: number;
}

export function LiveChat() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Mock chat sessions
    const mockSessions: ChatSession[] = [
      {
        id: "chat_001",
        customer: {
          id: "1",
          name: "João Silva",
          email: "joao@email.com",
          phone: "(11) 99999-9999",
          status: "online"
        },
        agent: {
          id: "agent1",
          name: "Ana Suporte"
        },
        status: "active",
        priority: "high",
        department: "Técnico",
        created_at: "2024-01-15T14:30:00Z",
        last_message_at: "2024-01-15T14:35:00Z",
        unread_count: 2,
        messages: [
          {
            id: "1",
            chat_id: "chat_001",
            sender: { id: "1", name: "João Silva", type: "customer" },
            content: "Olá, estou com problema no sistema PDV",
            type: "text",
            timestamp: "2024-01-15T14:30:00Z",
            read: true
          },
          {
            id: "2",
            chat_id: "chat_001",
            sender: { id: "agent1", name: "Ana Suporte", type: "agent" },
            content: "Olá João! Vou te ajudar com isso. Pode me descrever qual erro está aparecendo?",
            type: "text",
            timestamp: "2024-01-15T14:31:00Z",
            read: true
          },
          {
            id: "3",
            chat_id: "chat_001",
            sender: { id: "1", name: "João Silva", type: "customer" },
            content: "Quando tento abrir o caixa, aparece 'Erro de conexão'",
            type: "text",
            timestamp: "2024-01-15T14:35:00Z",
            read: false
          }
        ]
      },
      {
        id: "chat_002",
        customer: {
          id: "2",
          name: "Maria Santos",
          email: "maria@email.com",
          status: "away"
        },
        status: "waiting",
        priority: "medium",
        department: "Vendas",
        created_at: "2024-01-15T13:45:00Z",
        last_message_at: "2024-01-15T13:45:00Z",
        unread_count: 1,
        messages: [
          {
            id: "4",
            chat_id: "chat_002",
            sender: { id: "2", name: "Maria Santos", type: "customer" },
            content: "Preciso de ajuda para configurar desconto por quantidade",
            type: "text",
            timestamp: "2024-01-15T13:45:00Z",
            read: false
          }
        ]
      }
    ];
    
    setChatSessions(mockSessions);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  const sendMessage = () => {
    if (!selectedChat || !newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      chat_id: selectedChat.id,
      sender: { id: "agent1", name: "Ana Suporte", type: "agent" },
      content: newMessage,
      type: "text",
      timestamp: new Date().toISOString(),
      read: true
    };
    
    setChatSessions(prev => prev.map(session => 
      session.id === selectedChat.id 
        ? { 
            ...session, 
            messages: [...session.messages, message],
            last_message_at: new Date().toISOString()
          }
        : session
    ));
    
    setNewMessage("");
    
    // Simular resposta automática do bot
    setTimeout(() => {
      if (newMessage.toLowerCase().includes("obrigado")) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          chat_id: selectedChat.id,
          sender: { id: "bot", name: "Assistente Virtual", type: "bot" },
          content: "De nada! Fico feliz em ajudar. Há mais alguma coisa que posso fazer por você?",
          type: "text",
          timestamp: new Date().toISOString(),
          read: true
        };
        
        setChatSessions(prev => prev.map(session => 
          session.id === selectedChat.id 
            ? { ...session, messages: [...session.messages, botMessage] }
            : session
        ));
      }
    }, 1000);
  };

  const getStatusBadge = (status: ChatSession['status']) => {
    const variants = {
      waiting: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      resolved: 'bg-blue-100 text-blue-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      waiting: 'Aguardando',
      active: 'Ativo',
      resolved: 'Resolvido',
      closed: 'Fechado'
    };
    
    return <Badge className={variants[status]}>{labels[status]}</Badge>;
  };

  const getCustomerStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'away':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours > 0) {
      return `${diffHours}h`;
    } else if (diffMins > 0) {
      return `${diffMins}min`;
    } else {
      return 'agora';
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Lista de Chats */}
      <div className="w-1/3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat ao Vivo
              <Badge variant="secondary">
                {chatSessions.filter(s => s.status === 'active').length} ativo(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <Card 
                    key={session.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedChat?.id === session.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedChat(session)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {session.customer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {session.customer.name}
                                </span>
                                {getCustomerStatusIcon(session.customer.status)}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {session.department}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1">
                            {getStatusBadge(session.status)}
                            {session.unread_count > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {session.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          <p className="line-clamp-2">
                            {session.messages[session.messages.length - 1]?.content}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span>{getTimeAgo(session.last_message_at)}</span>
                            {session.agent && (
                              <span>Atendido por {session.agent.name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Ativo */}
      <div className="flex-1">
        {selectedChat ? (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedChat.customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedChat.customer.name}</span>
                      {getCustomerStatusIcon(selectedChat.customer.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat.customer.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Mensagens */}
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {selectedChat.messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${
                      message.sender.type === 'agent' ? 'flex-row-reverse' : ''
                    }`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={
                          message.sender.type === 'customer' 
                            ? 'bg-blue-100 text-blue-600'
                            : message.sender.type === 'bot'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-green-100 text-green-600'
                        }>
                          {message.sender.type === 'bot' ? (
                            <Bot className="h-4 w-4" />
                          ) : (
                            message.sender.name.charAt(0)
                          )}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`flex-1 max-w-[70%] ${
                        message.sender.type === 'agent' ? 'text-right' : ''
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{message.sender.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.read && message.sender.type === 'agent' && (
                            <CheckCheck className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        
                        <div className={`p-3 rounded-lg ${
                          message.sender.type === 'customer' 
                            ? 'bg-muted'
                            : message.sender.type === 'bot'
                            ? 'bg-purple-50 border border-purple-200'
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {selectedChat.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <Separator className="my-4" />
              
              {/* Input de Mensagem */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Paperclip className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Smile className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Respostas Rápidas */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    "Olá! Como posso ajudar?",
                    "Vou verificar isso para você",
                    "Pode me enviar uma captura de tela?",
                    "Problema resolvido!"
                  ].map((quickReply) => (
                    <Button
                      key={quickReply}
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMessage(quickReply)}
                      className="text-xs"
                    >
                      {quickReply}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecione um chat</h3>
                <p className="text-muted-foreground">
                  Escolha uma conversa da lista para começar o atendimento
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}