import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Smartphone, 
  FileText, 
  Clock, 
  DollarSign,
  Package,
  Camera,
  Download,
  Printer,
  Edit,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { OrdemServico, STATUS_CORES, PRIORIDADE_CORES } from "@/types/suporte";
import { useToast } from "@/hooks/use-toast";

interface OSDetailsModalProps {
  os: OrdemServico | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: (novoStatus: string) => void;
}

export function OSDetailsModal({ os, isOpen, onClose, onEdit, onStatusChange }: OSDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("detalhes");
  const { toast } = useToast();

  if (!os) return null;

  const handlePrintReceipt = () => {
    window.print();
    toast({
      title: "Comprovante impresso",
      description: "O comprovante foi enviado para impressão.",
    });
  };

  const handleGeneratePDF = () => {
    toast({
      title: "PDF gerado",
      description: "O PDF da OS foi gerado com sucesso.",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const pecasUtilizadas = [
    { id: "1", nome: "Tela iPhone 14 Pro", quantidade: 1, valor_unitario: 650.00, valor_total: 650.00 },
    { id: "2", nome: "Película Protetora", quantidade: 1, valor_unitario: 25.00, valor_total: 25.00 },
  ];

  const historico = [
    { id: "1", data: "2024-01-15T10:00:00Z", status: "Aberta", usuario: "Recepcionista", observacao: "OS criada pelo cliente" },
    { id: "2", data: "2024-01-15T14:30:00Z", status: "Em diagnóstico", usuario: "Carlos Técnico", observacao: "Iniciado diagnóstico técnico" },
    { id: "3", data: "2024-01-16T09:15:00Z", status: "Em manutenção", usuario: "Carlos Técnico", observacao: "Confirmado defeito na tela, iniciando reparo" },
  ];

  const anexos = [
    { nome: "foto_entrada_dispositivo.jpg", tipo: "Imagem", tamanho: "2.3 MB" },
    { nome: "comprovante_garantia.pdf", tipo: "PDF", tamanho: "156 KB" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ordem de Serviço - {os.numero}
          </DialogTitle>
          <DialogDescription>
            Detalhes completos da ordem de serviço
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cabeçalho da OS */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{os.numero}</CardTitle>
                  <CardDescription>
                    Criada em {new Date(os.created_at).toLocaleString('pt-BR')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={STATUS_CORES[os.status]}>
                    {os.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={PRIORIDADE_CORES[os.prioridade]}>
                    {os.prioridade}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="pecas">Peças</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="anexos">Anexos</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            </TabsList>

            <TabsContent value="detalhes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Informações do Cliente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="font-medium">{os.cliente?.nome}</p>
                      <p className="text-sm text-muted-foreground">{os.cliente?.cpf_cnpj}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{os.cliente?.telefone}</span>
                    </div>
                    {os.cliente?.email && (
                      <div className="text-sm text-muted-foreground">{os.cliente.email}</div>
                    )}
                    <div className="text-sm">
                      <p>{os.cliente?.endereco}</p>
                      <p>{os.cliente?.cidade} - {os.cliente?.cep}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações do Dispositivo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Dispositivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="font-medium">{os.marca} {os.modelo}</p>
                      <p className="text-sm text-muted-foreground">{os.tipo_dispositivo}</p>
                    </div>
                    {os.numero_serie && (
                      <div>
                        <span className="text-sm font-medium">S/N: </span>
                        <span className="text-sm">{os.numero_serie}</span>
                      </div>
                    )}
                    {os.imei && (
                      <div>
                        <span className="text-sm font-medium">IMEI: </span>
                        <span className="text-sm">{os.imei}</span>
                      </div>
                    )}
                    {os.codigo_interno && (
                      <div>
                        <span className="text-sm font-medium">Código: </span>
                        <span className="text-sm">{os.codigo_interno}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Problema e Diagnóstico */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Problema e Diagnóstico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Problema Relatado</h4>
                      <p className="text-sm p-3 bg-muted rounded-md">{os.problema_relatado}</p>
                    </div>
                    {os.diagnostico_tecnico && (
                      <div>
                        <h4 className="font-medium mb-2">Diagnóstico Técnico</h4>
                        <p className="text-sm p-3 bg-muted rounded-md">{os.diagnostico_tecnico}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Tipo de Defeito: </span>
                        <span className="text-sm">{os.tipo_defeito}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Técnico: </span>
                        <span className="text-sm">{os.tecnico_responsavel}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Garantia */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Garantia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Tipo: </span>
                      <span className="text-sm">{os.tipo_garantia.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status: </span>
                      <Badge variant="outline" className={
                        os.status_garantia === 'valida' ? 'bg-green-100 text-green-800' :
                        os.status_garantia === 'expirada' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {os.status_garantia.replace('_', ' ')}
                      </Badge>
                    </div>
                    {os.data_expiracao_garantia && (
                      <div>
                        <span className="text-sm font-medium">Expira em: </span>
                        <span className="text-sm">{new Date(os.data_expiracao_garantia).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Prazos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Prazos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">SLA: </span>
                      <span className="text-sm">{os.sla_prazo || 'Não definido'}</span>
                    </div>
                    {os.data_previsao && (
                      <div>
                        <span className="text-sm font-medium">Previsão: </span>
                        <span className="text-sm">{new Date(os.data_previsao).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    {os.data_conclusao && (
                      <div>
                        <span className="text-sm font-medium">Conclusão: </span>
                        <span className="text-sm">{new Date(os.data_conclusao).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {os.observacoes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm p-3 bg-muted rounded-md">{os.observacoes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pecas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Peças Utilizadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pecasUtilizadas.map((peca) => (
                      <div key={peca.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{peca.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {peca.quantidade} x {formatCurrency(peca.valor_unitario)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(peca.valor_total)}</p>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-medium">
                      <span>Total em Peças:</span>
                      <span>{formatCurrency(675.00)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historico" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Histórico da OS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {historico.map((item, index) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium">{item.status}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.data).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.observacao}</p>
                          <p className="text-xs text-muted-foreground mt-1">Por: {item.usuario}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anexos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Anexos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {anexos.map((anexo, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            {anexo.tipo === 'Imagem' ? <Camera className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium">{anexo.nome}</p>
                            <p className="text-sm text-muted-foreground">{anexo.tipo} • {anexo.tamanho}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Informações Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Valor Orçado</p>
                      <p className="text-xl font-bold">{formatCurrency(os.valor_orcamento || 0)}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Valor Total</p>
                      <p className="text-xl font-bold">{formatCurrency(os.valor_total || 0)}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Mão de obra:</span>
                      <span>{formatCurrency(175.00)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peças:</span>
                      <span>{formatCurrency(675.00)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>{formatCurrency(850.00)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Ações */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button variant="outline" onClick={handlePrintReceipt}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" onClick={handleGeneratePDF}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}