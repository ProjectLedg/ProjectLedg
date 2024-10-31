import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InvoiceDetails({ invoice, handleInputChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detaljer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="invoiceNumber">Fakturanummer</Label>
            <Input 
              id="invoiceNumber" 
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="invoiceDate">Faktureringsdatum</Label>
            <Input 
              id="invoiceDate" 
              name="invoiceDate"
              type="date" 
              value={invoice.invoiceDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Förfallodatum</Label>
            <Input 
              id="dueDate" 
              name="dueDate"
              type="date" 
              value={invoice.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="paymentDetails">Bankgironummer</Label>
            <Input 
              id="paymentDetails" 
              name="paymentDetails"
              value={invoice.paymentDetails}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}