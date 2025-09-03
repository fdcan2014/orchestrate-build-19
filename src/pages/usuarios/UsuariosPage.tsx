import { useState } from "react";
import { Plus, Search, Edit, Trash2, Shield, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MaxtonPageHeader } from "@/components/maxton/MaxtonPageHeader";
import { MaxtonCard } from "@/components/maxton/MaxtonCard";

const usuarios = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao@empresa.com",
    role: "super_admin",
    loja: "Todas",
    status: "ativo",
    ultimoLogin: "2024-01-15",
    initials: "JS"
  },
  {
    id: "2",
    nome: "Maria Santos", 
    email: "maria@empresa.com",
    role: "admin",
    loja: "Loja Centro",
    status: "ativo",
    ultimoLogin: "2024-01-14",
    initials: "MS"
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro@empresa.com",
    role: "usuario",
    loja: "Loja Shopping", 
    status: "ativo",
    ultimoLogin: "2024-01-12",
    initials: "PC"
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    email: "ana@empresa.com", 
    role: "usuario",
    loja: "Loja Norte",
    status: "inativo",
    ultimoLogin: "2024-01-05",
    initials: "AO"
  }
];

const roleLabels = {
  super_admin: "Super Admin",
  admin: "Admin",
  usuario: "Usuário"
};

const roleIcons = {
  super_admin: Crown,
  admin: Shield,
  usuario: User
};

const roleColors = {
  super_admin: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", 
  usuario: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || usuario.role === filterRole;
    const matchesStatus = filterStatus === "all" || usuario.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <MaxtonPageHeader
        title="Usuários"
        subtitle="Gerencie usuários e permissões do sistema"
        breadcrumbs={[
          { label: "Usuários" }
        ]}
        actions={
          <Button className="maxton-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <MaxtonCard
          title="Total Usuários"
          value="4"
          change="3 ativos, 1 inativo"
          icon={<User className="h-5 w-5" />}
          variant="gradient"
        />
        
        <MaxtonCard
          title="Super Admins"
          value="1"
          change="Acesso total"
          icon={<Crown className="h-5 w-5" />}
          variant="gradient"
        />

        <MaxtonCard
          title="Admins"
          value="1"
          change="Gestores de loja"
          icon={<Shield className="h-5 w-5" />}
          variant="gradient"
        />

        <MaxtonCard
          title="Usuários"
          value="2"
          change="Operacionais"
          icon={<User className="h-5 w-5" />}
          variant="gradient"
        />
      </div>

      {/* Filters */}
      <Card className="maxton-card">
        <CardHeader>
          <CardTitle className="maxton-heading-3">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 maxton-input"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40 maxton-input">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="usuario">Usuário</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 maxton-input">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="maxton-card">
        <CardHeader>
          <CardTitle className="maxton-heading-2">Lista de Usuários</CardTitle>
          <CardDescription className="maxton-text-body">
            Gerencie todos os usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-gray-700 font-semibold">Usuário</TableHead>
                <TableHead className="text-gray-700 font-semibold">Função</TableHead>
                <TableHead className="text-gray-700 font-semibold">Loja</TableHead>
                <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                <TableHead className="text-gray-700 font-semibold">Último Login</TableHead>
                <TableHead className="text-right text-gray-700 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => {
                const RoleIcon = roleIcons[usuario.role as keyof typeof roleIcons];
                
                return (
                  <TableRow key={usuario.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
                            {usuario.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{usuario.nome}</div>
                          <div className="text-sm text-gray-500">{usuario.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <RoleIcon className="w-4 h-4 text-gray-600" />
                        <Badge className={roleColors[usuario.role as keyof typeof roleColors]}>
                          {roleLabels[usuario.role as keyof typeof roleLabels]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">{usuario.loja}</TableCell>
                    <TableCell>
                      <Badge className={usuario.status === "ativo" ? "maxton-badge-success" : "maxton-badge-warning"}>
                        {usuario.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{new Date(usuario.ultimoLogin).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}