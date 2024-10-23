import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2 } from "lucide-react"

export default function InvoicingPage() {
  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    invoiceTotal: 0,
    items: [{ description: "", quantity: "1", unitPrice: "0", amount: 0, taxPercentage: "0", taxAmount: 0 }],
    paymentDetails: "",
    totalTax: 0,
    customerName: "",
    customerAddress: "",
    customerAddressRecipient: "",
    vendorName: "",
    vendorAddress: "",
    vendorAddressRecipient: "",
    vendorTaxId: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setInvoice(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items]
    if (field === "description") {
      newItems[index][field] = value
    } else {
      // Remove leading zeros and handle decimal input
      const formattedValue = value.replace(/^0+(?=\d)/, '').replace(/^\./, '0.')
      newItems[index][field] = formattedValue
      
      // Ensure non-negative values for calculations
      const numericValue = parseFloat(formattedValue) || 0
      if (field === "quantity") newItems[index].quantity = Math.max(0, numericValue).toString()
      if (field === "unitPrice") newItems[index].unitPrice = Math.max(0, numericValue).toString()
      if (field === "taxPercentage") newItems[index].taxPercentage = Math.min(100, Math.max(0, numericValue)).toString()
    }
    
    // Recalculate amount and tax
    const quantity = parseFloat(newItems[index].quantity) || 0
    const unitPrice = parseFloat(newItems[index].unitPrice) || 0
    const taxPercentage = parseFloat(newItems[index].taxPercentage) || 0
    
    newItems[index].amount = roundToCent(quantity * unitPrice)
    newItems[index].taxAmount = roundToCent(newItems[index].amount * (taxPercentage / 100))

    const newTotalTax = roundToCent(newItems.reduce((sum, item) => sum + item.taxAmount, 0))
    const newInvoiceTotal = roundToCent(newItems.reduce((sum, item) => sum + item.amount + item.taxAmount, 0))

    setInvoice(prev => ({
      ...prev,
      items: newItems,
      totalTax: newTotalTax,
      invoiceTotal: newInvoiceTotal
    }))
  }

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: "1", unitPrice: "0", amount: 0, taxPercentage: "0", taxAmount: 0 }]
    }))
  }

  const removeItem = (index) => {
    const newItems = invoice.items.filter((_, i) => i !== index)
    const newTotalTax = roundToCent(newItems.reduce((sum, item) => sum + item.taxAmount, 0))
    const newInvoiceTotal = roundToCent(newItems.reduce((sum, item) => sum + item.amount + item.taxAmount, 0))
    setInvoice(prev => ({
      ...prev,
      items: newItems,
      totalTax: newTotalTax,
      invoiceTotal: newInvoiceTotal
    }))
  }

  // Function to round to nearest cent
  const roundToCent = (amount) => {
    return Math.round(amount * 100) / 100
  }

  return (
    <div className="container mx-auto p-6">
      <style jsx global>{`
        /* Remove spinner for webkit browsers */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        /* Remove spinner for Firefox */
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      <h1 className="text-3xl font-bold mb-6">Create Invoice</h1>
      
      <Tabs defaultValue="details" className="mb-6">
        <TabsList>
          <TabsTrigger value="details">Invoice Details</TabsTrigger>
          <TabsTrigger value="customer">Customer Info</TabsTrigger>
          <TabsTrigger value="vendor">Vendor Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input 
                    id="invoiceNumber" 
                    name="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input 
                    id="invoiceDate" 
                    name="invoiceDate"
                    type="date" 
                    value={invoice.invoiceDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input 
                    id="dueDate" 
                    name="dueDate"
                    type="date" 
                    value={invoice.dueDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentDetails">Payment Details</Label>
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
        </TabsContent>
        
        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input 
                    id="customerName" 
                    name="customerName"
                    value={invoice.customerName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Textarea 
                    id="customerAddress" 
                    name="customerAddress"
                    value={invoice.customerAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddressRecipient">Customer Address Recipient</Label>
                  <Input 
                    id="customerAddressRecipient" 
                    name="customerAddressRecipient"
                    value={invoice.customerAddressRecipient}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vendor">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input 
                    id="vendorName" 
                    name="vendorName"
                    value={invoice.vendorName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="vendorAddress">Vendor Address</Label>
                  <Textarea 
                    id="vendorAddress" 
                    name="vendorAddress"
                    value={invoice.vendorAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="vendorAddressRecipient">Vendor Address Recipient</Label>
                  <Input 
                    id="vendorAddressRecipient" 
                    name="vendorAddressRecipient"
                    value={invoice.vendorAddressRecipient}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="vendorTaxId">Vendor Tax ID</Label>
                  <Input 
                    id="vendorTaxId" 
                    name="vendorTaxId"
                    value={invoice.vendorTaxId}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Tax %</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      placeholder="Item description" 
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
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Input 
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      value={item.taxPercentage}
                      onChange={(e) => handleItemChange(index, "taxPercentage", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>${item.taxAmount.toFixed(2)}</TableCell>
                  <TableCell>${(item.amount + item.taxAmount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="icon" onClick={() => removeItem(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4" onClick={addItem}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${invoice.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Tax:</span>
              <span>${invoice.totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Invoice Total:</span>
              <span>${invoice.invoiceTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="mr-2">Save Invoice</Button>
        <Button variant="outline">Generate PDF</Button>
      </div>
    </div>
  )
}