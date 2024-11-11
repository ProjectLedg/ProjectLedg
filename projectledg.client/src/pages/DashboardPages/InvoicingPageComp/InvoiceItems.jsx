import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";

export function InvoiceItems({ items, handleItemChange, addItem, removeItem }) {
  return (
    <Card className="mb-6 ">
      <CardHeader>
        <CardTitle>Artiklar</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Show the table header only on larger screens */}
        <Table className="hidden lg:table  border-separate border-spacing-2  ">
          <TableHeader>
            <TableRow className="block lg:table-row border-none">
              <TableHead className="pl-0 dark:text-darkSecondary">Beskrivning</TableHead>
              <TableHead className="pl-0 dark:text-darkSecondary">Kvantitet</TableHead>
              <TableHead className="pl-0 dark:text-darkSecondary">Styckpris</TableHead>
              <TableHead className="pl-0 dark:text-darkSecondary">Skattesats %</TableHead>
              <TableHead className="pl-0 dark:text-darkSecondary">Total</TableHead>
              <TableHead className="pl-0 dark:text-darkSecondary"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody >
            {items.map((item, index) => (
              <TableRow
                key={index}
                className="block lg:table-row"
              >
                <TableCell className="pl-0 ">
                  <span className="lg:hidden font-semibold text-sm">Beskrivning</span>
                  <Input
                    placeholder="Artikelbeskrivning"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  />
                </TableCell>
                <TableCell className="pl-0">
                  <span className="lg:hidden font-semibold text-sm">Kvantitet</span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  />
                </TableCell>
                <TableCell className="pl-0">
                  <span className="lg:hidden font-semibold text-sm">Styckpris</span>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                  />
                </TableCell>
                <TableCell className="pl-0">
                  <span className="lg:hidden font-semibold text-sm">Skattesats %</span>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={item.taxPercentage}
                    onChange={(e) => handleItemChange(index, "taxPercentage", e.target.value)}
                  />
                </TableCell>
                <TableCell className="pl-0">
                  <span className="lg:hidden font-semibold text-sm">Total</span>
                  <span className="text-lg">{(item.amount + item.taxAmount).toFixed(2)}kr</span>
                </TableCell>
                <TableCell className="pl-0">
                  <Button variant="destructive" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Mobile version as list */}
        <div className="flex flex-col lg:hidden">
          {items.map((item, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-darkBorder p-4">
              <div className="flex flex-col mb-2">
                <span className="font-normal">Beskrivning</span>
                <Input
                  placeholder="Artikelbeskrivning"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-2">
                <span className="font-normal">Kvantitet</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-2">
                <span className="font-normal">Styckpris</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-6">
                <span className="font-normal">Skattesats %</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={item.taxPercentage}
                  onChange={(e) => handleItemChange(index, "taxPercentage", e.target.value)}
                />
              </div>
              <div className="flex justify-between mb-4 items-center">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-xl">{(item.amount + item.taxAmount).toFixed(2)}kr</span>
              </div>
              <Button variant="destructive"  className="w-full" size="icon" onClick={() => removeItem(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
              
            </div>
            
          ))}
          <Button className="mt-4 self-center bg-green-500 w-[90%] dark:text-white" onClick={addItem}>
            <PlusCircle className="mr-2 h-4 w-4 dark:text-white" /> Lägg till artikel
          </Button>
        </div>

      

        <Button className="hidden lg:flex mt-4 bg-green-500 dark:text-white" onClick={addItem}>
          <PlusCircle className="mr-2 h-4 w-4 dark:text-white" /> Lägg till artikel
        </Button>
      </CardContent>
    </Card>
  );
}
