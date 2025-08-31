import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrdemServicoForm } from "@/components/forms/OrdemServicoForm";
import { useToast } from "@/hooks/use-toast";

export function NovaOS() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      // Simular salvamento da OS
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Nova OS criada:", data);
      
      toast({
        title: "OS criada com sucesso!",
        description: "A ordem de serviço foi registrada no sistema.",
      });
      
      // Redirecionar para a lista de OS
      navigate("/suporte/ordens");
      
    } catch (error) {
      toast({
        title: "Erro ao criar OS",
        description: "Ocorreu um erro ao salvar a ordem de serviço.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Ordem de Serviço</h1>
        <p className="text-muted-foreground">
          Registre uma nova ordem de serviço técnico
        </p>
      </div>

      <OrdemServicoForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}