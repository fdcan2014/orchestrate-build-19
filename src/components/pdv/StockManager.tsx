import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Scan
} from "lucide-react";
import { Product } from "@/types/pdv";
import { StockAlert, StockMovement, InventoryCount } from "@/types/stock";
import { useToast } from "@/hooks/use-toast";

interface StockManagerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onStockUpdate: (productId: string, newStock: number) => void;
  selectedProduct?: Product | null;
}

export function StockManager({ 
  isOpen, 
  onClose, 
  products, 
  onStockUpdate,
  selectedProduct 
}: StockManagerProps) {
  const [activeTab, setActiveTab] = useState<'alerts' | 'movements' | 'inventory'>('alerts');
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [inventoryMode, setInventoryMode] = useState(false);
  const [inventoryCounts, setInventoryCounts] = useState<{[key: string]: number}>({});
  const [selectedProductState, setSelectedProductState] = useState<Product | null>(null);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const { toast } = useToast();

  // Atualizar produto selecionado quando a prop mudar
  useEffect(() => {
    if (selectedProduct) {
      setSelectedProductState(selectedProduct);
      // Se o usuário estiver na aba de alertas, mude para a aba de movimentações
      if (activeTab === 'alerts') {
        setActiveTab('movements');
      }
    }
  }, [selectedProduct]);

  // Gerar alertas de estoque
  useEffect(() => {
    const alerts: StockAlert[] = [];
    
    products.forEach(product => {
      if (!product.manage_stock) return;
      
      const minStock = product.min_stock || 5;
      
      if (product.stock === 0) {
        alerts.push({
          id: `alert_${product.id}_out`,
          product_id: product.id,
          product_name: product.name,
          current_stock: product.stock,
          min_stock: minStock,
          alert_type: 'out_of_stock',
          store_id: 'store_001',
          created_at: new Date().toISOString(),
          resolved: false
        });
      } else if (product.stock <= minStock) {
        alerts.push({
          id: `alert_${product.id}_low`,
          product_id: product.id,
          product_name: product.name,
          current_stock: product.stock,
          min_stock: minStock,
          alert_type: 'low_stock',
          store_id: 'store_001',
          created_at: new Date().toISOString(),
          resolved: false
        });
      }
    });
    
    setStockAlerts(alerts);
  }, [products]);

  const handleStockAdjustment = () => {
    if (!localSelectedProduct || adjustmentQuantity === 0) {
      toast({
        title: "Dados inválidos",
        description: "Selecione um produto e informe a quantidade",
        variant: "destructive",
      });
      return;
    }

    if (!adjustmentReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Informe o motivo do ajuste de estoque",
        variant: "destructive",
      });
      return;
    }

    const newStock = Math.max(0, selectedProduct.stock + adjustmentQuantity);
    
    // Registrar movimento
    const movement: StockMovement = {
      id: Date.now().toString(),
      product_id: localSelectedProduct.id,
      type: 'adjustment',
      quantity: Math.abs(adjustmentQuantity),
      previous_stock: localSelectedProduct.stock,
      new_stock: newStock,
      reason: adjustmentReason,
      user_id: 'user_001',
      store_id: 'store_001',
      timestamp: new Date().toISOString(),
    };

    setStockMovements(prev => [movement, ...prev]);
      onStockUpdate(localSelectedProduct.id, newStock);
      
      setLocalSelectedProduct(null);
      setAdjustmentQuantity(0);
      setAdjustmentReason("");
      
      toast({
        title: "Estoque ajustado",
        description: `${localSelectedProduct.name}: ${localSelectedProduct.stock} → ${newStock} unidades`,
      });
  };

  const handleInventoryCount = (productId: string, actualCount: number) => {
    setInventoryCounts(prev => ({
      ...prev,
      [productId]: actualCount
    }));
  };

  const finalizeInventory = () => {
    let adjustments = 0;
    
    Object.entries(inventoryCounts).forEach(([productId, actualCount]) => {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      const difference = actualCount - product.stock;
      if (difference !== 0) {
        adjustments++;
        onStockUpdate(productId, actualCount);
        
        // Registrar movimento
        const movement: StockMovement = {
          id: `inv_${Date.now()}_${productId}`,
          product_id: productId,
          type: 'adjustment',
          quantity: Math.abs(difference),
          previous_stock: product.stock,
          new_stock: actualCount,
          reason: `Inventário - ${difference > 0 ? 'Encontrado' : 'Faltante'}: ${Math.abs(difference)} un`,
          user_id: 'user_001',
          store_id: 'store_001',
          timestamp: new Date().toISOString(),
        };
        
        setStockMovements(prev => [movement, ...prev]);
      }
    });
    
    setInventoryMode(false);
    setInventoryCounts({});
    
    toast({
      title: "Inventário finalizado",
      description: `${adjustments} produtos ajustados`,
    });
  };

  const getAlertIcon = (type: StockAlert['alert_type']) => {
    switch (type) {
      case 'out_of_stock':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'overstock':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertColor = (type: StockAlert['alert_type']) => {
    switch (type) {
      case 'out_of_stock':
        return 'border-red-200 bg-red-50';
      case 'low_stock':
        return 'border-yellow-200 bg-yellow-50';
      case 'overstock':
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getMovementIcon = (type: StockMovement['type']) => {
    switch (type) {
      case 'in':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'out':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'adjustment':
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case 'transfer':
        return <Package className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gerenciamento de Estoque
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === 'alerts' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('alerts')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Alertas ({stockAlerts.length})
          </Button>
          
          <Button
            variant={activeTab === 'movements' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('movements')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Movimentações
          </Button>
          
          <Button
            variant={activeTab === 'inventory' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('inventory')}
            className="flex items-center gap-2"
          >
            <Scan className="h-4 w-4" />
            Inventário
          </Button>
        </div>

        <div className="space-y-4">
          {/* Tab: Alertas */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Alertas de Estoque</h3>
                <Button
            variant="outline"
            onClick={() => {
              setLocalSelectedProduct(products[0] || null);
              setActiveTab('movements');
            }}
          >
            Ajustar Estoque
          </Button>
              </div>

              {stockAlerts.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-muted-foreground">Nenhum alerta de estoque</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {stockAlerts.map((alert) => (
                    <Card key={alert.id} className={getAlertColor(alert.alert_type)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getAlertIcon(alert.alert_type)}
                            <div>
                              <h4 className="font-medium">{alert.product_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Estoque atual: {alert.current_stock} un 
                                {alert.alert_type === 'low_stock' && ` (mín: ${alert.min_stock})`}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              alert.alert_type === 'out_of_stock' ? 'destructive' : 
                              alert.alert_type === 'low_stock' ? 'secondary' : 'default'
                            }>
                              {alert.alert_type === 'out_of_stock' ? 'Sem Estoque' :
                               alert.alert_type === 'low_stock' ? 'Estoque Baixo' : 'Sobrestoque'}
                            </Badge>
                            
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const product = products.find(p => p.id === alert.product_id);
                                  if (product) {
                                    setLocalSelectedProduct(product);
                                    setActiveTab('movements');
                                  }
                                }}
                              >
                                Ajustar
                              </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Movimentações */}
          {activeTab === 'movements' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Movimentações de Estoque</h3>
              </div>

              {/* Ajuste Manual */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ajuste Manual de Estoque</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Produto</label>
                      <Select 
                        value={localSelectedProduct?.id || ''} 
                        onValueChange={(value) => {
                          const product = products.find(p => p.id === value);
                          setLocalSelectedProduct(product || null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} (Atual: {product.stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Quantidade</label>
                      <Input
                        type="number"
                        value={adjustmentQuantity}
                        onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                        placeholder="+ para entrada, - para saída"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <Button 
                        onClick={handleStockAdjustment}
                        disabled={!selectedProduct || adjustmentQuantity === 0}
                        className="w-full"
                      >
                        Ajustar
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Motivo</label>
                    <Textarea
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
                      placeholder="Ex: Perda, dano, correção de inventário..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Histórico */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Histórico de Movimentações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {stockMovements.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhuma movimentação registrada
                      </p>
                    ) : (
                      stockMovements.map((movement) => (
                        <div key={movement.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div className="flex items-center gap-2">
                            {getMovementIcon(movement.type)}
                            <div>
                              <p className="text-sm font-medium">
                                Produto #{movement.product_id}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {movement.reason}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {movement.previous_stock} → {movement.new_stock}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(movement.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tab: Inventário */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Contagem de Inventário</h3>
                <div className="flex gap-2">
                  {inventoryMode ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setInventoryMode(false);
                          setInventoryCounts({});
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={finalizeInventory}>
                        Finalizar Inventário
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setInventoryMode(true)}>
                      Iniciar Inventário
                    </Button>
                  )}
                </div>
              </div>

              {inventoryMode ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contagem em Andamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-3 border rounded">
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Sistema: {product.stock} un
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <label className="text-sm">Contado:</label>
                            <Input
                              type="number"
                              min="0"
                              value={inventoryCounts[product.id] || ''}
                              onChange={(e) => handleInventoryCount(product.id, parseInt(e.target.value) || 0)}
                              className="w-20"
                              placeholder="0"
                            />
                          </div>
                          
                          {inventoryCounts[product.id] !== undefined && (
                            <div className="text-right">
                              <p className={`text-sm font-medium ${
                                inventoryCounts[product.id] === product.stock 
                                  ? 'text-green-600' 
                                  : 'text-orange-600'
                              }`}>
                                {inventoryCounts[product.id] === product.stock 
                                  ? 'Conferido' 
                                  : `Dif: ${(inventoryCounts[product.id] || 0) - product.stock}`
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Scan className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Clique em "Iniciar Inventário" para começar a contagem</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}