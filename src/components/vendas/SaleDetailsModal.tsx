import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Package, 
  DollarSign,
  Eye,
  Printer,
  Download
} from "lucide-react";

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Sale {
  id: string;
  cliente: string;
  loja: string;
  vendedor: string;
  valor: string;
  status: string;
  data: string;
  itens: number;
  formaPagamento: string;
}

interface SaleDetailsModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SaleDetailsModal({ sale, isOpen, onClose }: SaleDetailsModalProps) {
  if (!sale) return null;

  // Mock detailed sale data - em produção viria do Supabase
  const saleItems: SaleItem[] = [
    { id: "1", name: "Smartphone Samsung Galaxy S24", quantity: 1, price: 2899.99, total: 2899.99 },
    { id: "2", name: "Capinha de Proteção", quantity: 2, price: 49.90, total: 99.80 },
    { id: "3", name: "Carregador Portátil", quantity: 1, price: 89.90, total: 89.90 },
  ];

  const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
  const discount = 50.00;
  const taxes = subtotal * 0.05;
  const total = subtotal - discount + taxes;

  const statusColors = {
    concluida: "bg-green-100 text-green-800",
    pendente: "bg-yellow-100 text-yellow-800", 
    cancelada: "bg-red-100 text-red-800"
  };

  const statusLabels = {
    concluida: "Concluída",
    pendente: "Pendente",
    cancelada: "Cancelada"
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR") + " às " + date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Detalhes da Venda {sale.id}
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre a venda realizada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Ações */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className={statusColors[sale.status as keyof typeof statusColors]}
            >
              {statusLabels[sale.status as keyof typeof statusLabels]}
            </Badge>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>

          {/* Informações Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{sale.cliente}</p>
                  <p className="text-sm text-muted-foreground">cliente@email.com</p>
                  <p className="text-sm text-muted-foreground">(11) 99999-9999</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Informações da Venda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Loja</p>
                    <p className="font-medium">{sale.loja}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vendedor</p>
                    <p className="font-medium">{sale.vendedor}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data/Hora</p>
                    <p className="font-medium">{formatDate(sale.data)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pagamento</p>
                    <p className="font-medium">{sale.formaPagamento}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Itens da Venda */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-4 w-4" />
                Itens da Venda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {saleItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {item.quantity} × R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {item.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto:</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Impostos (5%):</span>
                  <span>R$ {taxes.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          {sale.status === 'pendente' && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Status: Aguardando Pagamento</span>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  Esta venda está pendente de confirmação de pagamento. Entre em contato com o cliente para finalizar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}