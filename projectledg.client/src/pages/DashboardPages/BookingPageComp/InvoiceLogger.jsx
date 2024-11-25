import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { axiosConfig } from '/axiosconfig'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Switch from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, X, FileText, Download } from "lucide-react"
// import invoiceLogger from './invoiceLogger.json'
// import invoiceLoggerOutgoing from './invoiceLoggerOutgoing.json'
import LoggerTable from './LoggerTable'
import LoggerPagination from "./LoggerPagination"
import { Input } from "@/components/ui/input"
import ReloadButton from "@/components/ReloadButton"


export default function InvoiceLogger() {
  const [invoices, setInvoices] = useState([])
  const [ingoingInvoices, setIngoingInvoices] = useState([])
  const [outgoingInvoices, setOutgoingInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isIngoingSelected, setIsIngoingSelected] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusIngoing, setStatusIngoing] = useState("loading")
  const [statusOutgoing, setStatusOutgoing] = useState("loading")
  const [error, setError] = useState(null)
  const [isFetchLoading, setIsFetchLoading] = useState(false)
  const { companyId } = useParams()

  // Pagination
  const pagination = 20;
  const [startItem, setStartItem] = useState(0)
  const [endItem, setEndItem] = useState(pagination)
  const [pageNumber, setPageNumber] = useState(1)

  const totalInvoices = invoices.length;
  const totalPages = Math.ceil(invoices.length / pagination);

  // Search filter for logger table
  const [searchQuery, setSearchQuery] = useState("")

  // Button toggle
  // const [isOn, setIsOn] = useState(false)


  useEffect(() => {
    setIsLoading(true)

    getIngInvoices();
    getOutInvoices();

    setIsLoading(false);
  }, [])


  async function getIngInvoices() {
    try {
      setIsFetchLoading(true)

      const ingoingInvoicesResponse = await axiosConfig.get(`/IngoingInvoice/all/Company/${companyId}`)
      // console.log("INGOING RESPONSE: ", ingoingInvoicesResponse.data)

      if (ingoingInvoicesResponse.status === 200) {
        setIngoingInvoices(ingoingInvoicesResponse.data)
        setStatusIngoing("success");

        // Set default invoices to be displayed to ingoing
        setInvoices(ingoingInvoicesResponse.data)
      }
    }
    catch (error) {
      // console.log("Something went wrong retrieving invoices", error)

      if (error.response && error.response.status === 404) {
        setStatusIngoing("empty");
      }
      else {
        setStatusIngoing("error");
      }
    }

    setIsFetchLoading(false)
  }

  async function getOutInvoices() {
    try {
      setIsFetchLoading(true)

      const outgoingInvoicesResponse = await axiosConfig.get(`/OutgoingInvoice/all/Company/${companyId}`)
      // console.log("OUTGOING RESPONSE: ", outgoingInvoicesResponse.data)

      if (outgoingInvoicesResponse.status === 200) {
        setOutgoingInvoices(outgoingInvoicesResponse.data)
        setStatusOutgoing("success");
      }
    }
    catch (error) {
      // console.log("Something went wrong retrieving invoices", error)

      if (error.response && error.response.status === 404) {
        setStatusOutgoing("empty");
      }
      else {
        setStatusOutgoing("error");
      }
    }

    setIsFetchLoading(false)
  }


  const handleSetInvoicesOutgoing = () => {
    // Set invoices to outgoing
    setInvoices(outgoingInvoices)
    setIsIngoingSelected(false)

    // Reset pagination to start values (if on page x it goes back to 1) - and sets pagination number to 1
    setStartItem(0)
    setEndItem(pagination)
    setPageNumber(1)
  }

  const handleSetInvoicesIngoing = () => {
    // Set invoices to outgoing
    setInvoices(ingoingInvoices)
    setIsIngoingSelected(true)

    // Reset pagination to start values (if on page x it goes back to 1) - and sets pagination number to 1
    setStartItem(0)
    setEndItem(pagination)
    setPageNumber(1)
  }

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice({ ...invoice })
    setIsModalOpen(true)
  }

  // const handleStatusChange = (field) => {
  //   if (field === 'isPaid') {
  //     setSelectedInvoice(prev => ({ ...prev, [field]: !prev[field] }))
  //   }
  // }

  // const handleAdditionalInfoChange = (e) => {
  //   setSelectedInvoice(prev => ({ ...prev, additionalInfo: e.target.value }))
  // }

  // const handleSaveChanges = () => {
  //   setIsModalOpen(false)
  // }

  const handleIsPaidStatusChange = (newIsPaid) => {
    setSelectedInvoice((prev) => ({
      ...prev,
      isPaid: newIsPaid,
    }));
  };

  const renderIngoingInvoices = () => {
    if (statusIngoing === "empty") {
      return (
        <CardContent className="h-full w-full flex flex-col justify-center items-center space-y-2 ">
          <p className="text-xl text-center text-gray-400 dark:text-darkSecondary">Ladda upp en Ingående faktura för att se den här!</p>
        </CardContent>
      )
    }
    else if (statusIngoing === "error") {
      return (
        <CardContent className="h-full w-full flex flex-col justify-center items-center space-y-2 ">
          <p>Något gick fel</p>
          <ReloadButton onClick={getIngInvoices} isFetchLoading={isFetchLoading}/>
        </CardContent>
      )
    }
  }

  const renderOutgoingInvoices = () => {
    if (statusOutgoing === "empty") {
      return (
        <CardContent className="h-full w-full flex flex-col justify-center items-center space-y-2 ">
          <p className="text-xl text-center text-gray-400 dark:text-darkSecondary">Skapa en utgående faktura på faktureringssidan för att se den här!</p>
        </CardContent>
      )
    }
    else if (statusOutgoing === "error") {
      return (
        <CardContent className="h-full w-full flex flex-col justify-center items-center space-y-2 ">
          <p>Något gick fel</p>
          <ReloadButton onClick={getOutInvoices} isFetchLoading={isFetchLoading} />
        </CardContent>
      )
    }
  }

  const handleConfirmAndSave = () => {
    try {
      const response = axiosConfig.put(`/IngoingInvoice/update/${selectedInvoice.id}`, selectedInvoice);

      // console.log(response)

      setIsModalOpen(false)

    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };


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
            <Skeleton className="h-12 w-56 rounded-md dark:bg-darkSecondary" />
          </div>

        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 mt-8 ">
          <Skeleton className="h-12 w-[90%] rounded-md dark:bg-darkSecondary" />
          <Skeleton className="h-12 w-[70%] rounded-md dark:bg-darkSecondary" />
          <Skeleton className="h-12 w-[88%] rounded-md dark:bg-darkSecondary" />
          <Skeleton className="h-12 w-[66%] rounded-md dark:bg-darkSecondary" />
          <Skeleton className="h-12 w-[75%] rounded-md dark:bg-darkSecondary" />
          <Skeleton className="h-12 w-[82%] rounded-md dark:bg-darkSecondary" />
          <Skeleton className="h-12 w-[68%] rounded-md dark:bg-darkSecondary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[90vh] md:h-[40rem]  flex flex-col shadow-lg">
      <Tabs defaultValue="ingoing" className="flex flex-col h-full overflow-hidden">
        <CardHeader className="flex flex-row justify-between  dark:border-darkBorder ">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center dark:text-white">
            <FileText className="mr-2 text-green-500" />
            Fakturor
          </CardTitle>

          <div className="flex gap-x-4 items-center ">
            <Input
              type="text"
              placeholder="Sök här..."
              value={searchQuery}
              onChange={handleSearch}
              className="bg-gray-100 hidden lg:block h-[90%] rounded-md "
            />
            <TabsList className="flex flex-col md:flex-row px-2 py-10 w-auto rounded-md md:py-6 md:px-2 dark:bg-darkBackground">
              <TabsTrigger value="ingoing" onClick={handleSetInvoicesIngoing} className="dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white">Ingående</TabsTrigger>
              <TabsTrigger value="outgoing" onClick={handleSetInvoicesOutgoing} className="dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white">Utgående</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>

        {/* Render errors if any depending on if ingoing or outgoing is selected */}
        {isIngoingSelected ? renderIngoingInvoices() : renderOutgoingInvoices()}

        {/* Fallback CardContent for Ingoing */}
        {isIngoingSelected && !renderIngoingInvoices() && (
          <CardContent className="flex-grow overflow-hidden p-0 ">
            <ScrollArea className="h-full bg-gray-200 md:bg-white dark:bg-darkBackground">
              {isLoading ? (
                <div className="flex items-center justify-center h-full ">
                  <p>Hämtar fakturor...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full ">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <LoggerTable
                  invoices={invoices}
                  handleInvoiceClick={handleInvoiceClick}
                  startItem={startItem}
                  endItem={endItem}
                  searchQuery={searchQuery}
                  handleSearch={handleSearch}
                />
              )}
            </ScrollArea>
          </CardContent>
        )}

        {/* Fallback CardContent for Outgoing */}
        {!isIngoingSelected && !renderOutgoingInvoices() && (
          <CardContent className="flex-grow overflow-hidden p-0" >
            <ScrollArea className="h-full bg-gray-200 md:bg-white dark:bg-darkBackground">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Hämtar fakturor...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <LoggerTable
                  invoices={invoices}
                  handleInvoiceClick={handleInvoiceClick}
                  startItem={startItem}
                  endItem={endItem}
                />
              )}
            </ScrollArea>
          </CardContent>
        )}
      </Tabs>

      <div className="flex justify-center gap-3 pt-2 mb-3 border-t-2 dark:border-darkBorder">
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
        <DialogContent className="w-[85vw] rounded-lg dark:bg-darkSurface">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">Faktura verifikation</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="mt-4 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedInvoice.invoiceNumber}</h2>
                  <p className="text-sm text-gray-500 dark:text-darkSecondary">{selectedInvoice.vendorName}</p>
                </div>
                <Badge variant={selectedInvoice.isBooked ? "success" : "destructive"} className="dark:text-white">
                  {selectedInvoice.isBooked ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
                  {selectedInvoice.isBooked ? "Bokförd" : "Ej Bokförd"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-white">Fakturadatum</p>
                  <p className="text-sm text-gray-900 dark:text-darkSecondary">{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-white">Förfallodatum</p>
                  <p className="text-sm text-gray-900 dark:text-darkSecondary">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-white">Belopp</p>
                  <p className="text-lg font-semibold text-green-600">{selectedInvoice.invoiceTotal}kr</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-white">Varav moms</p>
                  <p className="text-sm text-gray-900 dark:text-darkSecondary">{selectedInvoice.totalTax} kr</p>
                </div>
              </div>

              {/* <Separator /> */}

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Betalstatus</span>
                <Switch
                  isOn={selectedInvoice?.isPaid}
                  setIsOn={(value) => handleIsPaidStatusChange(value)}
                />
              </div>

              {/* <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Faktura </h3>
                <p className="text-sm text-gray-500 mb-1">{selectedInvoice.vendorAddressRecipient}</p> */}
              <Button
                variant="outline"
                size="sm"
                className="w-full dark:text-white dark:bg-darkBackground dark:border-darkBorder"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = selectedInvoice.invoiceFilePath; // The URL of the file
                  link.download = selectedInvoice.invoiceFilePath.split('/').pop(); // Optional: Extract the filename from the URL
                  link.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Ladda ner faktura
              </Button>
              {/* </div> */}
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleConfirmAndSave} className="w-full bg-green-500 hover:bg-green-600 text-white">
              Bekräfta och spara
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}