import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  CreditCard, 
  QrCode, 
  MessageSquare, 
  Truck, 
  Wifi,
  WifiOff,
  Settings,
  CheckCircle,
  AlertCircle,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IntegrationsManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IntegrationsManager({ isOpen, onClose }: IntegrationsManagerProps) {
  const [cardReaderConnected, setCardReaderConnected] = useState(false);
  const [pixEnabled, setPixEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(5.00);
  const [deliveryRadius, setDeliveryRadius] = useState(10);
  const [pixKey, setPixKey] = useState("");
  const { toast } = useToast();

  const connectCardReader = () => {
    // Simular conexão com maquininha
    setTimeout(() => {
      setCardReaderConnected(true);
      toast({
        title: "Maquininha conectada",
        description: "Moderninha Pro conectada via Bluetooth",
      });
    }, 2000);
  };

  const generatePixQR = (amount: number) => {
    // Simular geração de QR Code PIX
    const pixData = {
      key: pixKey,
      amount: amount,
      description: "Venda PDV",
      id: Date.now().toString()
    };
    
    console.log('PIX QR gerado:', pixData);
    
    toast({
      title: "QR Code PIX gerado",
      description: `Valor: R$ ${amount.toFixed(2)}`,
    });
  };

  const sendWhatsAppOrder = (orderData: any) => {
    // Simular envio via WhatsApp
    const message = `
🛒 *Novo Pedido - ${orderData.id}*

📝 *Itens:*
${orderData.items.map((item: any) => `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')}

💰 *Total: R$ ${orderData.total.toFixed(2)}*

📍 *Endereço:* ${orderData.address || 'Retirada na loja'}

🔗 *Link de pagamento:* https://pay.exemplo.com/${orderData.id}
    `;

    console.log('Mensagem WhatsApp:', message);
    
    toast({
      title: "Pedido enviado",
      description: "Link de pagamento enviado via WhatsApp",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Integrações Externas
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="payment" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="payment">Pagamentos</TabsTrigger>
            <TabsTrigger value="pix">PIX Dinâmico</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
          </TabsList>

          {/* Tab: Pagamentos */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Maquininhas de Cartão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${cardReaderConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {cardReaderConnected ? (
                        <Wifi className="h-4 w-4 text-green-600" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">Moderninha Pro</h4>
                      <p className="text-sm text-muted-foreground">
                        {cardReaderConnected ? 'Conectada via Bluetooth' : 'Desconectada'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={connectCardReader}
                    disabled={cardReaderConnected}
                    variant={cardReaderConnected ? "outline" : "default"}
                  >
                    {cardReaderConnected ? 'Conectada' : 'Conectar'}
                  </Button>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-semibold mb-2">Recursos Disponíveis:</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Débito e Crédito</li>
                    <li>✅ Parcelamento até 12x</li>
                    <li>✅ Contactless (aproximação)</li>
                    <li>✅ Comprovante digital</li>
                    <li>✅ Cancelamento de transações</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: PIX */}
          <TabsContent value="pix" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  PIX Dinâmico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">PIX Habilitado</label>
                  <Switch
                    checked={pixEnabled}
                    onCheckedChange={setPixEnabled}
                  />
                </div>

                {pixEnabled && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chave PIX</label>
                      <Input
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        placeholder="exemplo@email.com ou 11999999999"
                      />
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                      <h4 className="font-semibold">Teste de QR Code</h4>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Valor do teste"
                          step="0.01"
                          className="flex-1"
                          id="pix-test-amount"
                        />
                        <Button
                          onClick={() => {
                            const input = document.getElementById('pix-test-amount') as HTMLInputElement;
                            const amount = parseFloat(input?.value || '0');
                            if (amount > 0) generatePixQR(amount);
                          }}
                          disabled={!pixKey}
                        >
                          Gerar QR
                        </Button>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-1">Recursos PIX:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>✅ QR Code dinâmico por venda</li>
                        <li>✅ Confirmação automática</li>
                        <li>✅ Integração com bancos</li>
                        <li>✅ Baixa automática no estoque</li>
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: WhatsApp */}
          <TabsContent value="whatsapp" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Vendas via WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">WhatsApp Business</label>
                  <Switch
                    checked={whatsappEnabled}
                    onCheckedChange={setWhatsappEnabled}
                  />
                </div>

                {whatsappEnabled && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Número do WhatsApp</label>
                      <Input
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                      <h4 className="font-semibold">Teste de Envio</h4>
                      <Button
                        onClick={() => sendWhatsAppOrder({
                          id: 'TEST001',
                          items: [
                            { name: 'Produto Teste', quantity: 1, price: 10.00 }
                          ],
                          total: 10.00,
                          address: 'Endereço de teste'
                        })}
                        disabled={!whatsappNumber}
                        className="w-full"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Enviar Pedido Teste
                      </Button>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-1">Fluxo WhatsApp:</h4>
                      <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                        <li>Cliente faz pedido no PDV</li>
                        <li>Sistema envia detalhes via WhatsApp</li>
                        <li>Cliente recebe link de pagamento</li>
                        <li>Confirmação automática após pagamento</li>
                        <li>Notificação de status do pedido</li>
                      </ol>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Delivery */}
          <TabsContent value="delivery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Sistema de Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Delivery Habilitado</label>
                  <Switch
                    checked={deliveryEnabled}
                    onCheckedChange={setDeliveryEnabled}
                  />
                </div>

                {deliveryEnabled && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Taxa de Entrega</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={deliveryFee}
                          onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Raio (km)</label>
                        <Input
                          type="number"
                          value={deliveryRadius}
                          onChange={(e) => setDeliveryRadius(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h4 className="font-semibold mb-2">Configurações Atuais:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Taxa:</strong> R$ {deliveryFee.toFixed(2)}</p>
                          <p><strong>Raio:</strong> {deliveryRadius} km</p>
                        </div>
                        <div>
                          <p><strong>Tempo médio:</strong> 30-45 min</p>
                          <p><strong>Pedido mínimo:</strong> R$ 20,00</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-1">Recursos Delivery:</h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>✅ Cálculo automático de taxa</li>
                        <li>✅ Rastreamento de pedidos</li>
                        <li>✅ Notificações SMS/WhatsApp</li>
                        <li>✅ Integração com mapas</li>
                        <li>✅ Controle de entregadores</li>
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}