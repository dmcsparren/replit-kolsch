import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { InventoryItem, IngredientPriceHistory } from '@shared/schema';

interface PriceChartProps {
  priceHistory: IngredientPriceHistory[];
  ingredient?: InventoryItem;
}

export default function PriceChart({ priceHistory, ingredient }: PriceChartProps) {
  // Format data for the chart
  const chartData = priceHistory.map(item => ({
    date: formatDate(item.date),
    price: parseFloat(item.price),
    supplier: item.supplier,
    notes: item.notes,
    rawDate: new Date(item.date).getTime() // For sorting
  }));

  // Sort by date
  chartData.sort((a, b) => a.rawDate - b.rawDate);

  // Calculate price trend metrics
  const calculatePriceTrend = () => {
    if (chartData.length < 2) return { trend: 'stable', percentage: 0 };
    
    const oldest = chartData[0].price;
    const newest = chartData[chartData.length - 1].price;
    const difference = newest - oldest;
    const percentageChange = (difference / oldest) * 100;
    
    return {
      trend: difference > 0 ? 'increasing' : difference < 0 ? 'decreasing' : 'stable',
      percentage: Math.abs(percentageChange).toFixed(1)
    };
  };

  const trend = calculatePriceTrend();
  
  // Determine color for the trend badge
  const getTrendColor = () => {
    switch (trend.trend) {
      case 'increasing': return 'bg-red-100 text-red-800';
      case 'decreasing': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>
            {ingredient ? ingredient.name : 'Ingredient'} Price Trend
          </CardTitle>
          <Badge className={getTrendColor()}>
            {trend.trend === 'increasing' ? '↑' : trend.trend === 'decreasing' ? '↓' : '→'} 
            {trend.percentage}% {trend.trend}
          </Badge>
        </div>
        <CardDescription>
          Price history over time {ingredient ? `for ${ingredient.name}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`$${value}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Price ($)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}