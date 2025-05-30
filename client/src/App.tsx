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
import BrewingProcess from "@/pages/brewing-process";
import LandingPage from "@/pages/landing";
import SignupPage from "@/pages/signup";
import LoginPage from "@/pages/login";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ErrorBoundary from "@/components/error-boundary";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/signup', '/login', '/landing'];
  const isPublicRoute = location ? publicRoutes.includes(location) : false;

  useEffect(() => {
    // Only show auth error for private routes when user is definitely not authenticated
    if (!isLoading && !isAuthenticated && !isPublicRoute && location !== '/') {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
    }
  }, [isLoading, isAuthenticated, isPublicRoute, toast, location]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if we're on the landing page
  const isLandingPage = location === "/" || location === "/landing";

  // Show landing page for unauthenticated users or when on landing page
  if (!isAuthenticated || isLandingPage) {
    return (
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/landing" component={LandingPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/login" component={LoginPage} />
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
            <Route path="/brewing-process" component={BrewingProcess} />
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