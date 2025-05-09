import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { IngredientPriceHistory } from '@shared/schema';

interface PriceHistoryTableProps {
  priceHistory: IngredientPriceHistory[];
  title?: string;
}

export default function PriceHistoryTable({ priceHistory, title = 'Price History' }: PriceHistoryTableProps) {
  // Sort price history by date (newest first)
  const sortedHistory = [...priceHistory].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Historical price records</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHistory.length > 0 ? (
              sortedHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                  <TableCell>${parseFloat(entry.price).toFixed(2)}</TableCell>
                  <TableCell>{entry.supplier || '—'}</TableCell>
                  <TableCell>{entry.notes || '—'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No price history available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}