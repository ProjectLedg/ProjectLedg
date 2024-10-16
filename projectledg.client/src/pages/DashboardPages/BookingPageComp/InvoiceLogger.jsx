import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, FileText } from "lucide-react"

// Mock data for one invoice
const mockInvoices = [
  {
    id: "INV-001",
    date: "2023-07-15",
    amount: 1234.56,
    isPaid: true,
    isBooked: false,
    customer: "Acme Corp",
    description: "Web development services for Q3",
    additionalInfo: ""
  }
]

export default function InvoiceLogger() {
  const [invoices, setInvoices] = useState(mockInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setInvoices(mockInvoices)
  }, [])

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice({ ...invoice })
    setIsModalOpen(true)
  }

  const handleStatusChange = (field) => {
    if (field === 'isPaid') {
      setSelectedInvoice(prev => ({ ...prev, [field]: !prev[field] }))
    }
  }

  const handleAdditionalInfoChange = (e) => {
    setSelectedInvoice(prev => ({ ...prev, additionalInfo: e.target.value }))
  }

  const handleSaveChanges = () => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === selectedInvoice.id ? selectedInvoice : invoice
      )
    )
    setIsModalOpen(false)
  }

  return (
    <Card className="w-full h-[20rem] flex flex-col shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
          <FileText className="mr-2 text-green-500" />
          Invoice Logger
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading invoices...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-bold">Invoice ID</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow 
                    key={invoice.id} 
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleInvoiceClick(invoice)}
                  >
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold text-green-600">${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Badge variant={invoice.isPaid ? "success" : "destructive"}>
                          {invoice.isPaid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          <span className="ml-1">{invoice.isPaid ? "Paid" : "Unpaid"}</span>
                        </Badge>
                        <Badge variant={invoice.isBooked ? "success" : "destructive"}>
                          {invoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          <span className="ml-1">{invoice.isBooked ? "Booked" : "Unbooked"}</span>
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="mt-4 space-y-4">
              <DialogDescription>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-600">Invoice ID:</p>
                    <p>{selectedInvoice.id}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Date:</p>
                    <p>{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Amount:</p>
                    <p className="font-bold text-green-600">${selectedInvoice.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Customer:</p>
                    <p>{selectedInvoice.customer}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-gray-600">Description:</p>
                  <p>{selectedInvoice.description}</p>
                </div>
              </DialogDescription>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="paid-status" className="font-semibold text-gray-600">Paid Status:</Label>
                  <Switch
                    id="paid-status"
                    checked={selectedInvoice.isPaid}
                    onCheckedChange={() => handleStatusChange('isPaid')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="booked-status" className="font-semibold text-gray-600">Booked Status:</Label>
                  <Badge variant={selectedInvoice.isBooked ? "success" : "destructive"}>
                    {selectedInvoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span className="ml-1">{selectedInvoice.isBooked ? "Booked" : "Unbooked"}</span>
                  </Badge>
                </div>
                {!selectedInvoice.isBooked && (
                  <div>
                    <Label htmlFor="additional-info" className="font-semibold text-gray-600">Additional Information for AI Booking:</Label>
                    <Textarea
                      id="additional-info"
                      placeholder="Provide any additional context for the AI to assist with automatic booking..."
                      value={selectedInvoice.additionalInfo}
                      onChange={handleAdditionalInfoChange}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveChanges} className="bg-green-500 hover:bg-green-600 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}