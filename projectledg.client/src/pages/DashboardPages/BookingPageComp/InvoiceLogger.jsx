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
import invoiceLogger from './invoiceLogger.json'
import LoggerTable from './LoggerTable'


// Mock data for one invoice
// // const mockInvoices = [
// //   {
// //     id: "INV-001",
// //     date: "2023-07-15",
// //     amount: 1234.56,
// //     isPaid: true,
// //     isBooked: false,
// //     customer: "Acme Corp",
// //     description: "Web development services for Q3",
// //     additionalInfo: ""
// //   }
// ]

const mockInvoices = invoiceLogger;


export default function InvoiceLogger() {
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(invoiceLogger)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [startItem, setStartItem] = useState(0)
  const [endItem, setEndItem] = useState(20)
  const pagination = 20;
  // const mockInvoices = invoiceLogger;

  useEffect(() => {
    // TODO: Fetch all invoices for this company
    setInvoices(mockInvoices) // Temp for testing

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

  const handlePreviousPageClick = () => {
    // Make sure user can't go into the negatives past "page 1"
    if (pageNumber > 1) {
      const updatedPageNumber = pageNumber - 1;
      const updatedEndItem = updatedPageNumber * pagination;
      const updatedStartItem = updatedEndItem - pagination;


      console.log(updatedPageNumber)

      setPageNumber(updatedPageNumber);
      setEndItem(updatedEndItem);
      setStartItem(updatedStartItem);
    }
  }

  const handleNextPageClick = () => {
    // Make sure user can't go into the negatives past the amount of available items
    if (pageNumber < totalPages) {
      const updatedPageNumber = pageNumber + 1;
      const updatedStartItem = pageNumber * pagination;
      const updatedEndItem = Math.min(updatedStartItem + pagination, mockInvoices.mockTestData.length);

      console.log(updatedPageNumber)


      setPageNumber(updatedPageNumber);
      setEndItem(updatedEndItem);
      setStartItem(updatedStartItem);
    }
  }

  return (
    <Card className="w-full h-[40rem] flex flex-col shadow-lg">
       <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
          <FileText className="mr-2 text-green-500" />
          Fakturor
        </CardTitle>
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
            
            // <Table>
            //   <TableHeader>
            //     <TableRow className="bg-gray-100">
            //       <TableHead className="font-bold">Fakturanummer</TableHead>
            //       <TableHead className="font-bold">Fakturadatum</TableHead>
            //       <TableHead className="font-bold">Förfallodatum</TableHead>
            //       <TableHead className="font-bold">Belopp</TableHead>
            //       <TableHead className="font-bold">Status</TableHead>
            //     </TableRow>
            //   </TableHeader>
            //   <TableBody>
            //       {mockInvoices.mockTestData.slice(startItem, endItem).map((invoice) => (
            //       <TableRow
            //         key={invoice.id}
            //         className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            //         onClick={() => handleInvoiceClick(invoice)}
            //       >
            //         <TableCell className="font-medium">{invoice.id}</TableCell>
            //         <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
            //         <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
            //         <TableCell className="font-semibold text-green-600">{invoice.amount}kr</TableCell>
            //         <TableCell>
            //           <div className="flex space-x-2">
            //             <Badge variant={invoice.isPaid ? "success" : "destructive"}>
            //               {invoice.isPaid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            //               <span className="ml-1">{invoice.isPaid ? "Betald" : "Ej betald"}</span>
            //             </Badge>
            //             <Badge variant={invoice.isBooked ? "success" : "destructive"}>
            //               {invoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            //               <span className="ml-1">{invoice.isBooked ? "Bokförd" : "Ej Bokförd"}</span>
            //             </Badge>
            //           </div>
            //         </TableCell>
            //       </TableRow>
            //     ))}
            //   </TableBody>
            // </Table>           
            
            <LoggerTable/>
          )}
        </ScrollArea>
      </CardContent>
      <div className="flex justify-center gap-3 pt-2 mb-3 border-t-2">
        {/* <Button onClick={handlePreviousPageClick} disabled={startItem === 0} className="bg-gray-500 hover:bg-gray-600 text-white">
          Föregående
        </Button>
        <Button onClick={handleNextPageClick} disabled={endItem >= mockInvoices.mockTestData.length} className="bg-gray-500 hover:bg-gray-600 text-white">
          Nästa
        </Button> */}

        <Pagination>
          <PaginationContent>
            {/* Previous button */}
            <PaginationItem disabled={pageNumber === 1}>
              <PaginationPrevious onClick={handlePreviousPageClick}  />
            </PaginationItem>

            {/* Map all pages */}
            {Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => {
              const page = adjustedStartPage + index;
              return (
                <PaginationItem key={page} active={pageNumber === page}>
                  <PaginationLink className={pageNumber === page ? "bg-green-400" : "" }  onClick={() => setPageNumber(page)}>{page}</PaginationLink>
                </PaginationItem>
              );
            })}
            {/* Next button */}
            <PaginationItem disabled={pageNumber === totalPages}>
              <PaginationNext onClick={handleNextPageClick} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
                  <Switch
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