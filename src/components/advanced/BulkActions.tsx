import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Trash2, Edit, Archive, RefreshCw } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface BulkActionsProps {
  selectedItems: (number | string)[];
  totalItems: number;
  onSelectAll: (selected: boolean) => void;
  onBulkAction: (action: string, items: (number | string)[]) => void;
  actions?: {
    export?: boolean;
    delete?: boolean;
    edit?: boolean;
    archive?: boolean;
    activate?: boolean;
  };
}

export default function BulkActions({
  selectedItems,
  totalItems,
  onSelectAll,
  onBulkAction,
  actions = { export: true, delete: true, edit: true, archive: true, activate: true }
}: BulkActionsProps) {
  const [bulkAction, setBulkAction] = useState("");
  
  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isPartialSelected = selectedItems.length > 0 && selectedItems.length < totalItems;

  const handleSelectAll = () => {
    onSelectAll(!isAllSelected);
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedItems.length > 0) {
      onBulkAction(bulkAction, selectedItems);
      setBulkAction("");
    }
  };

  const exportData = () => {
    onBulkAction("export", selectedItems);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-muted/20">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedItems.length === 0
              ? `Selecionar todos (${totalItems})`
              : `${selectedItems.length} selecionado(s)`}
          </span>
        </div>

        {selectedItems.length > 0 && (
          <div className="flex items-center space-x-2">
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Ações em massa" />
              </SelectTrigger>
              <SelectContent>
                {actions.edit && (
                  <SelectItem value="edit">
                    <div className="flex items-center">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar selecionados
                    </div>
                  </SelectItem>
                )}
                {actions.archive && (
                  <SelectItem value="archive">
                    <div className="flex items-center">
                      <Archive className="w-4 h-4 mr-2" />
                      Arquivar selecionados
                    </div>
                  </SelectItem>
                )}
                {actions.activate && (
                  <SelectItem value="activate">
                    <div className="flex items-center">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Ativar selecionados
                    </div>
                  </SelectItem>
                )}
                {actions.delete && (
                  <SelectItem value="delete">
                    <div className="flex items-center text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir selecionados
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {bulkAction === "delete" ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Aplicar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir {selectedItems.length} item(s) selecionado(s)? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkAction} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button 
                onClick={handleBulkAction} 
                disabled={!bulkAction}
                size="sm"
              >
                Aplicar
              </Button>
            )}
          </div>
        )}
      </div>

      {actions.export && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportData}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Exportar{selectedItems.length > 0 ? ` (${selectedItems.length})` : " Tudo"}</span>
        </Button>
      )}
    </div>
  );
}