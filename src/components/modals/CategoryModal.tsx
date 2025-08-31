import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, CreateCategoryData } from "@/types/products";
import { useToast } from "@/hooks/use-toast";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateCategoryData) => void;
  category?: Category | null;
  categories?: Category[];
}

const colors = [
  { value: "#3B82F6", label: "Azul" },
  { value: "#10B981", label: "Verde" },
  { value: "#EF4444", label: "Vermelho" },
  { value: "#F59E0B", label: "Laranja" },
  { value: "#8B5CF6", label: "Roxo" },
  { value: "#EC4899", label: "Rosa" },
  { value: "#6B7280", label: "Cinza" },
];

const icons = [
  { value: "Package", label: "Pacote" },
  { value: "Smartphone", label: "Smartphone" },
  { value: "Laptop", label: "Notebook" },
  { value: "Shirt", label: "Camisa" },
  { value: "Footprints", label: "Calçados" },
  { value: "Sparkles", label: "Beleza" },
  { value: "ShoppingBag", label: "Sacola" },
  { value: "Tags", label: "Tags" },
];

export function CategoryModal({
  open,
  onClose,
  onSave,
  category,
  categories = [],
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: "",
    description: "",
    parent_id: undefined,
    color: "#3B82F6",
    icon: "Package",
    status: "active",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        parent_id: category.parent_id,
        color: category.color || "#3B82F6",
        icon: category.icon || "Package",
        status: category.status,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        parent_id: undefined,
        color: "#3B82F6",
        icon: "Package",
        status: "active",
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    onClose();
  };

  const availableParentCategories = categories.filter(
    (cat) => cat.id !== category?.id && !cat.parent_id
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nome da categoria"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descrição da categoria"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent">Categoria Pai</Label>
            <Select
              value={formData.parent_id || "none"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  parent_id: value === "none" ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria pai" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma (categoria principal)</SelectItem>
                {availableParentCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Select
                value={formData.color}
                onValueChange={(value) =>
                  setFormData({ ...formData, color: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Ícone</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) =>
                  setFormData({ ...formData, icon: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {icons.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {category ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}