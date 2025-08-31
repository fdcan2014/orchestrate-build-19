import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Barcode, Plus, Package, Settings, AlertTriangle } from "lucide-react";
import { Product, ProductVariation } from "@/types/pdv";
import { ProductVariations } from "./ProductVariations";
import { StockManager } from "./StockManager";

interface ProductSearchProps {
  onAddToCart: (product: Product, variations?: ProductVariation[], quantity?: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function ProductSearch({ onAddToCart, searchTerm, onSearchChange }: ProductSearchProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariations, setShowVariations] = useState(false);
  const [showStockManager, setShowStockManager] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock products - em produção viria do Supabase
  const mockProducts: Product[] = [
    { 
      id: "1", 
      name: "Coca-Cola 350ml", 
      price: 4.50, 
      barcode: "7894900011517", 
      sku: "CC350", 
      stock: 50, 
      category: "Bebidas", 
      image: "", 
      type: "simple",
      manage_stock: true,
      min_stock: 10
    },
    { 
      id: "2", 
      name: "Camiseta Básica", 
      price: 29.90, 
      barcode: "7891000100103", 
      sku: "CAM001", 
      stock: 0, 
      category: "Roupas", 
      image: "", 
      type: "variable",
      manage_stock: true,
      min_stock: 5,
      variations: [
        { id: "v1", name: "Cor", value: "Azul", price_adjustment: 0, stock: 15 },
        { id: "v2", name: "Cor", value: "Vermelha", price_adjustment: 2.00, stock: 8 },
        { id: "v3", name: "Cor", value: "Preta", price_adjustment: 5.00, stock: 2 },
        { id: "v4", name: "Tamanho", value: "P", price_adjustment: 0, stock: 10 },
        { id: "v5", name: "Tamanho", value: "M", price_adjustment: 0, stock: 15 },
        { id: "v6", name: "Tamanho", value: "G", price_adjustment: 3.00, stock: 5 },
      ]
    },
    { 
      id: "3", 
      name: "Kit Café da Manhã", 
      price: 25.90, 
      barcode: "7891991010856", 
      sku: "KIT001", 
      stock: 10, 
      category: "Kits", 
      image: "", 
      type: "composite",
      manage_stock: true,
      min_stock: 3,
      composition: [
        { product_id: "1", quantity: 1, unit_cost: 4.50 },
        { product_id: "7", quantity: 1, unit_cost: 12.50 },
        { product_id: "6", quantity: 1, unit_cost: 4.20 }
      ]
    },
    { 
      id: "4", 
      name: "Arroz Branco a Granel", 
      price: 4.50, 
      barcode: "7896005800492", 
      sku: "ARG001", 
      stock: 500, 
      category: "Grãos", 
      image: "", 
      type: "simple",
      is_fractional: true,
      unit: "kg",
      manage_stock: true,
      min_stock: 50
    },
    { 
      id: "5", 
      name: "Feijão Preto 1kg", 
      price: 8.50, 
      barcode: "7896005800591", 
      sku: "FP1K", 
      stock: 3, 
      category: "Grãos", 
      image: "", 
      type: "simple",
      manage_stock: true,
      min_stock: 10
    },
    { 
      id: "6", 
      name: "Açúcar Cristal 1kg", 
      price: 4.20, 
      barcode: "7891000100202", 
      sku: "AC1K", 
      stock: 40, 
      category: "Grãos", 
      image: "", 
      type: "simple",
      manage_stock: true,
      min_stock: 15
    },
    { 
      id: "7", 
      name: "Café Torrado 250g", 
      price: 12.50, 
      barcode: "7891000100303", 
      sku: "CT250", 
      stock: 35, 
      category: "Bebidas", 
      image: "", 
      type: "simple",
      manage_stock: true,
      min_stock: 10
    },
  ];

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleProductClick = (product: Product) => {
    if (product.type === 'variable' || product.type === 'composite' || product.is_fractional) {
      setSelectedProduct(product);
      setShowVariations(true);
    } else {
      onAddToCart(product);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
  };

  const getStockAlerts = () => {
    return products.filter(p => 
      p.manage_stock && (p.stock === 0 || p.stock <= (p.min_stock || 5))
    ).length;
  };

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'F2' && filteredProducts.length > 0) {
        e.preventDefault();
        handleProductClick(filteredProducts[0]);
      }
      if (e.key === 'F5') {
        e.preventDefault();
        setShowStockManager(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [filteredProducts]);

  return (
    <div className="space-y-4">
      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          placeholder="Buscar por código, código de barras, SKU ou nome... (F1)"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Badge variant="outline" className="text-xs">
            <Barcode className="h-3 w-3 mr-1" />
            Scan
          </Badge>
        </div>
      </div>

      {/* Filtros Rápidos e Controles */}
      <div className="flex gap-2 flex-wrap justify-between">
        <div className="flex gap-2 flex-wrap">
          {["Todos", "Bebidas", "Roupas", "Grãos", "Kits"].map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => onSearchChange(category === "Todos" ? "" : category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStockManager(true)}
            className="text-xs flex items-center gap-1"
          >
            <Settings className="h-3 w-3" />
            Estoque (F5)
            {getStockAlerts() > 0 && (
              <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                {getStockAlerts()}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto">
        {filteredProducts.map((product) => (
          <Card 
            key={product.id} 
            className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] group"
            onClick={() => handleProductClick(product)}
          >
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      {product.type !== 'simple' && (
                        <Badge variant="secondary" className="text-xs">
                          {product.type === 'variable' ? 'Variações' : 
                           product.type === 'composite' ? 'Kit' : 
                           product.is_fractional ? 'Fracionado' : product.type}
                        </Badge>
                      )}
                      {product.manage_stock && product.stock <= (product.min_stock || 5) && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-2 w-2 mr-1" />
                          {product.stock === 0 ? 'Sem estoque' : 'Baixo'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Código: {product.sku}</p>
                  <p>Barras: {product.barcode}</p>
                  {product.variations && (
                    <p>Variações: {[...new Set(product.variations.map(v => v.name))].join(', ')}</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                    {product.is_fractional && (
                      <span className="text-xs text-muted-foreground">/{product.unit}</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock > (product.min_stock || 10)
                        ? 'bg-green-100 text-green-700' 
                        : product.stock > 0 
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock > 0 ? 
                        `${product.stock} ${product.is_fractional ? product.unit : 'un'}` : 
                        'Sem estoque'
                      }
                    </span>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  disabled={product.stock === 0 && product.manage_stock}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {product.stock === 0 && product.manage_stock ? 'Indisponível' : 
                   product.type !== 'simple' || product.is_fractional ? 'Configurar' : 
                   'Adicionar (F2)'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Nenhum produto encontrado</p>
          <p className="text-sm text-muted-foreground">Tente buscar por outro termo</p>
        </div>
      )}

      {/* Modais */}
      {selectedProduct && (
        <ProductVariations
          product={selectedProduct}
          isOpen={showVariations}
          onClose={() => {
            setShowVariations(false);
            setSelectedProduct(null);
          }}
          onAddToCart={onAddToCart}
        />
      )}

      <StockManager
        isOpen={showStockManager}
        onClose={() => setShowStockManager(false)}
        products={products}
        onStockUpdate={handleStockUpdate}
      />
    </div>
  );
}