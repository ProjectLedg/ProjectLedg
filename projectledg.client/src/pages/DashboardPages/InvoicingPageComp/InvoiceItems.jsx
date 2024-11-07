import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";

export function InvoiceItems({ items, handleItemChange, addItem, removeItem }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Artiklar</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Beskrivning</TableHead>
              <TableHead>Kvantitet</TableHead>
              <TableHead>Styckpris</TableHead>
              <TableHead>Belopp</TableHead>
              <TableHead>Skattesats %</TableHead>
              <TableHead>Skattbelopp</TableHead>
              <TableHead>Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input 
                    placeholder="Artikel beskrivning" 
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                  />
                </TableCell>
                <TableCell>{item.amount.toFixed(2)}kr</TableCell>
                <TableCell>
                  <Input 
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={item.taxPercentage}
                    onChange={(e) => handleItemChange(index, "taxPercentage", e.target.value)}
                  />
                </TableCell>
                <TableCell>{item.taxAmount.toFixed(2)}kr</TableCell>
                <TableCell>{(item.amount + item.taxAmount).toFixed(2)}kr</TableCell>
                <TableCell>
                  <Button variant="destructive" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4 bg-green-500" onClick={addItem}>
          <PlusCircle className="mr-2 h-4 w-4" /> Lägg till artikel
        </Button>
      </CardContent>
    </Card>
  );
}