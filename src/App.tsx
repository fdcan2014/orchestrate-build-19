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
import { MaxtonLayout } from "./components/layout/MaxtonLayout";
import MaxtonDashboardPage from "./pages/MaxtonDashboardPage";

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
              <Route path="/admin" element={<MaxtonLayout><AdminDashboard /></MaxtonLayout>} />
              <Route path="/dashboard" element={<MaxtonLayout><MaxtonDashboardPage /></MaxtonLayout>} />
              <Route path="/lojas" element={<MaxtonLayout><LojasPage /></MaxtonLayout>} />
              <Route path="/lojas/nova" element={<MaxtonLayout><NovaLoja /></MaxtonLayout>} />
              <Route path="/lojas/:id" element={<MaxtonLayout><LojaDetalhes /></MaxtonLayout>} />
              <Route path="/usuarios" element={<MaxtonLayout><UsuariosPage /></MaxtonLayout>} />
              <Route path="/usuarios/permissoes" element={<MaxtonLayout><div>Permissões</div></MaxtonLayout>} />
              <Route path="/produtos" element={<MaxtonLayout><ProdutosPage /></MaxtonLayout>} />
              <Route path="/produtos/categorias" element={<MaxtonLayout><CategoriasPage /></MaxtonLayout>} />
              <Route path="/produtos/estoque" element={<MaxtonLayout><EstoquePage /></MaxtonLayout>} />
              <Route path="/vendas/pdv" element={<MaxtonLayout><PdvPage /></MaxtonLayout>} />
              <Route path="/vendas/historico" element={<MaxtonLayout><VendasPage /></MaxtonLayout>} />
              <Route path="/vendas/comissoes" element={<MaxtonLayout><div>Comissões</div></MaxtonLayout>} />
              <Route path="/suporte/dashboard" element={<MaxtonLayout><SuporteDashboard /></MaxtonLayout>} />
              <Route path="/suporte/ordens" element={<MaxtonLayout><OrdensServico /></MaxtonLayout>} />
              <Route path="/suporte/nova" element={<MaxtonLayout><NovaOS /></MaxtonLayout>} />
              <Route path="/suporte/clientes" element={<MaxtonLayout><ClientesSuporte /></MaxtonLayout>} />
              <Route path="/suporte/pecas" element={<MaxtonLayout><PecasSuporte /></MaxtonLayout>} />
              <Route path="/suporte/relatorios" element={<MaxtonLayout><RelatoriosSuporte /></MaxtonLayout>} />
              <Route path="/relatorios/financeiro" element={<MaxtonLayout><div>Relatório Financeiro</div></MaxtonLayout>} />
              <Route path="/relatorios/vendas" element={<MaxtonLayout><div>Relatório de Vendas</div></MaxtonLayout>} />
              <Route path="/relatorios/produtos" element={<MaxtonLayout><div>Relatório de Produtos</div></MaxtonLayout>} />
              <Route path="/configuracoes" element={<MaxtonLayout><div>Configurações</div></MaxtonLayout>} />
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
