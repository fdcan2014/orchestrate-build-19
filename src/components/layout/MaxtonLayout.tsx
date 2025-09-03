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
      <div className="min-h-screen flex bg-gray-50">
        <MaxtonSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <MaxtonHeader onSidebarToggle={toggleSidebar} />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}