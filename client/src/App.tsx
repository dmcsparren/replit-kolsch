import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Ingredients from "@/pages/ingredients";
import Equipment from "@/pages/equipment";
import Schedule from "@/pages/schedule";
import Recipes from "@/pages/recipes";
import Reports from "@/pages/reports";
import IngredientMap from "@/pages/ingredient-map";
import PriceTrends from "@/pages/price-trends";
import LandingPage from "@/pages/landing";
import SignupPage from "@/pages/signup";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ErrorBoundary from "@/components/error-boundary";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();
  
  // Check if we're on the landing page
  const isLandingPage = location === "/" || location === "/landing";
  
  // Show landing page for unauthenticated users or when on landing page
  if (isLoading || !isAuthenticated || isLandingPage) {
    return (
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/landing" component={LandingPage} />
        <Route path="/signup" component={SignupPage} />
      </Switch>
    );
  }
  
  // Show the app layout for all other routes
  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 scroll-container">
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/inventory" component={Inventory} />
            <Route path="/ingredients" component={Ingredients} />
            <Route path="/ingredient-map" component={IngredientMap} />
            <Route path="/equipment" component={Equipment} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/recipes" component={Recipes} />
            <Route path="/reports" component={Reports} />
            <Route path="/price-trends" component={PriceTrends} />
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
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
