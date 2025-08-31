import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Keyboard, Zap } from "lucide-react";

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchFocus: () => void;
  onPayment: () => void;
  onClearCart: () => void;
}

export function KeyboardShortcuts({ 
  isOpen, 
  onClose, 
  onSearchFocus, 
  onPayment, 
  onClearCart 
}: KeyboardShortcutsProps) {
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevenir atalhos quando estiver digitando em inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'F1':
          e.preventDefault();
          onSearchFocus();
          break;
        case 'F2':
          e.preventDefault();
          onPayment();
          break;
        case 'F3':
          e.preventDefault();
          onClearCart();
          break;
        case 'F12':
          e.preventDefault();
          // Toggle help dialog (será implementado)
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }

      // Ctrl + atalhos
      if (e.ctrlKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            onClearCart(); // Nova venda
            break;
          case 'p':
            e.preventDefault();
            onPayment();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onSearchFocus, onPayment, onClearCart, onClose]);

  const shortcuts = [
    { key: 'F1', description: 'Focar na busca de produtos', category: 'Navegação' },
    { key: 'F2', description: 'Processar pagamento', category: 'Vendas' },
    { key: 'F3', description: 'Limpar carrinho', category: 'Vendas' },
    { key: 'F4', description: 'Abrir/Fechar caixa', category: 'Caixa' },
    { key: 'F5', description: 'Atualizar produtos', category: 'Sistema' },
    { key: 'F9', description: 'Buscar cliente', category: 'Cliente' },
    { key: 'F10', description: 'Aplicar desconto', category: 'Vendas' },
    { key: 'F12', description: 'Ajuda e atalhos', category: 'Sistema' },
    { key: 'Ctrl + N', description: 'Nova venda', category: 'Vendas' },
    { key: 'Ctrl + P', description: 'Imprimir cupom', category: 'Vendas' },
    { key: 'Ctrl + S', description: 'Suprimento de caixa', category: 'Caixa' },
    { key: 'Ctrl + W', description: 'Sangria de caixa', category: 'Caixa' },
    { key: 'ESC', description: 'Cancelar/Fechar', category: 'Navegação' },
    { key: '+ / -', description: 'Ajustar quantidade', category: 'Produtos' },
    { key: 'Enter', description: 'Confirmar ação', category: 'Navegação' },
  ];

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <>
      {/* Indicador de Atalhos Ativos */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="p-2 shadow-lg border-primary/20">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <Badge variant="outline" className="text-xs">
              Atalhos Ativos
            </Badge>
          </div>
        </Card>
      </div>

      {/* Dialog de Ajuda */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Atalhos de Teclado
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Dica</h3>
              <p className="text-sm text-blue-700">
                Use os atalhos de teclado para agilizar suas vendas. Pressione <kbd className="px-2 py-1 bg-white rounded border">F12</kbd> a qualquer momento para ver esta ajuda.
              </p>
            </div>

            {categories.map((category) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  {category}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shortcuts
                    .filter(shortcut => shortcut.category === category)
                    .map((shortcut, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <span className="text-sm">{shortcut.description}</span>
                        <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">⚠️ Importante</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Os atalhos não funcionam quando você está digitando em campos de texto</li>
                <li>• Use <kbd className="px-1 bg-white rounded border">ESC</kbd> para cancelar qualquer ação</li>
                <li>• Alguns atalhos podem variar dependendo do seu navegador</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}