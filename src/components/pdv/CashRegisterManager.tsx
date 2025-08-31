import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  Lock, 
  Unlock, 
  Calculator, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock,
  User
} from "lucide-react";
import { CashRegister, CashTransaction } from "@/types/pdv";
import { useToast } from "@/hooks/use-toast";

interface CashRegisterManagerProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function CashRegisterManager({ isOpen, onToggle }: CashRegisterManagerProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState<'open' | 'close' | 'supply' | 'withdrawal'>('open');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [currentRegister, setCurrentRegister] = useState<CashRegister | null>(null);
  const { toast } = useToast();

  // Mock data - em produção viria do Supabase
  useEffect(() => {
    if (isOpen) {
      setCurrentRegister({
        id: "cash_001",
        name: "Caixa Principal",
        store_id: "store_001",
        initial_amount: 200.00,
        current_amount: 1850.75,
        opened_at: "2024-01-31T08:00:00Z",
        opened_by: "João Silva",
        status: 'open',
        transactions: [
          {
            id: "t001",
            type: 'sale',
            amount: 45.50,
            description: "Venda #001",
            timestamp: "2024-01-31T09:30:00Z",
            user: "João Silva"
          },
          {
            id: "t002",
            type: 'supply',
            amount: 500.00,
            description: "Suprimento para troco",
            timestamp: "2024-01-31T10:15:00Z",
            user: "Maria Santos"
          }
        ]
      });
    }
  }, [isOpen]);

  const openCashRegister = () => {
    if (amount < 0) {
      toast({
        title: "Valor inválido",
        description: "O valor inicial deve ser positivo",
        variant: "destructive",
      });
      return;
    }

    // Simular abertura do caixa
    onToggle(true);
    setShowDialog(false);
    setAmount(0);
    
    toast({
      title: "Caixa aberto!",
      description: `Valor inicial: R$ ${amount.toFixed(2)}`,
    });
  };

  const closeCashRegister = () => {
    // Simular fechamento do caixa
    onToggle(false);
    setShowDialog(false);
    
    toast({
      title: "Caixa fechado!",
      description: "Relatório de fechamento gerado",
    });
  };

  const addCashMovement = () => {
    if (amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "Informe a descrição da movimentação",
        variant: "destructive",
      });
      return;
    }

    const transaction: CashTransaction = {
      id: Date.now().toString(),
      type: actionType as 'supply' | 'withdrawal',
      amount: amount,
      description: description,
      timestamp: new Date().toISOString(),
      user: "João Silva" // Em produção viria do contexto de auth
    };

    // Atualizar o registro do caixa
    if (currentRegister) {
      const newAmount = actionType === 'supply' 
        ? currentRegister.current_amount + amount
        : currentRegister.current_amount - amount;
      
      setCurrentRegister({
        ...currentRegister,
        current_amount: newAmount,
        transactions: [...currentRegister.transactions, transaction]
      });
    }

    setShowDialog(false);
    setAmount(0);
    setDescription("");
    
    toast({
      title: actionType === 'supply' ? "Suprimento realizado" : "Sangria realizada",
      description: `R$ ${amount.toFixed(2)} - ${description}`,
    });
  };

  const handleAction = () => {
    switch (actionType) {
      case 'open':
        openCashRegister();
        break;
      case 'close':
        closeCashRegister();
        break;
      case 'supply':
      case 'withdrawal':
        addCashMovement();
        break;
    }
  };

  const getTransactionIcon = (type: CashTransaction['type']) => {
    switch (type) {
      case 'sale':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'supply':
        return <ArrowUp className="h-4 w-4 text-blue-600" />;
      case 'withdrawal':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
    }
  };

  const getTransactionColor = (type: CashTransaction['type']) => {
    switch (type) {
      case 'sale':
        return 'text-green-600';
      case 'supply':
        return 'text-blue-600';
      case 'withdrawal':
        return 'text-red-600';
    }
  };

  return (
    <>
      {/* Status do Caixa */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOpen ? (
                <Unlock className="h-5 w-5 text-green-600" />
              ) : (
                <Lock className="h-5 w-5 text-red-600" />
              )}
              Status do Caixa
            </div>
            <Badge variant={isOpen ? "default" : "destructive"}>
              {isOpen ? "Aberto" : "Fechado"}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isOpen && currentRegister ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Saldo Atual</p>
                  <p className="text-2xl font-bold text-primary">
                    R$ {currentRegister.current_amount.toFixed(2)}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Aberto às</p>
                  <p className="font-semibold">
                    {new Date(currentRegister.opened_at).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    por {currentRegister.opened_by}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActionType('supply');
                    setShowDialog(true);
                  }}
                  className="flex-1"
                >
                  <ArrowUp className="h-4 w-4 mr-1" />
                  Suprimento
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActionType('withdrawal');
                    setShowDialog(true);
                  }}
                  className="flex-1"
                >
                  <ArrowDown className="h-4 w-4 mr-1" />
                  Sangria
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setActionType('close');
                    setShowDialog(true);
                  }}
                >
                  Fechar Caixa
                </Button>
              </div>
              
              {/* Últimas Transações */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Últimas Movimentações</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {currentRegister.transactions.slice(-5).reverse().map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        <span className="truncate">{transaction.description}</span>
                      </div>
                      <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}R$ {transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-4">Caixa fechado</p>
              <Button
                onClick={() => {
                  setActionType('open');
                  setShowDialog(true);
                }}
                className="w-full"
              >
                <Unlock className="h-4 w-4 mr-2" />
                Abrir Caixa
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Ações */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              {actionType === 'open' && 'Abrir Caixa'}
              {actionType === 'close' && 'Fechar Caixa'}
              {actionType === 'supply' && 'Suprimento de Caixa'}
              {actionType === 'withdrawal' && 'Sangria de Caixa'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {actionType === 'open' && (
              <>
                <div>
                  <label className="text-sm font-medium">Valor inicial do caixa</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor em dinheiro para troco inicial
                  </p>
                </div>
              </>
            )}

            {actionType === 'close' && (
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-semibold mb-2">Resumo do Dia</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Valor inicial:</span>
                      <span>R$ {currentRegister?.initial_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor atual:</span>
                      <span>R$ {currentRegister?.current_amount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Movimento total:</span>
                      <span>R$ {((currentRegister?.current_amount || 0) - (currentRegister?.initial_amount || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Deseja realmente fechar o caixa? Esta ação não pode ser desfeita.
                </p>
              </div>
            )}

            {(actionType === 'supply' || actionType === 'withdrawal') && (
              <>
                <div>
                  <label className="text-sm font-medium">Valor</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      actionType === 'supply' 
                        ? "Ex: Troco para o caixa"
                        : "Ex: Depósito no banco"
                    }
                  />
                </div>
              </>
            )}
            
            <div className="flex gap-2">
              <Button onClick={handleAction} className="flex-1">
                {actionType === 'open' && 'Abrir Caixa'}
                {actionType === 'close' && 'Fechar Caixa'}
                {actionType === 'supply' && 'Adicionar Suprimento'}
                {actionType === 'withdrawal' && 'Realizar Sangria'}
              </Button>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}