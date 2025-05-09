import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import PriceChart from '@/components/price-trends/price-chart';
import PriceHistoryTable from '@/components/price-trends/price-history-table';
import AddPriceEntryForm from '@/components/price-trends/add-price-entry-form';
import { InventoryItem, IngredientPriceHistory } from '@shared/schema';

export default function PriceTrendsPage() {
  const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null);

  // Fetch all inventory items
  const { data: ingredients = [], isLoading: isLoadingIngredients, error: ingredientsError } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory'],
  });

  // Fetch price history for selected ingredient
  const { data: priceHistory = [], isLoading: isLoadingHistory, error: historyError } = useQuery<IngredientPriceHistory[]>({
    queryKey: ['/api/price-history/ingredient', selectedIngredientId],
    enabled: !!selectedIngredientId,
  });

  // Fetch all price history
  const { data: allPriceHistory = [], isLoading: isLoadingAllHistory, error: allHistoryError } = useQuery<IngredientPriceHistory[]>({
    queryKey: ['/api/price-history'],
  });

  // Find selected ingredient details
  const selectedIngredient = ingredients.find(i => i.id === selectedIngredientId);

  // Group price history by ingredient for overview
  const ingredientPriceMap = new Map<number, IngredientPriceHistory[]>();
  allPriceHistory.forEach(entry => {
    const existing = ingredientPriceMap.get(entry.ingredientId) || [];
    ingredientPriceMap.set(entry.ingredientId, [...existing, entry]);
  });

  // Handle errors
  const hasError = ingredientsError || historyError || allHistoryError;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Ingredient Price Trends</h1>
      
      {hasError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load data. Please try again later.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="single">Single Ingredient</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* Single Ingredient View */}
        <TabsContent value="single">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingredient Selection</CardTitle>
                  <CardDescription>Select an ingredient to view its price history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="ingredient">Ingredient</Label>
                      <Select 
                        onValueChange={(value) => setSelectedIngredientId(Number(value))}
                        value={selectedIngredientId?.toString() || ''}
                      >
                        <SelectTrigger id="ingredient">
                          <SelectValue placeholder="Select an ingredient" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {ingredients.map((ingredient) => (
                            <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                              {ingredient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedIngredientId && (
                <>
                  {isLoadingHistory ? (
                    <div className="flex justify-center items-center h-64">
                      <p>Loading price history...</p>
                    </div>
                  ) : priceHistory.length > 0 ? (
                    <PriceChart priceHistory={priceHistory} ingredient={selectedIngredient} />
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No price history available for this ingredient.</p>
                          <p className="mt-2">Add a price entry to get started.</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {priceHistory.length > 0 && (
                    <PriceHistoryTable 
                      priceHistory={priceHistory} 
                      title={`${selectedIngredient?.name} Price History`} 
                    />
                  )}
                </>
              )}
            </div>
            
            <div>
              <AddPriceEntryForm 
                ingredients={ingredients} 
                onSuccess={() => {}} 
                defaultIngredientId={selectedIngredientId || undefined} 
              />
            </div>
          </div>
        </TabsContent>

        {/* Overview View */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Price Trends Overview</CardTitle>
                  <CardDescription>
                    Price trends for all ingredients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAllHistory ? (
                    <div className="flex justify-center items-center h-64">
                      <p>Loading price data...</p>
                    </div>
                  ) : Array.from(ingredientPriceMap.entries()).length > 0 ? (
                    <div className="space-y-8">
                      {Array.from(ingredientPriceMap.entries()).map(([ingredientId, history]) => {
                        const ingredient = ingredients.find(i => i.id === ingredientId);
                        if (!ingredient || history.length < 2) return null;
                        
                        return (
                          <div key={ingredientId} className="space-y-3">
                            <h3 className="text-lg font-semibold">{ingredient.name}</h3>
                            <PriceChart 
                              priceHistory={history} 
                              ingredient={ingredient} 
                            />
                            <Separator className="my-4" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No price history data available.</p>
                      <p className="mt-2">Add price entries to see trends.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <AddPriceEntryForm 
                ingredients={ingredients} 
                onSuccess={() => {}} 
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}