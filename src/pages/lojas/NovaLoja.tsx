import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LojaForm from "@/components/forms/LojaForm";
import { useStores } from "@/hooks/useStores";
import { ArrowLeft } from "lucide-react";

export default function NovaLoja() {
  const navigate = useNavigate();
  const { createStore } = useStores();

  const handleSubmit = async (data: any) => {
    // Convert form data to match database schema
    const storeData = {
      name: data.nome,
      address: data.endereco,
      phone: data.telefone,
      email: data.email,
      status: data.status === 'Ativa' ? 'active' as const : 'inactive' as const,
      description: data.descricao,
    };

    const success = await createStore(storeData);
    if (success) {
      navigate("/lojas");
    }
  };

  const handleCancel = () => {
    navigate("/lojas");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/lojas")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver Todas as Lojas
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Loja</h1>
          <p className="text-muted-foreground">Criar uma nova loja na sua rede</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informações da Loja</CardTitle>
          <CardDescription>
            Preencha os dados da nova loja que será adicionada à sua rede
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LojaForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}