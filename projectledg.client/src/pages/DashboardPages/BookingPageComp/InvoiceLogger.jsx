import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Switch from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, X, FileText } from "lucide-react"
import invoiceLogger from './invoiceLogger.json'
import invoiceLoggerOutgoing from './invoiceLoggerOutgoing.json'
import LoggerTable from './LoggerTable'
import LoggerPagination from "./LoggerPagination"

export default function InvoiceLogger() {
  const [invoices, setInvoices] = useState(invoiceLogger.mockTestData) // setting at start for testing untill api is implemented
  const [ingoingInvoices, setIngoingInvoices] = useState()
  const [outgoingInvoices, setOutgoingInvoices] = useState()
  
  const [selectedInvoice, setSelectedInvoice] = useState(invoiceLogger)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)  

  // Pagination
  const pagination = 20;
  const [startItem, setStartItem] = useState(0)
  const [endItem, setEndItem] = useState(pagination)
  const [pageNumber, setPageNumber] = useState(1) 

  const totalInvoices = invoices.length; // TODO: Change this to the api variable when endpoint is finished
  const totalPages = Math.ceil(invoices.length / pagination);
  
  // Button toggle
  const [isOn, setIsOn] = useState(false)


  useEffect(() => {
    // TODO: Fetch all ingoing invoices for this company and set invoices & ingoingInvoices
    // setInvoices(mockInvoices) 

    // TODO: Fetch all outgoing invoices for this company and set outgoingInvoices

    setIngoingInvoices(invoiceLogger.mockTestData)
    setOutgoingInvoices(invoiceLoggerOutgoing.mockTestData)
  }, [])


  const handleSetInvoicesOutgoing = () => {  
    // Set invoices to outgoing
    setInvoices(outgoingInvoices)

    // Reset pagination to start values (if on page x it goes back to 1) - and sets pagination number to 1
    setStartItem(0)
    setEndItem(pagination)
    setPageNumber(1)
  }

  const handleSetInvoicesIngoing = () => {
    // Set invoices to outgoing
    setInvoices(ingoingInvoices)

    // Reset pagination to start values (if on page x it goes back to 1) - and sets pagination number to 1
    setStartItem(0)
    setEndItem(pagination)
    setPageNumber(1)
  }

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
    // Save changes to invoice (iterate through and save new array of invoices)
    // Then post changes to api

    // setInvoices(prevInvoices => 
    //   prevInvoices.map(invoice => 
    //     invoice.id === selectedInvoice.id ? selectedInvoice : invoice
    //   )
    // )
    setIsModalOpen(false)
  }


  // Loading skeleton animation
  if (isLoading) {
    return (
      <Card className="w-full h-[600px] flex flex-col shadow-lg">
        <CardHeader className="flex flex-row justify-between border-b">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center dark:text-white">
            <FileText className="mr-2 text-green-500" />
            Fakturor
          </CardTitle>
          <div className="flex gap-2">
            <Skeleton className="h-12 w-56 rounded-md" />
          </div>
          
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 mt-8 ">
          <Skeleton className="h-12 w-[90%] rounded-md" />
          <Skeleton className="h-12 w-[70%] rounded-md" />
          <Skeleton className="h-12 w-[88%] rounded-md" />
          <Skeleton className="h-12 w-[66%] rounded-md" />
          <Skeleton className="h-12 w-[75%] rounded-md" />
          <Skeleton className="h-12 w-[82%] rounded-md" />
          <Skeleton className="h-12 w-[68%] rounded-md" />         
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[40rem] flex flex-col shadow-lg">
      <Tabs defaultValue="ingoing" className="flex flex-col h-full overflow-hidden">
       <CardHeader className="flex flex-row justify-between border-b">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center dark:text-white">
          <FileText className="mr-2 text-green-500" />
          Fakturor
        </CardTitle>
        
        <TabsList className="w-auto rounded-md p-6">
            <TabsTrigger value="ingoing" onClick={handleSetInvoicesIngoing}>Ingående</TabsTrigger>
            <TabsTrigger value="outgoing" onClick={handleSetInvoicesOutgoing}>Utgående</TabsTrigger>
        </TabsList>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Hämtar fakturor...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (      
              // Invoice log table - send in callback function for opening modal popup 
              <LoggerTable
                invoices={invoices}
                handleInvoiceClick={handleInvoiceClick}
                startItem={startItem}
                endItem={endItem}
              />
          )}
          
        </ScrollArea>
        
      </CardContent>
      </Tabs>

      <div className="flex justify-center gap-3 pt-2 mb-3 border-t-2">
        <LoggerPagination 
          totalPages={totalPages} 
          totalInvoices={totalInvoices}
          pagination={pagination}
          setStartItem={setStartItem}
          setEndItem={setEndItem}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
         />
      </div> 
            
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">Verifikation</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="mt-4 space-y-4">
              <DialogDescription>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-600">Fakturanummer:</p>
                    <p>{selectedInvoice.id}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Datum:</p>
                    <p>{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Belopp:</p>
                    <p className="font-bold text-green-600">{selectedInvoice.amount}kr</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Kund:</p>
                    <p>{selectedInvoice.customer}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-gray-600">Beskrivning:</p>
                  <p>{selectedInvoice.description}</p>
                </div>
              </DialogDescription>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="paid-status" className="font-semibold text-gray-600">Betalnings status:</Label>
                  <Switch isOn={isOn} setIsOn={setIsOn}
                    id="paid-status"
                    checked={selectedInvoice.isPaid}
                    onCheckedChange={() => handleStatusChange('isPaid')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="booked-status" className="font-semibold text-gray-600">Bokförnings status:</Label>
                  <Badge variant={selectedInvoice.isBooked ? "success" : "destructive"}>
                    {selectedInvoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span className="ml-1">{selectedInvoice.isBooked ? "Bokförd" : "Ej bokförd"}</span>
                  </Badge>
                </div>
                {!selectedInvoice.isBooked && (
                  <div>
                    <Label htmlFor="additional-info" className="font-semibold text-gray-600">Ytterliggare information:</Label>
                    <Textarea
                      id="additional-info"
                      placeholder="Lägg till ev information till Ledge för att hjälpa till med automatisk bokföring...  "
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
              Bekräfta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}