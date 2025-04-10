import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Ingredients from "@/pages/ingredients";
import Equipment from "@/pages/equipment";
import Schedule from "@/pages/schedule";
import Recipes from "@/pages/recipes";
import Reports from "@/pages/reports";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

function Router() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 scroll-container">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/inventory" component={Inventory} />
            <Route path="/ingredients" component={Ingredients} />
            <Route path="/equipment" component={Equipment} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/recipes" component={Recipes} />
            <Route path="/reports" component={Reports} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
