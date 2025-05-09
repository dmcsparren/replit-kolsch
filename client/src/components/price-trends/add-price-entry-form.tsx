import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { insertIngredientPriceHistorySchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { InventoryItem } from '@shared/schema';

interface AddPriceEntryFormProps {
  ingredients: InventoryItem[];
  onSuccess?: () => void;
  defaultIngredientId?: number;
}

// The following is needed to fix TypeScript errors with null values in fields
function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

export default function AddPriceEntryForm({ 
  ingredients, 
  onSuccess, 
  defaultIngredientId 
}: AddPriceEntryFormProps) {
  const { toast } = useToast();

  // Create a form schema extending the insert schema with validation
  const formSchema = insertIngredientPriceHistorySchema.extend({
    price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a valid positive number",
    }),
    date: z.coerce.date({
      required_error: "A date is required",
    }),
  });

  // Set up the form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredientId: defaultIngredientId || undefined,
      date: new Date(),
      price: '',
      supplier: '',
      notes: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await apiRequest('POST', '/api/price-history', values);
      
      // Reset the form
      form.reset({
        ingredientId: defaultIngredientId || undefined,
        date: new Date(),
        price: '',
        supplier: '',
        notes: '',
      });
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/price-history'] });
      if (values.ingredientId) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/price-history/ingredient', values.ingredientId] 
        });
      }
      
      toast({
        title: 'Success',
        description: 'Price history entry added successfully',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add price history entry',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Price Entry</CardTitle>
        <CardDescription>Record a new ingredient price point</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ingredientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredient</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                    disabled={!!defaultIngredientId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an ingredient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ingredients.map((ingredient) => (
                        <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                          {ingredient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value instanceof Date ? field.value.toISOString().slice(0, 10) : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter supplier name" 
                      {...field} 
                      value={ensureString(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add notes about this price entry" 
                      {...field} 
                      value={ensureString(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Add Price Entry</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}