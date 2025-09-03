import { useState } from "react";
import { Plus, Search, Edit, Trash2, MapPin, Phone, Mail, Users, TrendingUp, Award, Eye } from "lucide-react";
import { Store as StoreIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import LojaForm from "@/components/forms/LojaForm";
import BulkActions from "@/components/advanced/BulkActions";
import AdvancedFilters from "@/components/advanced/AdvancedFilters";
import { MaxtonPageHeader } from "@/components/maxton/MaxtonPageHeader";
import { MaxtonCard } from "@/components/maxton/MaxtonCard";
import { useStores, type Store } from "@/hooks/useStores";
import { Skeleton } from "@/components/ui/skeleton";

// Using data from Supabase hook now

const filterFields = [
  { key: "status", label: "Status", type: "select" as const, options: [
    { value: "active", label: "Ativa" },
    { value: "inactive", label: "Inativa" }
  ]},
];

export default function LojasPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLojas, setSelectedLojas] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLoja, setEditingLoja] = useState<Store | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { stores, loading, createStore, updateStore, deleteStore } = useStores();

  const filteredLojas = stores.filter(loja => {
    const matchesSearch = loja.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loja.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      switch (key) {
        case "status":
          return loja.status === value;
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  const handleSelectAll = (selected: boolean) => {
    setSelectedLojas(selected ? filteredLojas.map(loja => loja.id) : []);
  };

  const handleSelectLoja = (lojaId: string, selected: boolean) => {
    setSelectedLojas(prev => 
      selected 
        ? [...prev, lojaId]
        : prev.filter(id => id !== lojaId)
    );
  };

  const handleBulkAction = (action: string, items: string[]) => {
    console.log(`${action} aplicado a ${items.length} loja(s)`);
    setSelectedLojas([]);
  };

  const handleCreateLoja = async (data: any) => {
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
      setIsCreateOpen(false);
    }
  };

  const handleEditLoja = async (data: any) => {
    if (!editingLoja) return;

    const storeData = {
      name: data.nome,
      address: data.endereco,
      phone: data.telefone,
      email: data.email,
      status: data.status === 'Ativa' ? 'active' as const : 'inactive' as const,
      description: data.descricao,
    };

    const success = await updateStore(editingLoja.id, storeData);
    if (success) {
      setEditingLoja(null);
    }
  };

  const handleDeleteLoja = async (lojaId: string) => {
    await deleteStore(lojaId);
  };

  return (
    <div className="space-y-6">
      <MaxtonPageHeader
        title="Gestão de Lojas"
        subtitle="Gerencie todas as lojas da sua rede"
        breadcrumbs={[
          { label: "Lojas" }
        ]}
        actions={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="maxton-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Nova Loja
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Loja</DialogTitle>
              </DialogHeader>
              <LojaForm 
                onSubmit={handleCreateLoja}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MaxtonCard
          title="Total de Lojas"
          value={loading ? "..." : stores.length.toString()}
          change={loading ? "" : `${stores.filter(l => l.status === "active").length} ativas, ${stores.filter(l => l.status === "inactive").length} inativas`}
          icon={<StoreIcon className="h-5 w-5" />}
          variant="gradient"
        />
        
        <MaxtonCard
          title="Lojas Ativas"
          value={loading ? "..." : stores.filter(l => l.status === "active").length.toString()}
          change="Em funcionamento"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="gradient"
        />

        <MaxtonCard
          title="Criadas Hoje"
          value={loading ? "..." : stores.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length.toString()}
          change="Novas lojas hoje"
          icon={<Users className="h-5 w-5" />}
          variant="gradient"
        />

        <MaxtonCard
          title="Última Criada"
          value={loading ? "..." : (stores.length > 0 ? stores[0]?.name : 'Nenhuma')}
          change="Mais recente"
          icon={<Award className="h-5 w-5" />}
          variant="gradient"
        />
      </div>

      <AdvancedFilters 
        fields={filterFields}
        onFiltersChange={setFilters}
      />

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar lojas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 maxton-input"
          />
        </div>
      </div>

      <Card className="maxton-card">
        <CardHeader>
          <CardTitle className="maxton-heading-2">Lista de Lojas ({filteredLojas.length})</CardTitle>
          <CardDescription className="maxton-text-body">Visualize e gerencie todas as lojas da sua rede</CardDescription>
        </CardHeader>
        
        <BulkActions
          selectedItems={selectedLojas}
          totalItems={filteredLojas.length}
          onSelectAll={handleSelectAll}
          onBulkAction={handleBulkAction}
          actions={{ export: true, delete: true, edit: true, archive: true }}
        />

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLojas.length === filteredLojas.length && filteredLojas.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">Loja</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Endereço</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Contato</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Criada em</TableHead>
                  <TableHead className="text-right text-gray-700 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLojas.map((loja) => (
                  <TableRow key={loja.id} className={`hover:bg-gray-50/50 transition-colors ${selectedLojas.includes(loja.id) ? "bg-blue-50/50" : ""}`}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLojas.includes(loja.id)}
                        onCheckedChange={(checked) => handleSelectLoja(loja.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{loja.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {loja.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-700">
                          <Phone className="w-4 h-4 mr-1" />
                          {loja.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-4 h-4 mr-1" />
                          {loja.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={loja.status === "active" ? "maxton-badge-success" : "maxton-badge-warning"}>
                        {loja.status === "active" ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(loja.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/lojas/${loja.id}`)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700 hover:bg-gray-50" onClick={() => setEditingLoja({
                              ...loja,
                              nome: loja.name,
                              endereco: loja.address,
                              telefone: loja.phone,
                              status: loja.status === "active" ? "Ativa" : "Inativa",
                              descricao: loja.description
                            } as any)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          {editingLoja && (
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Editar Loja</DialogTitle>
                              </DialogHeader>
                              <LojaForm 
                                loja={editingLoja as any}
                                onSubmit={handleEditLoja}
                                onCancel={() => setEditingLoja(null)}
                              />
                            </DialogContent>
                          )}
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteLoja(loja.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLojas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhuma loja encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}