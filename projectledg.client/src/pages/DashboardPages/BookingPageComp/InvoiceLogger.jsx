import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { axiosConfig } from '/axiosconfig'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Switch from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, X, FileText, Car } from "lucide-react"
import invoiceLogger from './invoiceLogger.json'
import invoiceLoggerOutgoing from './invoiceLoggerOutgoing.json'
import LoggerTable from './LoggerTable'
import LoggerPagination from "./LoggerPagination"
import { RotateCcw } from "lucide-react"


export default function InvoiceLogger() {
  const [invoices, setInvoices] = useState([]) // setting at start for testing untill api is implemented
  const [ingoingInvoices, setIngoingInvoices] = useState()
  const [outgoingInvoices, setOutgoingInvoices] = useState()
  const { companyId } = useParams()


  const [selectedInvoice, setSelectedInvoice] = useState(null)
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
    try { 
      setIsLoading(true)


      async function getIngInvoices() {
        const ingoingInvoicesResponse = await axiosConfig.get(`/IngoingInvoice/all/Company/${companyId}`)
        console.log("INGOING RESPONSE: ", ingoingInvoicesResponse.data)
        setIngoingInvoices(ingoingInvoicesResponse.data)

        // Set default selected invoices to ingoing
        setInvoices(ingoingInvoicesResponse.data)
      }

      async function getOutInvoices() {
        // const outgoingInvoicesResponse = axiosConfig.get(`/Outgoing/all/Company/${companyId}`)
        // console.log("OUTGOING RESPONSE: ", outgoingInvoicesResponse.data)
        // setOutgoingInvoices(outgoingInvoicesResponse.data)
      }

      getIngInvoices();
      getOutInvoices();
    }
    catch (error) {
      console.log("Something went wrong retrieving invoices", error)
    }
    finally {
      setIsLoading(false);
    }


    // TODO: Fetch all outgoing invoices for this company and set outgoingInvoices

    // setIngoingInvoices(invoiceLogger.mockTestData)
    // setOutgoingInvoices(invoiceLoggerOutgoing.mockTestData)
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

  if (invoices.length === 0) {
    return (
      <Card className="w-full h-[600px] flex flex-col shadow-lg">
        <CardHeader className="flex flex-row justify-between border-b">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center dark:text-white">
            <FileText className="mr-2 text-green-500" />
            Fakturor
          </CardTitle>


        </CardHeader>
        <CardContent className="h-full w-full flex flex-col justify-center items-center space-y-2 ">
          <p>Något gick fel</p>
          <Button className="bg-green-500 hover:bg-green-600 space-x-1"
            onClick={""}
          >
            <RotateCcw size={16} /> <span>Ladda om</span>
          </Button>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} className="focus:outline-none ">
        <DialogContent className={` w-auto flex flex-col  min-w-[600px]  min-h-[80vh]`}>
          <DialogHeader className={`${"isBooked" ? "hidden" : "block"}`} >
            <DialogTitle className="text-2xl font-bold text-green-600 ">Verifikation</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
          <div className={`VerificationContainer flex flex-col justify-between h-[80vh] overflow-hidden `}>
            <div className="TopRow p-2 h-full flex flex-col border-gray-100">

              {/* Invoice info section */}
              <div className="FakturaInfo space-y-2 mb-3">
                  <h3 className="font-semibold text-lg mb-4">{selectedInvoice.vendorAddressRecipient} </h3>
                <div className="Fakturanummer grid grid-cols-4 ">

                  <div className="flex flex-col col-span-3 justify-between space-y-2">
                    <p className="font-bold text-lg text-gray-600 mb-1">{selectedInvoice.vendorName}</p>
                    <p className=" text-gray-600 ">Belopp</p>
                    <p className="font-light text-gray-500">Var av moms</p>
                    <p className=" text-gray-600">Fakturadatum</p>
                    <p className=" text-gray-600">Förfallodatum</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <p className="font-bold text-lg text-gray-600 mb-1">{selectedInvoice.invoiceNumber}</p>
                    <p className="font-semibold text-green-600">{selectedInvoice.invoiceTotal }kr</p>
                    <p className="font-light text-gray-500">{selectedInvoice.totalTax}kr</p>
                      <p className="text-gray-600 ">{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                      <p className="text-gray-600 ">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Is paid button */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="paid-status" className="font-normal text-base text-gray-600">Betald</Label>

                  <Switch isOn={isOn} setIsOn={setIsOn}
                    id="paid-status"
                    checked={"invoice.isPaid"}
                    onCheckedChange={"handleIsPaidStatusChange"} />
                </div>
              </div>

              {/* Booking suggestion - bottom row */}
              <div className="BottomRow flex flex-col border-t pt-3">
                <div className="p-0 h-full flex flex-col justify-between space-y-10 ">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Bokföringsförslag</h3>
                    <ScrollArea  className="max-h-[40vh] w-full overflow-y-auto  ">
                      
                    </ScrollArea>
                  </div>

                </div>
              </div>
            </div>
            <DialogFooter className="w-full ">
              <Button onClick={"handleConfirmPress"} className="w-full bg-green-500  hover:bg-green-600 text-white">
                Bekräfta och bokför
              </Button>
            </DialogFooter>
          </div>
          )}
          {/* Success animation for when invoice is booked  */}
          {/* <div className={`${!isBooked ? "hidden" : "block"} `}>
            {isBooked && <SuccessAnimation key={triggerSound} setIsModalOpen={setIsModalOpen} triggerSound={triggerSound} />}
          </div> */}
        </DialogContent>
      </Dialog>
    </Card>
  )
}