import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InvoiceSummary({ items, totalTax, invoiceTotal }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Faktura summering</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Delsumma:</span>
            <span>{items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)} kr</span>
          </div>
          <div className="flex justify-between">
            <span>Total Skatt:</span>
            <span>{totalTax.toFixed(2)} kr</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Totalt Belopp:</span>
            <span>{invoiceTotal.toFixed(2)} kr</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}