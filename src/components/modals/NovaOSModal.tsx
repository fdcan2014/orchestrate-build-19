import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrdemServicoForm } from "@/components/forms/OrdemServicoForm";
import { FileText } from "lucide-react";

interface NovaOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function NovaOSModal({ isOpen, onClose, onSave }: NovaOSModalProps) {
  const handleSubmit = (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Nova Ordem de Serviço
          </DialogTitle>
          <DialogDescription>
            Registre uma nova ordem de serviço técnico
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <OrdemServicoForm onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}