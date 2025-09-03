import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings as SettingsIcon, 
  Mail, 
  MessageSquare, 
  CreditCard 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export function MaxtonHeader({ onSidebarToggle }: HeaderProps) {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <header className="h-16 bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          {/* Search com gradiente */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search here..."
              className="pl-10 bg-muted/50 border-border focus:border-primary focus:ring-primary/20 rounded-xl transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications com cores vibrantes */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
            >
              <Mail className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-gradient-to-br from-destructive to-chart-4"
              >
                5
              </Badge>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
            >
              <Bell className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-gradient-to-br from-warning to-chart-3"
              >
                3
              </Badge>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
            >
              <MessageSquare className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-gradient-to-br from-success to-chart-1"
              >
                2
              </Badge>
            </Button>
          </div>

          {/* User Menu com gradiente */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-xl">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-foreground">
                    {user?.user_metadata?.display_name || 'Admin User'}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border border-border shadow-lg rounded-xl">
              <DropdownMenuLabel className="text-foreground">Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}