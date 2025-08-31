import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart as ShoppingCartIcon, Plus, Minus, Trash2, MessageSquare, Edit3 } from "lucide-react";
import { CartItem } from "@/types/pdv";
import { useToast } from "@/hooks/use-toast";

interface ShoppingCartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateNotes: (productId: string, notes: string) => void;
  onClearCart: () => void;
}

export function ShoppingCart({ 
  cart, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onUpdateNotes,
  onClearCart 
}: ShoppingCartProps) {
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getSubTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getTaxes = () => getSubTotal() * 0.05; // 5% de impostos simulado
  const getDiscount = () => 0; // Desconto simulado
  const getTotalPrice = () => getSubTotal() + getTaxes() - getDiscount();

  const handleNotesSubmit = () => {
    if (selectedItem) {
      onUpdateNotes(selectedItem.id, notes);
      setSelectedItem(null);
      setNotes("");
      toast({
        title: "Observação adicionada",
        description: "Observação do item atualizada com sucesso",
      });
    }
  };

  const openNotesDialog = (item: CartItem) => {
    setSelectedItem(item);
    setNotes(item.notes || "");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="h-5 w-5" />
            Carrinho
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{getTotalItems()} itens</Badge>
            {cart.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearCart}
                className="text-destructive hover:text-destructive"
              >
                Limpar
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Carrinho vazio</p>
              <p className="text-sm text-muted-foreground">Adicione produtos para começar</p>
            </div>
          </div>
        ) : (
          <>
            {/* Lista de Itens */}
            <div className="flex-1 space-y-2 max-h-[400px] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        R$ {item.price.toFixed(2)} × {item.quantity} = R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                      
                      {/* Variações Selecionadas */}
                      {item.selected_variations && item.selected_variations.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.selected_variations.map((variation, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {variation.name}: {variation.value}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Produto Fracionado */}
                      {item.is_fractional && item.fractional_quantity && (
                        <p className="text-xs text-blue-600">
                          Quantidade: {item.fractional_quantity} {item.fractional_unit}
                        </p>
                      )}
                      
                      {/* Produto Composto */}
                      {item.type === 'composite' && (
                        <p className="text-xs text-purple-600">
                          Kit com {item.composition?.length || 0} itens
                        </p>
                      )}
                    </div>
                    
                    {item.notes && (
                      <p className="text-xs text-blue-600 bg-blue-50 p-1 rounded mt-1">
                        💬 {item.notes}
                      </p>
                    )}
                  </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="h-7 w-7 p-0"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="h-7 w-7 p-0"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openNotesDialog(item)}
                        className="h-7 w-7 p-0 ml-1"
                        title="Adicionar observação"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRemoveFromCart(item.id)}
                        className="h-7 w-7 p-0 ml-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Resumo Financeiro */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>R$ {getSubTotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Impostos (5%):</span>
                <span>R$ {getTaxes().toFixed(2)}</span>
              </div>
              
              {getDiscount() > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto:</span>
                  <span>- R$ {getDiscount().toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">R$ {getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        {/* Dialog para Observações */}
        <Dialog open={selectedItem !== null} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Observações do Item
              </DialogTitle>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium">{selectedItem.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    R$ {selectedItem.price.toFixed(2)} × {selectedItem.quantity}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Observações:</label>
                  <Textarea
                    placeholder="Ex: Sem cebola, embalagem separada, etc..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleNotesSubmit} className="flex-1">
                    Salvar Observação
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedItem(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}