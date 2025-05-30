import { useLocation } from "wouter";
import { Bell, Menu, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";

type HeaderProps = {
  toggleSidebar: () => void;
};

export default function Header({ toggleSidebar }: HeaderProps) {
  const [location] = useLocation();
  const isMobile = useMobile();
  const { user } = useAuth();
  
  // Get page title from location
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/inventory":
        return "Inventory";
      case "/ingredients":
        return "Ingredients";
      case "/equipment":
        return "Equipment";
      case "/schedule":
        return "Schedule";
      case "/recipes":
        return "Recipes";
      case "/reports":
        return "Reports";
      case "/settings":
        return "Settings";
      default:
        return "";
    }
  };
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Button 
              id="sidebar-toggle" 
              onClick={toggleSidebar} 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <h1 className="text-xl font-bold text-neutral-800 hidden sm:block">
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="w-full sm:w-[200px] pl-9"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-accent"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.location.href = '/api/clear-session'}
            className="text-neutral-600 hover:text-amber-600"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
          
          {user && (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-amber-700 flex items-center justify-center text-white text-sm font-bold">
                {(user as any)?.user?.firstName?.[0] || (user as any)?.firstName?.[0] || 'U'}{(user as any)?.user?.lastName?.[0] || (user as any)?.lastName?.[0] || ''}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-neutral-800">
                  {(user as any)?.user?.firstName || (user as any)?.firstName || 'User'} {(user as any)?.user?.lastName || (user as any)?.lastName || ''}
                </p>
                <p className="text-xs text-neutral-500">{(user as any)?.user?.role || (user as any)?.role || 'Member'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
