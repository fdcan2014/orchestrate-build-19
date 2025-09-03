import { ReactNode, useState } from "react";
import { MaxtonSidebar } from "./MaxtonSidebar";
import { MaxtonHeader } from "./MaxtonHeader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface MaxtonLayoutProps {
  children: ReactNode;
}

export function MaxtonLayout({ children }: MaxtonLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex overflow-hidden bg-background">
        {/* Sidebar com rolagem independente */}
        <MaxtonSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
        />
        
        {/* Main content area com rolagem independente */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header fixo no topo */}
          <MaxtonHeader onSidebarToggle={toggleSidebar} />
          
          {/* Conteúdo principal com rolagem independente */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/10">
            <div className="max-w-7xl mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}