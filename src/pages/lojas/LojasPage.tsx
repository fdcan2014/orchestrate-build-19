import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, MapPin, Phone, Mail, Eye, Store as StoreIcon, ChevronDown, ChevronUp, Award, Activity, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@/components/icons/DownloadIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import LojaForm from "@/components/forms/LojaForm";
import BulkActions from "@/components/advanced/BulkActions";
import AdvancedFilters from "@/components/advanced/AdvancedFilters";
import { MaxtonPageHeader } from "@/components/maxton/MaxtonPageHeader";
import { MaxtonCard } from "@/components/maxton/MaxtonCard";
import { useStores, type Store } from "@/hooks/useStores";
import { Skeleton } from "@/components/ui/skeleton";

// Estilos personalizados baseados no template Maxton - Melhorado
const maxtonStyles = {
  // Melhorias para a tabela
  tableRow: 'group hover:bg-muted/50 transition-all duration-300 border-b last:border-0',
  // Botões de ação com efeitos de hover mais elegantes e ícones menores
  actionButton: 'h-8 w-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-sm',
  // Cards de estatísticas com design similar ao Maxton
  statCard: 'relative p-6 rounded-xl border shadow-md transition-all duration-300 hover:shadow-lg overflow-hidden bg-slate-900/50 backdrop-blur-sm',
  statCardIcon: 'absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10',
  // Badges com cores mais vibrantes
  badgeActive: 'bg-emerald-500 text-white hover:bg-emerald-600 font-medium px-2.5 py-0.5 rounded-full',
  badgeInactive: 'bg-slate-400 text-white hover:bg-slate-500 font-medium px-2.5 py-0.5 rounded-full',
  // Botões principais com sombra e efeito de hover
  primaryButton: 'relative group overflow-hidden',
  primaryButtonEffect: 'absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500'
};

const filterFields = [
  { name: "name", label: "Nome", type: "text" },
  { name: "status", label: "Status", type: "select", options: ["ativo", "inativo"] },
  { name: "createdAt", label: "Data de Criação", type: "date" },
];

const bulkActions = [
  { name: "delete", label: "Excluir Selecionadas", icon: <Trash2 className="h-4 w-4" /> },
  { name: "activate", label: "Ativar Selecionadas" },
  { name: "deactivate", label: "Desativar Selecionadas" },
];

const LojasPage: React.FC = () => {
  const navigate = useNavigate();
  const { createStore, deleteStore, updateStore, stores, loading } = useStores();
  
  const [search, setSearch] = useState("");
  const [selectedLojas, setSelectedLojas] = useState<string[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingLoja, setEditingLoja] = useState<Store | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleCreateStore = (data: Omit<Store, "id" | "createdAt">) => {
    createStore(data);
    setIsFormDialogOpen(false);
    setEditingLoja(null);
  };

  const handleUpdateStore = (data: Omit<Store, "createdAt">) => {
    updateStore(data);
    setIsFormDialogOpen(false);
    setEditingLoja(null);
  };

  const handleDeleteStores = (ids: string[]) => {
    ids.forEach(id => deleteStore(id));
    setSelectedLojas([]);
  };

  const handleSelectAll = () => {
    if (selectedLojas.length === filteredLojas.length) {
      setSelectedLojas([]);
    } else {
      setSelectedLojas(filteredLojas.map(loja => loja.id));
    }
  };

  const filteredLojas = stores.filter(loja => {
    const matchesSearch = loja.name.toLowerCase().includes(search.toLowerCase()) ||
                         loja.address.toLowerCase().includes(search.toLowerCase()) ||
                         loja.phone.includes(search);
    
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      switch (key) {
        case "name":
          return loja.name.toLowerCase().includes(value.toLowerCase());
        case "status":
          return loja.status === value;
        case "createdAt":
          return loja.createdAt.startsWith(value);
        default:
          return true;
      }
    });
    
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
      <div className="max-w-7xl mx-auto w-full">
        <MaxtonPageHeader 
          title="Lojas"
          description="Gerenciar todas as lojas do sistema"
          actions={
            <Button 
              onClick={() => {
                setEditingLoja(null);
                setIsFormDialogOpen(true);
              }}
              className={`gap-2 transition-all duration-300 hover:shadow-md ${maxtonStyles.primaryButton}`}
            >
              <Plus className="h-4 w-4" />
              Nova Loja
              <span className={maxtonStyles.primaryButtonEffect}></span>
            </Button>
          }
        />

        {/* Layout com design similar ao Maxton */}
        <div className="grid gap-6 mt-6 w-full grid-cols-1 lg:grid-cols-3">
          {/* Coluna principal com a tabela de lojas */}
          <div className="lg:col-span-2">
            <MaxtonCard className="h-full border rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Listagem de Lojas</CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">Gerencie e visualize todas as lojas</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 transition-all duration-300 hover:bg-primary/10 rounded-lg"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    Exportar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="transition-all duration-300 hover:bg-primary/10 rounded-lg"
                  >
                    Filtrar
                    <ChevronDown className={`ml-1 h-3.5 w-3.5 transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-full flex flex-col">
                {isFiltersOpen && (
                  <div className="mb-4 p-4 border rounded-lg bg-background shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <AdvancedFilters 
                      fields={filterFields}
                      filters={filters}
                      setFilters={setFilters}
                    />
                  </div>
                )}
              
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div className="relative w-full max-w-sm sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="Buscar loja..." 
                      className="pl-9 pr-4 py-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  
                  {selectedLojas.length > 0 && (
                    <BulkActions 
                      selectedCount={selectedLojas.length}
                      actions={bulkActions}
                      onAction={(action) => {
                        if (action === "delete") {
                          handleDeleteStores(selectedLojas);
                        }
                        // Implemente outras ações de bulk aqui
                      }}
                    />
                  )}
                </div>

                {/* Tabela com design aprimorado */}
                <div className="overflow-x-auto rounded-lg border border-slate-800 shadow-sm flex-grow">
                  <Table className="min-w-full border-collapse w-full">
                    <TableHeader className="bg-slate-900/50 backdrop-blur-sm">
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox 
                            checked={selectedLojas.length > 0 && selectedLojas.length === filteredLojas.length}
                            onCheckedChange={handleSelectAll}
                            aria-label="Selecionar todas as lojas"
                          />
                        </TableHead>
                        <TableHead className="sm:w-[200px] font-semibold text-slate-700 dark:text-slate-300">Nome</TableHead>
                        <TableHead className="hidden md:table-cell font-semibold text-slate-700 dark:text-slate-300">Endereço</TableHead>
                        <TableHead className="hidden sm:table-cell font-semibold text-slate-700 dark:text-slate-300">Telefone</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        // Skeleton loading state com design melhorado
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={`skeleton-${index}`} className="animate-pulse">
                            <TableCell><Skeleton className="h-4 w-4 rounded" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[150px] rounded" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[200px] rounded" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[120px] rounded" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                            <TableCell className="text-right">
                              <div className="inline-flex gap-2">
                                <Skeleton className="h-8 w-8 rounded-lg" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredLojas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <StoreIcon className="h-8 w-8 text-primary" />
                              </div>
                              <p className="text-lg font-medium">Nenhuma loja encontrada</p>
                              <Button 
                                variant="default" 
                                className={`mt-2 ${maxtonStyles.primaryButton}`}
                                onClick={() => {
                                  setEditingLoja(null);
                                  setIsFormDialogOpen(true);
                                }}
                              >
                                Criar primeira loja
                                <span className={maxtonStyles.primaryButtonEffect}></span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                          filteredLojas.map((loja) => (
                            <TableRow 
                              key={loja.id} 
                              className={maxtonStyles.tableRow}
                            >
                              <TableCell>
                                <Checkbox 
                                  checked={selectedLojas.includes(loja.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedLojas([...selectedLojas, loja.id]);
                                    } else {
                                      setSelectedLojas(selectedLojas.filter(id => id !== loja.id));
                                    }
                                  }}
                                  aria-label={`Selecionar loja ${loja.name}`}
                                />
                              </TableCell>
                              <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                                {loja.name}
                                {/* Exibir endereço e telefone em telas pequenas */}
                                <div className="flex flex-col mt-1 space-y-1 text-xs text-muted-foreground md:hidden">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{loja.address}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{loja.phone}</span>
                                  </div>
                                </div>
                              </TableCell>
                              {/* Endereço e telefone só visíveis em telas maiores */}
                              <TableCell className="hidden md:table-cell max-w-[250px] truncate">
                                <div className="flex items-center gap-1 text-sm">
                                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{loja.address}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{loja.phone}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {/* Badges com design similar ao Maxton */}
                                <Badge 
                                  className={loja.status === "ativo" ? maxtonStyles.badgeActive : maxtonStyles.badgeInactive}
                                >
                                  {loja.status.charAt(0).toUpperCase() + loja.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {/* Botões de ação com ícones menores */}
                                <div className="flex items-center gap-1 justify-end transition-all duration-300">
                                  <Button 
                                    variant="default" 
                                    size="icon" 
                                    className={`${maxtonStyles.actionButton} bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-none`}
                                    onClick={() => navigate(`/lojas/${loja.id}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Visualizar</span>
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="icon" 
                                    className={`${maxtonStyles.actionButton} bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 border-none`}
                                    onClick={() => {
                                      setEditingLoja(loja);
                                      setIsFormDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="icon" 
                                    className={`${maxtonStyles.actionButton} bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 border-none`}
                                    onClick={() => deleteStore(loja.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Excluir</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </MaxtonCard>
          </div>

          {/* Coluna de estatísticas com design similar ao Maxton */}
          <div>
            <MaxtonCard className="h-full border rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Estatísticas</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">Visão geral das lojas</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Cards de estatísticas com design similar ao Maxton */}
                <div className="space-y-4">
                  {/* Total de Lojas */}
                  <div className={`transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50`}>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/20 text-primary">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Total de Lojas</p>
                            <p className="text-3xl font-bold text-white mt-1">{stores.length}</p>
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-slate-700/50">
                          <ChevronUp className="h-4 w-4 text-green-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-xs text-slate-400">
                        <span className="text-green-400 font-medium mr-2">+2.5%</span>
                        <span>Mês anterior</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lojas Ativas */}
                  <div className={`transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-emerald-900/30 to-slate-900 border border-emerald-800/30`}>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-500">
                            <Activity className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Lojas Ativas</p>
                            <p className="text-3xl font-bold text-emerald-500 mt-1">{stores.filter(loja => loja.status === "ativo").length}</p>
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-emerald-800/30">
                          <ChevronUp className="h-4 w-4 text-emerald-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-xs text-slate-400">
                        <span className="text-emerald-400 font-medium mr-2">+5.2%</span>
                        <span>Mês anterior</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lojas Inativas */}
                  <div className={`transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50`}>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-slate-600/30 text-slate-400">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Lojas Inativas</p>
                            <p className="text-3xl font-bold text-slate-400 mt-1">{stores.filter(loja => loja.status === "inativo").length}</p>
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-slate-700/50">
                          <ChevronDown className="h-4 w-4 text-red-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-xs text-slate-400">
                        <span className="text-red-400 font-medium mr-2">-1.8%</span>
                        <span>Mês anterior</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </MaxtonCard>
          </div>
        </div>

        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-xl border shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">{editingLoja ? "Editar Loja" : "Nova Loja"}</DialogTitle>
            </DialogHeader>
            <LojaForm 
              loja={editingLoja}
              onSubmit={editingLoja ? handleUpdateStore : handleCreateStore}
              onCancel={() => {
                setIsFormDialogOpen(false);
                setEditingLoja(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LojasPage;