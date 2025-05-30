import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Package2, 
  ShoppingBasket, 
  Settings2, 
  Calendar, 
  Briefcase, 
  Info, 
  X,
  Map,
  TrendingUp,
  LogOut
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useMobile();
  
  // Handle clicking outside to close sidebar on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isMobile && isOpen && (event.target as HTMLElement).id !== "sidebar" && 
          !(event.target as HTMLElement).closest("#sidebar") &&
          (event.target as HTMLElement).id !== "sidebar-toggle") {
        toggleSidebar();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen, toggleSidebar]);
  
  const navigationItems = [
    { path: "/", label: "Dashboard", icon: <Home className="h-5 w-5 mr-3" /> },
    { path: "/inventory", label: "Inventory", icon: <Package2 className="h-5 w-5 mr-3" /> },
    { path: "/ingredients", label: "Ingredients", icon: <ShoppingBasket className="h-5 w-5 mr-3" /> },
    { path: "/ingredient-map", label: "Ingredient Map", icon: <Map className="h-5 w-5 mr-3" /> },
    { path: "/price-trends", label: "Price Trends", icon: <TrendingUp className="h-5 w-5 mr-3" /> },
    { path: "/equipment", label: "Equipment", icon: <Settings2 className="h-5 w-5 mr-3" /> },
    { path: "/schedule", label: "Schedule", icon: <Calendar className="h-5 w-5 mr-3" /> },
    { path: "/recipes", label: "Recipes", icon: <Briefcase className="h-5 w-5 mr-3" /> },
    { path: "/reports", label: "Reports", icon: <Info className="h-5 w-5 mr-3" /> },
  ];
  
  return (
    <aside 
      id="sidebar"
      className={cn(
        "bg-sidebar text-sidebar-foreground w-64 flex-shrink-0 transition-all duration-300 transform",
        "fixed md:static h-full z-50",
        isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-amber-500 flex items-center justify-center text-white font-bold">k</div>
          <h1 className="text-xl font-bold text-primary">kolsch</h1>
        </div>
        
        {isMobile && (
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-full text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      
      <nav className="mt-5 px-2">
        {navigationItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex items-center px-4 py-3 mt-2 rounded-lg group transition-all",
              location && location === item.path 
                ? "bg-primary text-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        
        <div className="border-t border-sidebar-border my-4"></div>
        
        <Link 
          href="/settings"
          className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg group transition-all"
        >
          <Settings2 className="h-5 w-5 mr-3" />
          Settings
        </Link>
        
        <button 
          onClick={async () => {
            try {
              const response = await fetch('/api/logout', { method: 'POST' });
              if (response.ok) {
                window.location.href = '/';
              }
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }}
          className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg group transition-all w-full text-left"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </nav>
      

    </aside>
  );
}
