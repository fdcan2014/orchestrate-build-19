import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Search, Phone, Mail, MapPin, Star, Gift, Plus } from "lucide-react";
import { Customer } from "@/types/pdv";
import { useToast } from "@/hooks/use-toast";

interface CustomerInfoProps {
  customer: Customer | null;
  onCustomerChange: (customer: Customer | null) => void;
}

export function CustomerInfo({ customer, onCustomerChange }: CustomerInfoProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const { toast } = useToast();

  // Mock customers - em produção viria do Supabase
  const mockCustomers: Customer[] = [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      document: "123.456.789-00",
      address: "Rua das Flores, 123",
      loyaltyPoints: 1250,
      totalPurchases: 15,
      lastPurchase: "2024-01-20",
      birthday: "1985-05-15"
    },
    {
      id: "2", 
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      document: "987.654.321-00",
      address: "Av. Principal, 456",
      loyaltyPoints: 850,
      totalPurchases: 8,
      lastPurchase: "2024-01-18",
      birthday: "1990-12-10"
    }
  ];

  useEffect(() => {
    setCustomers(mockCustomers);
  }, []);

  const searchCustomers = (term: string) => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(term.toLowerCase()) ||
      c.phone.includes(term) ||
      c.document?.includes(term) ||
      c.email.toLowerCase().includes(term.toLowerCase())
    );
  };

  const selectCustomer = (selectedCustomer: Customer) => {
    onCustomerChange(selectedCustomer);
    setShowSearch(false);
    setSearchTerm("");
    
    toast({
      title: "Cliente selecionado",
      description: `${selectedCustomer.name} adicionado à venda`,
    });
  };

  const createNewCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email || "",
      document: newCustomer.document || "",
      address: newCustomer.address || "",
      loyaltyPoints: 0,
      totalPurchases: 0,
      lastPurchase: "",
      birthday: newCustomer.birthday || ""
    };

    setCustomers(prev => [...prev, customer]);
    selectCustomer(customer);
    setNewCustomer({});
    setShowNewCustomerForm(false);
    
    toast({
      title: "Cliente criado",
      description: "Novo cliente cadastrado com sucesso",
    });
  };

  const getLoyaltyBadge = (points: number) => {
    if (points >= 1000) return { label: "VIP", variant: "default" as const };
    if (points >= 500) return { label: "Gold", variant: "secondary" as const };
    return { label: "Silver", variant: "outline" as const };
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Cliente
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {!customer ? (
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar cliente...
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowNewCustomerForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo cliente
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{customer.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {customer.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <Badge {...getLoyaltyBadge(customer.loyaltyPoints)}>
                    {getLoyaltyBadge(customer.loyaltyPoints).label}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {customer.loyaltyPoints} pontos
                  </p>
                </div>
              </div>

              {/* Estatísticas do Cliente */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/50 p-2 rounded">
                  <p className="text-muted-foreground">Compras</p>
                  <p className="font-semibold">{customer.totalPurchases}</p>
                </div>
                <div className="bg-muted/50 p-2 rounded">
                  <p className="text-muted-foreground">Última</p>
                  <p className="font-semibold">
                    {customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : "Nunca"}
                  </p>
                </div>
              </div>

              {/* Programa de Fidelidade */}
              {customer.loyaltyPoints > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-2 rounded border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Fidelidade Ativa
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    A cada R$ 10 = 1 ponto. 100 pontos = R$ 10 de desconto
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSearch(true)}
                  className="flex-1"
                >
                  Trocar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCustomerChange(null)}
                  className="flex-1"
                >
                  Remover
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Busca de Clientes */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buscar Cliente</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nome, telefone, CPF ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {searchCustomers(searchTerm).map((c) => (
                <div
                  key={c.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                  onClick={() => selectCustomer(c)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{c.name}</h4>
                      <p className="text-sm text-muted-foreground">{c.phone}</p>
                      {c.email && (
                        <p className="text-sm text-muted-foreground">{c.email}</p>
                      )}
                    </div>
                    <Badge {...getLoyaltyBadge(c.loyaltyPoints)}>
                      {c.loyaltyPoints} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Novo Cliente */}
      <Dialog open={showNewCustomerForm} onOpenChange={setShowNewCustomerForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  value={newCustomer.name || ""}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Telefone *</label>
                <Input
                  value={newCustomer.phone || ""}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">CPF</label>
                <Input
                  value={newCustomer.document || ""}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, document: e.target.value }))}
                  placeholder="123.456.789-00"
                />
              </div>
              
              <div className="col-span-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={newCustomer.email || ""}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="cliente@email.com"
                />
              </div>
              
              <div className="col-span-2">
                <label className="text-sm font-medium">Endereço</label>
                <Input
                  value={newCustomer.address || ""}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Rua, número, bairro"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={createNewCustomer} className="flex-1">
                Criar Cliente
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNewCustomerForm(false);
                  setNewCustomer({});
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}