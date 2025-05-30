import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { IngredientSource } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, ExternalLink, Info } from "lucide-react";
import type { LatLngExpression } from "leaflet";

export default function IngredientMapPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([40, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  const { data: ingredientSources = [], isLoading, error } = useQuery<IngredientSource[]>({
    queryKey: ["/api/ingredient-sources"],
  });

  useEffect(() => {
    // Set initial map position if we have data
    if (ingredientSources.length > 0) {
      // Use the first source as default center, or calculate centroid of all points
      const firstSource = ingredientSources[0];
      setMapCenter([
        parseFloat(firstSource.latitude), 
        parseFloat(firstSource.longitude)
      ]);
      setMapZoom(3);
    }
  }, [ingredientSources]);

  // Get unique ingredient types from sources
  const getIngredientTypes = () => {
    if (ingredientSources.length === 0) return [];
    
    const types = new Set<string>();
    ingredientSources.forEach((source) => {
      if (source.suppliedIngredients) {
        source.suppliedIngredients.forEach((ingredient: string) => {
          types.add(ingredient);
        });
      }
    });
    
    return Array.from(types).sort();
  };

  // Get unique supplier types
  const getSupplierTypes = () => {
    if (ingredientSources.length === 0) return [];
    
    const types = new Set<string>();
    ingredientSources.forEach((source) => {
      types.add(source.type);
    });
    
    return Array.from(types).sort();
  };

  // Filter sources by active category
  const filteredSources = activeCategory 
    ? ingredientSources.filter((source) => 
        source.type === activeCategory
      )
    : ingredientSources;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingredient Sources Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[60vh] w-full">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingredient Sources Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 text-center">
              <p className="text-destructive">Failed to load ingredient sources.</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ingredient Sources Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Button 
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(null)}
                className="mb-1"
              >
                All Sources
              </Button>
              
              <div className="border-l pl-2 mr-2"></div>
              
              {getSupplierTypes().map((type) => (
                <Button
                  key={`type-${type}`}
                  variant={activeCategory === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(type)}
                  className="mb-1"
                >
                  {type}
                </Button>
              ))}
              
              <div className="border-l pl-2 mr-2"></div>
              
              {getIngredientTypes().map((ingredient) => (
                <Button
                  key={`ingredient-${ingredient}`}
                  variant={activeCategory === ingredient ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(ingredient)}
                  className="mb-1"
                >
                  {ingredient}
                </Button>
              ))}
            </div>
            
            <div className="h-[60vh] w-full border rounded-md overflow-hidden">
              <MapContainer 
                center={mapCenter} 
                zoom={mapZoom} 
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {filteredSources.map((source) => (
                  <Marker 
                    key={source.id}
                    position={[parseFloat(source.latitude), parseFloat(source.longitude)]}
                  >
                    <Popup>
                      <div className="max-w-xs">
                        <h3 className="font-bold text-lg">{source.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{source.type}</p>
                        
                        <p className="text-sm mb-2">
                          {source.address}, {source.city}, {source.country}
                        </p>
                        
                        {source.description && (
                          <p className="text-sm mb-2">{source.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {source.suppliedIngredients && source.suppliedIngredients.map((ingredient: string) => (
                            <Badge 
                              key={`${source.id}-${ingredient}`} 
                              variant="outline"
                              className="text-xs"
                            >
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mt-2 text-sm">
                          {source.website && (
                            <a 
                              href={source.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:underline"
                            >
                              <ExternalLink size={14} className="mr-1" />
                              Website
                            </a>
                          )}
                          
                          {source.contactEmail && (
                            <a 
                              href={`mailto:${source.contactEmail}`}
                              className="inline-flex items-center text-blue-600 hover:underline"
                            >
                              <Info size={14} className="mr-1" />
                              Contact
                            </a>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}