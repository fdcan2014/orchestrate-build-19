import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  QrCode, 
  Wallet,
  Calculator,
  Check,
  AlertCircle
} from "lucide-react";
import { PaymentMethod, PaymentSplit } from "@/types/pdv";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodsProps {
  total: number;
  onPaymentComplete: (payments: PaymentSplit[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentMethods({ total, onPaymentComplete, isOpen, onClose }: PaymentMethodsProps) {
  const [payments, setPayments] = useState<PaymentSplit[]>([]);
  const [currentPayment, setCurrentPayment] = useState<Partial<PaymentSplit>>({
    method: 'money',
    amount: total
  });
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [installments, setInstallments] = useState(1);
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    { id: 'money', name: 'Dinheiro', icon: Banknote, color: 'bg-green-500' },
    { id: 'credit_card', name: 'Cartão de Crédito', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'debit_card', name: 'Cartão de Débito', icon: CreditCard, color: 'bg-purple-500' },
    { id: 'pix', name: 'PIX', icon: QrCode, color: 'bg-orange-500' },
    { id: 'digital_wallet', name: 'Carteira Digital', icon: Wallet, color: 'bg-pink-500' },
  ];

  const getRemainingAmount = () => {
    const paid = payments.reduce((sum, p) => sum + p.amount, 0);
    return total - paid;
  };

  const addPayment = () => {
    if (!currentPayment.method || !currentPayment.amount || currentPayment.amount <= 0) {
      toast({
        title: "Dados inválidos",
        description: "Selecione um método e valor válido",
        variant: "destructive",
      });
      return;
    }

    const remaining = getRemainingAmount();
    if (currentPayment.amount > remaining) {
      toast({
        title: "Valor excede o restante",
        description: `Valor máximo: R$ ${remaining.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    const payment: PaymentSplit = {
      id: Date.now().toString(),
      method: currentPayment.method as PaymentMethod['id'],
      amount: currentPayment.amount,
      installments: currentPayment.method === 'credit_card' ? installments : 1,
      reference: currentPayment.reference || '',
    };

    setPayments(prev => [...prev, payment]);
    setCurrentPayment({
      method: 'money',
      amount: remaining - currentPayment.amount
    });
    setInstallments(1);
  };

  const removePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const calculateChange = () => {
    const moneyPayments = payments.filter(p => p.method === 'money');
    const totalMoney = moneyPayments.reduce((sum, p) => sum + p.amount, 0);
    return cashReceived - totalMoney;
  };

  const canFinalize = () => {
    const remaining = getRemainingAmount();
    const hasMoneyPayment = payments.some(p => p.method === 'money');
    
    if (remaining > 0) return false;
    if (hasMoneyPayment && cashReceived === 0) return false;
    
    return true;
  };

  const finalizePayment = () => {
    if (!canFinalize()) return;

    onPaymentComplete(payments);
    
    toast({
      title: "Pagamento processado!",
      description: `Total: R$ ${total.toFixed(2)}`,
    });

    // Reset state
    setPayments([]);
    setCurrentPayment({ method: 'money', amount: total });
    setCashReceived(0);
    setInstallments(1);
    onClose();
  };

  const getMethodInfo = (methodId: string) => {
    return paymentMethods.find(m => m.id === methodId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Formas de Pagamento - R$ {total.toFixed(2)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Adicionar Pagamento */}
          <div className="space-y-4">
            <h3 className="font-semibold">Adicionar Pagamento</h3>
            
            {/* Métodos de Pagamento */}
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant={currentPayment.method === method.id ? "default" : "outline"}
                    className="h-auto p-3 flex-col gap-1"
                    onClick={() => setCurrentPayment(prev => ({ 
                      ...prev, 
                      method: method.id,
                      amount: getRemainingAmount()
                    }))}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-xs">{method.name}</span>
                  </Button>
                );
              })}
            </div>

            {/* Valor */}
            <div>
              <label className="text-sm font-medium">Valor</label>
              <Input
                type="number"
                step="0.01"
                value={currentPayment.amount || ''}
                onChange={(e) => setCurrentPayment(prev => ({ 
                  ...prev, 
                  amount: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.00"
              />
            </div>

            {/* Parcelas (apenas cartão de crédito) */}
            {currentPayment.method === 'credit_card' && (
              <div>
                <label className="text-sm font-medium">Parcelas</label>
                <Select 
                  value={installments.toString()} 
                  onValueChange={(value) => setInstallments(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 10, 12].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}x de R$ {((currentPayment.amount || 0) / num).toFixed(2)}
                        {num > 1 && ' (com juros)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Referência */}
            <div>
              <label className="text-sm font-medium">Referência (opcional)</label>
              <Input
                value={currentPayment.reference || ''}
                onChange={(e) => setCurrentPayment(prev => ({ 
                  ...prev, 
                  reference: e.target.value 
                }))}
                placeholder="NSU, comprovante, etc..."
              />
            </div>

            <Button 
              onClick={addPayment}
              disabled={!currentPayment.amount || getRemainingAmount() === 0}
              className="w-full"
            >
              Adicionar Pagamento
            </Button>

            {/* Dinheiro Recebido */}
            {payments.some(p => p.method === 'money') && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <label className="text-sm font-medium text-green-800">
                  Dinheiro Recebido
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                  placeholder="Valor recebido em dinheiro"
                  className="mt-1"
                />
                {calculateChange() > 0 && (
                  <p className="text-sm text-green-700 mt-1">
                    <strong>Troco: R$ {calculateChange().toFixed(2)}</strong>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Resumo de Pagamentos */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resumo de Pagamentos</h3>
            
            <Card>
              <CardContent className="p-4 space-y-3">
                {payments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum pagamento adicionado
                  </p>
                ) : (
                  payments.map((payment) => {
                    const method = getMethodInfo(payment.method);
                    if (!method) return null;
                    
                    const IconComponent = method.icon;
                    
                    return (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-full ${method.color} bg-opacity-20`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{method.name}</p>
                            {payment.installments > 1 && (
                              <p className="text-xs text-muted-foreground">
                                {payment.installments}x parcelas
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            R$ {payment.amount.toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removePayment(payment.id)}
                            className="h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total da Venda:</span>
                    <span className="font-bold">R$ {total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Total Pago:</span>
                    <span>R$ {(total - getRemainingAmount()).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Restante:</span>
                    <span className={getRemainingAmount() > 0 ? 'text-red-600' : 'text-green-600'}>
                      R$ {getRemainingAmount().toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <div className="flex items-center gap-2">
              {canFinalize() ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Pronto para finalizar</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-600">
                    {getRemainingAmount() > 0 
                      ? "Valor pendente" 
                      : "Informe o dinheiro recebido"
                    }
                  </span>
                </>
              )}
            </div>

            {/* Finalizar */}
            <div className="flex gap-2">
              <Button
                onClick={finalizePayment}
                disabled={!canFinalize()}
                className="flex-1"
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Finalizar Venda
              </Button>
              
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}