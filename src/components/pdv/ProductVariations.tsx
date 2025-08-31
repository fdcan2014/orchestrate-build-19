import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Package, Palette, Ruler, Plus, Minus } from "lucide-react";
import { Product, ProductVariation } from "@/types/pdv";
import { useToast } from "@/hooks/use-toast";

interface ProductVariationsProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variations?: ProductVariation[], quantity?: number) => void;
}

export function ProductVariations({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}: ProductVariationsProps) {
  const [selectedVariations, setSelectedVariations] = useState<{[key: string]: ProductVariation}>({});
  const [quantity, setQuantity] = useState(1);
  const [fractionalQuantity, setFractionalQuantity] = useState(1);
  const { toast } = useToast();

  const handleVariationSelect = (variationType: string, variation: ProductVariation) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationType]: variation
    }));
  };

  const calculatePrice = () => {
    let basePrice = product.price;
    Object.values(selectedVariations).forEach(variation => {
      basePrice += variation.price_adjustment;
    });
    
    if (product.is_fractional) {
      return basePrice * fractionalQuantity;
    }
    
    return basePrice * quantity;
  };

  const canAddToCart = () => {
    if (product.type === 'variable' && product.variations) {
      // Verificar se todas as variações obrigatórias foram selecionadas
      const variationTypes = [...new Set(product.variations.map(v => v.name))];
      return variationTypes.every(type => selectedVariations[type]);
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) {
      toast({
        title: "Selecione as variações",
        description: "Todas as opções devem ser selecionadas",
        variant: "destructive",
      });
      return;
    }

    const finalQuantity = product.is_fractional ? fractionalQuantity : quantity;
    onAddToCart(product, Object.values(selectedVariations), finalQuantity);
    onClose();
    
    // Reset
    setSelectedVariations({});
    setQuantity(1);
    setFractionalQuantity(1);
  };

  const getVariationsByType = (type: string) => {
    return product.variations?.filter(v => v.name === type) || [];
  };

  const variationTypes = product.variations ? 
    [...new Set(product.variations.map(v => v.name))] : [];

  const getIcon = (variationType: string) => {
    switch (variationType.toLowerCase()) {
      case 'cor':
      case 'color':
        return <Palette className="h-4 w-4" />;
      case 'tamanho':
      case 'size':
        return <Ruler className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Produto */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <Badge variant="outline">
                    {product.stock} em estoque
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Variações */}
          {product.type === 'variable' && variationTypes.map((type) => (
            <div key={type} className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                {getIcon(type)}
                {type}
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {getVariationsByType(type).map((variation) => (
                  <Button
                    key={variation.id}
                    variant={selectedVariations[type]?.id === variation.id ? "default" : "outline"}
                    className="h-auto p-3 flex-col gap-1"
                    onClick={() => handleVariationSelect(type, variation)}
                  >
                    <span className="font-medium">{variation.value}</span>
                    {variation.price_adjustment !== 0 && (
                      <span className="text-xs">
                        {variation.price_adjustment > 0 ? '+' : ''}
                        R$ {variation.price_adjustment.toFixed(2)}
                      </span>
                    )}
                    {variation.stock !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        {variation.stock} un
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {/* Produtos Compostos */}
          {product.type === 'composite' && product.composition && (
            <div className="space-y-2">
              <h4 className="font-semibold">Composição do Kit</h4>
              <div className="bg-muted/50 p-3 rounded-lg">
                {product.composition.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>Produto #{item.product_id}</span>
                    <span>{item.quantity} un</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantidade */}
          <div className="space-y-2">
            <h4 className="font-semibold">Quantidade</h4>
            
            {product.is_fractional ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={fractionalQuantity}
                    onChange={(e) => setFractionalQuantity(parseFloat(e.target.value) || 0.001)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">{product.unit}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Produto vendido por {product.unit === 'kg' ? 'peso' : 'medida'}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="px-4 py-2 border rounded text-center min-w-[60px]">
                  {quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Resumo e Finalização */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary">
                R$ {calculatePrice().toFixed(2)}
              </span>
            </div>

            {/* Variações Selecionadas */}
            {Object.keys(selectedVariations).length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Selecionado:</p>
                {Object.entries(selectedVariations).map(([type, variation]) => (
                  <Badge key={type} variant="outline" className="mr-2">
                    {type}: {variation.value}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart()}
                className="flex-1"
                size="lg"
              >
                Adicionar ao Carrinho
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