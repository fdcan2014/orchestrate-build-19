import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/layout/AdminLayout";
import LojasPage from "./pages/lojas/LojasPage";
import NovaLoja from "./pages/lojas/NovaLoja";
import LojaDetalhes from "./pages/lojas/LojaDetalhes";
import UsuariosPage from "./pages/usuarios/UsuariosPage";
import ProdutosPage from "./pages/produtos/ProdutosPage";
import CategoriasPage from "./pages/produtos/CategoriasPage";
import EstoquePage from "./pages/produtos/EstoquePage";
import VendasPage from "./pages/vendas/VendasPage";
import PdvPage from "./pages/vendas/PdvPage";
import { SuporteDashboard } from "./pages/suporte/SuporteDashboard";
import { OrdensServico } from "./pages/suporte/OrdensServico";
import { NovaOS } from "./pages/suporte/NovaOS";
import { ClientesSuporte } from "./pages/suporte/ClientesSuporte";
import { PecasSuporte } from "./pages/suporte/PecasSuporte";
import { RelatoriosSuporte } from "./pages/suporte/RelatoriosSuporte";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { AuthPage } from "./pages/auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
              <Route path="/lojas" element={<AdminLayout><LojasPage /></AdminLayout>} />
              <Route path="/lojas/nova" element={<AdminLayout><NovaLoja /></AdminLayout>} />
              <Route path="/lojas/:id" element={<AdminLayout><LojaDetalhes /></AdminLayout>} />
              <Route path="/usuarios" element={<AdminLayout><UsuariosPage /></AdminLayout>} />
              <Route path="/usuarios/permissoes" element={<AdminLayout><div>Permissões</div></AdminLayout>} />
              <Route path="/produtos" element={<AdminLayout><ProdutosPage /></AdminLayout>} />
              <Route path="/produtos/categorias" element={<AdminLayout><CategoriasPage /></AdminLayout>} />
              <Route path="/produtos/estoque" element={<AdminLayout><EstoquePage /></AdminLayout>} />
              <Route path="/vendas/pdv" element={<AdminLayout><PdvPage /></AdminLayout>} />
              <Route path="/vendas/historico" element={<AdminLayout><VendasPage /></AdminLayout>} />
              <Route path="/vendas/comissoes" element={<AdminLayout><div>Comissões</div></AdminLayout>} />
              <Route path="/suporte/dashboard" element={<AdminLayout><SuporteDashboard /></AdminLayout>} />
              <Route path="/suporte/ordens" element={<AdminLayout><OrdensServico /></AdminLayout>} />
              <Route path="/suporte/nova" element={<AdminLayout><NovaOS /></AdminLayout>} />
              <Route path="/suporte/clientes" element={<AdminLayout><ClientesSuporte /></AdminLayout>} />
              <Route path="/suporte/pecas" element={<AdminLayout><PecasSuporte /></AdminLayout>} />
              <Route path="/suporte/relatorios" element={<AdminLayout><RelatoriosSuporte /></AdminLayout>} />
              <Route path="/relatorios/financeiro" element={<AdminLayout><div>Relatório Financeiro</div></AdminLayout>} />
              <Route path="/relatorios/vendas" element={<AdminLayout><div>Relatório de Vendas</div></AdminLayout>} />
              <Route path="/relatorios/produtos" element={<AdminLayout><div>Relatório de Produtos</div></AdminLayout>} />
              <Route path="/configuracoes" element={<AdminLayout><div>Configurações</div></AdminLayout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
