import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Settings, 
  DollarSign, 
  Clock, 
  TrendingUp,
  CreditCard,
  Receipt,
  BarChart3,
  Calculator,
  HelpCircle,
  Monitor,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Componentes especializados
import { ProductSearch } from "@/components/pdv/ProductSearch";
import { ShoppingCart } from "@/components/pdv/ShoppingCart";
import { CustomerInfo } from "@/components/pdv/CustomerInfo";
import { PaymentMethods } from "@/components/pdv/PaymentMethods";
import { CashRegisterManager } from "@/components/pdv/CashRegisterManager";
import { KeyboardShortcuts } from "@/components/pdv/KeyboardShortcuts";
import { IntegrationsManager } from "@/components/pdv/IntegrationsManager";

// Types
import { Product, CartItem, Customer, PaymentSplit, ProductVariation } from "@/types/pdv";

export default function PdvPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [cashRegisterOpen, setCashRegisterOpen] = useState(true);
  const { toast } = useToast();

  // Estatísticas do dia (mock)
  const dailyStats = {
    sales: 45,
    revenue: 2850.50,
    transactions: 52,
    averageTicket: 54.82
  };

  const addToCart = (product: Product, variations?: ProductVariation[], quantity: number = 1) => {
    // Calcular preço com variações
    let finalPrice = product.price;
    if (variations) {
      variations.forEach(variation => {
        finalPrice += variation.price_adjustment;
      });
    }

    // Criar item do carrinho
    const cartItem: CartItem = {
      ...product,
      quantity: quantity,
      price: finalPrice,
      selected_variations: variations,
      notes: "",
      fractional_quantity: product.is_fractional ? quantity : undefined,
      fractional_unit: product.is_fractional ? product.unit : undefined,
    };

    setCart(prevCart => {
      // Para produtos com variações, sempre adicionar novo item
      if (product.type === 'variable' && variations) {
        return [...prevCart, cartItem];
      }

      // Para produtos simples, verificar se já existe
      const existingItem = prevCart.find(item => 
        item.id === product.id && !item.selected_variations
      );
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (product.manage_stock && newQuantity > product.stock) {
          toast({
            title: "Estoque insuficiente",
            description: `Apenas ${product.stock} unidades disponíveis`,
            variant: "destructive",
          });
          return prevCart;
        }
        
        return prevCart.map(item =>
          item.id === product.id && !item.selected_variations
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      return [...prevCart, cartItem];
    });

    toast({
      title: "Produto adicionado",
      description: `${product.name}${variations ? ' (com variações)' : ''} foi adicionado ao carrinho`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast({
      title: "Produto removido",
      description: "Item removido do carrinho",
    });
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) {
            return null;
          }
          if (newQuantity > item.stock) {
            toast({
              title: "Estoque insuficiente",
              description: `Apenas ${item.stock} unidades disponíveis`,
              variant: "destructive",
            });
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const updateItemNotes = (productId: string, notes: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, notes } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos",
    });
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getSubTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getTaxes = () => getSubTotal() * 0.05;
  const getDiscount = () => 0;
  const getTotalPrice = () => getSubTotal() + getTaxes() - getDiscount();

  const handlePaymentComplete = (payments: PaymentSplit[]) => {
    // Processar venda
    const saleData = {
      items: cart,
      customer,
      payments,
      subtotal: getSubTotal(),
      taxes: getTaxes(),
      discount: getDiscount(),
      total: getTotalPrice(),
      timestamp: new Date().toISOString()
    };

    console.log('Venda processada:', saleData);

    // Atualizar pontos de fidelidade se houver cliente
    if (customer) {
      const newPoints = Math.floor(getTotalPrice() / 10); // 1 ponto a cada R$ 10
      toast({
        title: "Pontos de fidelidade!",
        description: `${customer.name} ganhou ${newPoints} pontos`,
      });
    }

    // Limpar carrinho
    setCart([]);
    setCustomer(null);
    setSearchTerm("");
    
    toast({
      title: "Venda finalizada com sucesso!",
      description: `Total: R$ ${getTotalPrice().toFixed(2)}`,
    });
  };

  const startPayment = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho para finalizar a venda",
        variant: "destructive",
      });
      return;
    }

    if (!cashRegisterOpen) {
      toast({
        title: "Caixa fechado",
        description: "Abra o caixa para processar vendas",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  return (
    <div className="h-full space-y-6">
      {/* Header com Status e Estatísticas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">PDV - Sistema Completo</h1>
          <Badge variant={cashRegisterOpen ? "default" : "destructive"}>
            {cashRegisterOpen ? "Caixa Aberto" : "Caixa Fechado"}
          </Badge>
        </div>
        
        {/* Estatísticas Rápidas */}
        <div className="flex gap-4">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Vendas Hoje</p>
                <p className="font-semibold">R$ {dailyStats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Transações</p>
                <p className="font-semibold">{dailyStats.transactions}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Ticket Médio</p>
                <p className="font-semibold">R$ {dailyStats.averageTicket.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Button variant="outline" size="sm" onClick={() => setShowIntegrations(true)}>
            <Zap className="h-4 w-4 mr-2" />
            Integrações
          </Button>

          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowHelp(true)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Ajuda (F12)
          </Button>
        </div>
      </div>

      <div className="flex gap-6 h-full">
        {/* Painel Principal - Produtos */}
        <div className="flex-1 space-y-4">
          <ProductSearch
            onAddToCart={addToCart}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Painel Lateral - Carrinho e Cliente */}
        <div className="w-96 space-y-4 flex flex-col">
          {/* Gerenciador de Caixa */}
          <CashRegisterManager
            isOpen={cashRegisterOpen}
            onToggle={setCashRegisterOpen}
          />

          {/* Informações do Cliente */}
          <CustomerInfo
            customer={customer}
            onCustomerChange={setCustomer}
          />

          {/* Carrinho */}
          <div className="flex-1">
            <ShoppingCart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
              onUpdateNotes={updateItemNotes}
              onClearCart={clearCart}
            />
          </div>

          {/* Botão de Finalização */}
          <div className="space-y-2">
            {cart.length > 0 && (
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Final:</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getTotalItems()} itens • Impostos inclusos
                </p>
                {customer && (
                  <p className="text-xs text-primary mt-1">
                    💎 {Math.floor(getTotalPrice() / 10)} pontos para {customer.name}
                  </p>
                )}
              </div>
            )}
            
            <Button
              onClick={startPayment}
              className="w-full"
              size="lg"
              disabled={cart.length === 0 || !cashRegisterOpen}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Processar Pagamento (F2)
            </Button>
            
            {!cashRegisterOpen && (
              <p className="text-xs text-center text-destructive">
                ⚠️ Abra o caixa para processar vendas
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      <PaymentMethods
        total={getTotalPrice()}
        onPaymentComplete={handlePaymentComplete}
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
      />

      {/* Atalhos de Teclado */}
      <KeyboardShortcuts
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        onSearchFocus={() => {
          // Focar no input de busca
          const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
          searchInput?.focus();
        }}
        onPayment={() => startPayment()}
        onClearCart={clearCart}
      />

      {/* Integrações Externas */}
      <IntegrationsManager
        isOpen={showIntegrations}
        onClose={() => setShowIntegrations(false)}
      />
    </div>
  );
}