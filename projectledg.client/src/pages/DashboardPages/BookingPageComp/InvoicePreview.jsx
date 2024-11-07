import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Switch from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, X, FileText, Send, Paperclip, Bot } from "lucide-react"
import ChatWindow from "../DashboardPageComp/ChatWindow"
import Typewriter from "@/Typewriter"
import ChatLoader from "@/ChatLoader"

export default function InvoicePreview({ invoice, setInvoice, isUploadLoading, setIsUploadLoading }) {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const scrollAreaRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPreviewAnimation, setShowPreviewAnimation] = useState(false);
  const [isOn, setIsOn] = useState(false)

  // Modal chat 
  const [input, setInput] = useState('');

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [hasMessages, setHasMessages] = useState(messages.length > 0);
  const [loading, setLoading] = useState(false);






  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleChatSubmit = async (e, inputText = input) => {
    if (e) e.preventDefault();
    if (inputText.trim()) {
      const newMessage = { text: inputText, type: 'sent' };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setHasMessages(true);
      setInput('');

      setLoading(true);

      const response = await handleSend(inputText);

      const responseMessage = { text: response, type: 'received', isTyping: true };
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
      setLoading(false);
    }
  };

  const handleSend = async (input) => {
    try {
      const response = await sendMessage(input);
      console.log('Response from server:', response);
      return response || 'No response received';
    } catch (error) {
      console.error("Error while sending message:", error);
      return 'Error occurred while sending message';
    }
  };

  const sendMessage = async (input) => {
    try {
      const response = await axios.post(
        'https://projectledg.azurewebsites.net/api/Assistant/chat',
        JSON.stringify(input),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      console.error("Failed to send message", error);
      throw error; // Rethrow the error if you want to handle it further up
    }
  }

  const renderedMessages = messages.map((message, index) => (
    <div
      key={index}
      className={`mb-12 flex items-start ${message.type === 'sent' ? 'self-end' : 'self-start'}`}
    >
      {message.type === 'received' && (
        <div className='p-2 mt-1 border-2 rounded-full '>
          <Bot className="w-4 h-4 " />
        </div>
      )}
      <div
        className={`${message.type === 'sent'
          ? 'bg-green-500 px-5 py-3 rounded-3xl shadow-xl ml-auto max-w-64 text-white break-words whitespace-normal'
          : 'prose bg-gray-100 p-2 rounded-3xl  max-w-[100%] text-black'
          }`}
      >
        {message.type === 'sent' || !message.isTyping ? (
          <ReactMarkdown>{message.text}</ReactMarkdown>
        ) : (
          <Typewriter text={message.text} delay={5} onComplete={() => {
            setMessages((prevMessages) =>
              prevMessages.map((msg, i) =>
                i === index ? { ...msg, isTyping: false } : msg
              )
            );
          }} />

        )}
      </div>
    </div>
  ));



  // Sets state for showing preview fade in animation when upload invoice is loading
  useEffect(() => {
    if (!isUploadLoading) {
      setShowPreviewAnimation(true);
    } else {
      setShowPreviewAnimation(false);
    }
  }, [isUploadLoading]);

  // console.log("INVOICE PREVIEW: ", invoice)

  // Handles iterating through and updatign the invoice with edited input
  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target

    // Check if input is part of the item nested object, we have to iterate through the array and reconstruct it with the updated values
    if (name.startsWith("item")) {
      // Extract the item index from dataset
      const index = dataset.index;
      const propertyName = name.replace('item', '').charAt(0) + name.slice(5);

      // Update the specific item in the items array
      setInvoice(prev => {
        const updatedItems = prev.Items.map((item, i) =>
          i === parseInt(index) ? { ...item, [propertyName]: value } : item
        );

        return {
          ...prev,
          Items: updatedItems
        };
      });
    } else {
      // For the rest of the fields in the invoice object
      setInvoice(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsPreviewLoading(true)

    try {
      // const formData = new FormData()
      // formData.append('invoice', selectedFile)
      // formData.append('additionalInfo', additionalInfo)

      // Don't think we need to post changes to api here, we want the modal to pop up instead right?
      // Then confirm and in the modal (invoice logger) then post to backend.

      // const response = await axios.post('/api/upload-invoice', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })

      setIsModalOpen(true);

      console.log('Upload successful:', response.data)
      // Here you might want to show a success message to the user
    } catch (error) {
      console.error('Upload failed:', error)
      // Here you might want to show an error message to the user
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const handleSaveChanges = () => {
    // Post and save changes to backend API 
    // NEED TO IMPLEMENT WHEN BACKEND API ENDPOINTS ARE FIXED

    setIsModalOpen(false)
  }
  
  // Temp to populate modal popup table
  const rows = Array(12).fill(null)

  // Loading skeleton animation while wating for invoice to upload
  if (isUploadLoading) {
    return (
      <Card
        className="w-full h-[600px] flex flex-col shadow-lg border">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white ">Förhandsgranska faktura</CardTitle>
        </CardHeader>

        {/* Fade in for skeleton loader */}
        {isUploadLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Skeleton className="h-12 w-[100%] rounded-none" />
            <CardContent className="h-full overflow-hidden grid grid-cols-1 gap-4">
              <div className="space-y-2 mt-8">
                <Skeleton className="h-4 w-[40%] mt-2" />
                <Skeleton className="h-12 w-[85%] rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[25%] mt-2" />
                <Skeleton className="h-12 w-[70%] rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[50%] mt-2" />
                <Skeleton className="h-12 w-[80%] rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[30%] mt-2" />
                <Skeleton className="h-12 w-[65%] rounded-md" />
              </div>
            </CardContent>
          </motion.div>
        )}
      </Card>
    )
  }

  // Display text if there's no invoice yet
  if (!invoice) {
    return (
      <Card className="w-full h-[600px] flex flex-col shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Förhandsgranska faktura</CardTitle>
        </CardHeader>
        <CardContent className=" h-[75%] flex justify-center items-center p-0 ">
          <h3 className="text-xl text-gray-400">Ladda upp en faktura för att förhandsgranska</h3>
        </CardContent>
      </Card>
    )
  }


  // Display invoice preview
  return (
    <Card className="w-full h-[600px] flex flex-col justify-between shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Förhandsgranska faktura</CardTitle>
      </CardHeader>

      <div className="flex flex-grow flex-col overflow-hidden">
        {/* Animation fade-in for when analyzing invoice */}
        {showPreviewAnimation && (
          <motion.div
            className="overflow-hidden bottom-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Buttons to select different parts of the invoice */}
            <Tabs defaultValue="details" className="flex flex-col h-full">
              <TabsList className="w-full border-b rounded-none p-6 overflow-hidden">
                <TabsTrigger value="details" className="w-full p-3">Faktura</TabsTrigger>
                <TabsTrigger value="customer" className="w-full p-3">Kund</TabsTrigger>
                <TabsTrigger value="vendor" className="w-full p-3">Leverantör</TabsTrigger>
                <TabsTrigger value="items" className="w-full p-3">Specifikation</TabsTrigger>
              </TabsList>


              {/* All invoice tabs and their contents  */}
              <CardContent className="flex-grow overflow-y-auto p-0 ">
                <ScrollArea className="h-full px-4" ref={scrollAreaRef}>

                  {/* General invoice info */}
                  <TabsContent value="details">
                    <Card className="border-0 shadow-none">
                      <CardContent>
                        <section className="grid grid-cols-1 gap-4 mt-6">
                          <article>
                            <Label htmlFor="invoiceNumber">Fakturanummer</Label>
                            <Input
                              id="invoiceNumber"
                              name="invoiceNumber"
                              value={invoice.InvoiceId}
                              placeholder={invoice.InvoiceId ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="invoiceTotal">Totalt belopp</Label>
                            <div className="relative w-full">
                              <Input
                                id="invoiceTotal"
                                name="invoiceTotal"
                                value={invoice.InvoiceTotal}
                                placeholder={invoice.InvoiceTotal ? null : "Ej Läsbart"}

                                onChange={handleInputChange}
                              />
                              <div className="absolute right-0 top-0 h-full flex items-center bg-slate-400 text-white rounded-r-md px-4 text-sm">kr</div>
                            </div>
                          </article>
                          <article>
                            <Label htmlFor="totalTax">Total moms</Label>
                            <div className="relative w-full">
                              <Input
                                id="totalTax"
                                name="totalTax"
                                value={invoice.TotalTax}
                                placeholder={invoice.TotalTax ? null : "Ej Läsbart"}
                                onChange={handleInputChange}
                              />
                              <div className="absolute right-0 top-0 h-full flex items-center bg-slate-400 text-white rounded-r-md px-4 text-sm">kr</div>
                            </div>
                          </article>
                          <article>
                            <Label htmlFor="invoiceDate">Fakturadatum</Label>
                            <Input
                              id="invoiceDate"
                              name="invoiceDate"
                              type="date"
                              value={invoice.InvoiceDate}
                              placeholder={invoice.InvoiceDate ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="dueDate">Förfallodatum</Label>
                            <Input
                              id="dueDate"
                              name="dueDate"
                              type="date"
                              value={invoice.DueDate}
                              placeholder={invoice.DueDate ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="paymentDetails">Bankgiro/PlusGiro</Label>
                            <Input
                              id="paymentDetails"
                              name="paymentDetails"
                              value={invoice.PaymentDetails}
                              placeholder={invoice.PaymentDetails.Length == 0 ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                        </section>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Customer info */}
                  <TabsContent value="customer">
                    <Card className="border-0 shadow-none">
                      <CardContent>
                        <section className="space-y-4 mt-6">
                          <article>
                            <Label htmlFor="customerName">Kundnamn</Label>
                            <Input
                              id="customerName"
                              name="customerName"
                              value={invoice.CustomerName}
                              placeholder={invoice.CustomerName ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="customerAddress">Kundadress</Label>
                            <Input
                              id="customerAddress"
                              name="customerAddress"
                              value={invoice.CustomerAddress}
                              placeholder={invoice.CustomerAddress ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="customerAddressRecipient">Kundadressmottagare</Label>
                            <Input
                              id="customerAddressRecipient"
                              name="customerAddressRecipient"
                              value={invoice.CustomerAddressRecipient}
                              placeholder={invoice.CustomerAddressRecipient ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                        </section>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Vendor info */}
                  <TabsContent value="vendor">
                    <Card className="border-0 shadow-none">
                      <CardContent>
                        <section className="space-y-4 mt-6">
                          <article>
                            <Label htmlFor="vendorName">Leverantörsnamn</Label>
                            <Input
                              id="vendorName"
                              name="vendorName"
                              value={invoice.VendorName}
                              placeholder={invoice.VendorName ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="vendorAddress">Leverantörsadress</Label>
                            <Input
                              id="vendorAddress"
                              name="vendorAddress"
                              value={invoice.VendorAddress}
                              placeholder={invoice.VendorAddress ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="vendorAddressRecipient">Leverantörsadressmottagare</Label>
                            <Input
                              id="vendorAddressRecipient"
                              name="vendorAddressRecipient"
                              value={invoice.VendorAddressRecipient}
                              placeholder={invoice.VendorAddressRecipient ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="vendorTaxId">Momsregistreringsnummer</Label>
                            <Input
                              id="vendorTaxId"
                              name="vendorTaxId"
                              value={invoice.VendorTaxId}
                              placeholder={invoice.VendorTaxId ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                        </section>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Invoice specification (each item on the invoice) */}
                  <TabsContent value="items">
                    {invoice.Items.map((item, i) => (
                      <Card key={i} className="mb-4 border-0 border-b-2 rounded-none shadow-none space-y-4 mt-6">
                        <CardContent className="shadow-none">
                          {/* <h2 className="mb-2 font-medium">Artikel: {i + 1}</h2> */}
                          <section className="grid grid-flow-row grid-cols-12 grid-rows-3 gap-4 mb-2 ">
                            <article className="col-span-full">
                              <Label htmlFor="itemDescription">Beskrivning</Label>
                              <Input
                                id="itemDescription"
                                name="itemDescription"
                                value={item.Description ? item.Description : null}
                                placeholder={item.Description ? null : "Ej läsbart"}
                                data-index={i}
                                onChange={handleInputChange}
                              />
                            </article>
                            <article className="col-span-5">
                              <Label htmlFor="itemAmount">Belopp</Label>
                              <div className="relative w-full">
                                <Input
                                  id="itemAmount"
                                  name="itemAmount"
                                  value={item.Amount ? item.Amount : null}
                                  placeholder={item.Amount ? null : "Ej läsbart"}
                                  data-index={i}
                                  onChange={handleInputChange}
                                />
                                <div className="absolute right-0 top-0 h-full flex items-center bg-slate-400 text-white rounded-r-md px-4 text-sm">kr</div>
                              </div>
                            </article>
                            <article className="col-span-4">
                              <Label htmlFor="itemTaxAmount">Var av moms</Label>
                              <div className="relative w-full">
                                <Input
                                  id="itemTaxAmount"
                                  name="itemTaxAmount"
                                  value={item.TaxAmount ? item.TaxAmount : null}
                                  placeholder={item.TaxAmount ? null : "Ej läsbart"}
                                  onChange={handleInputChange}
                                />
                                <div className="absolute right-0 top-0 h-full flex items-center bg-slate-400 text-white rounded-r-md px-4 text-sm">kr</div>
                              </div>
                            </article>
                            <article className="col-span-3">
                              <Label htmlFor="itemTaxPercentage">Momssats</Label>
                              <div className="relative w-full">
                                <Input
                                  id="itemTaxPercentage"
                                  name="itemTaxPercentage"
                                  value={item.TaxPercentage ? item.TaxPercentage : null}
                                  placeholder={item.TaxPercentage ? null : "Ej läsbart"}
                                  onChange={handleInputChange}
                                />
                                <div className="absolute right-0 top-0 h-full flex items-center bg-slate-400 text-white rounded-r-md px-4 text-sm">%</div>
                              </div>
                            </article>
                            <article className="col-span-5">
                              <div>
                                <Label htmlFor="itemUnitPrice">Enhetspris</Label>
                                <div className="relative w-full">
                                  <Input
                                    id="itemUnitPrice"
                                    name="itemUnitPrice"
                                    value={item.UnitPrice ? item.UnitPrice : null}
                                    placeholder={item.unitPrice ? null : "Ej läsbart"}

                                    onChange={handleInputChange}
                                  />
                                  <div className="absolute right-0 top-0 h-full flex items-center bg-slate-400 text-white rounded-r-md px-4 text-sm">kr</div>
                                </div>
                              </div>
                            </article>
                            <article className="col-span-3">
                              <Label htmlFor="itemQuantity">Kvantitet</Label>
                              <div className="relative w-full">
                                <Input
                                  id="itemQuantity"
                                  name="itemQuantity"
                                  value={item.Quantity ? item.Quantity : null}
                                  placeholder={item.Quantity ? null : "Ej läsbart"}
                                  data-index={i}
                                  onChange={handleInputChange}
                                />
                                <div className="absolute right-0 top-0 h-full flex items-center bg-slate-400 text-white rounded-r-md px-4 text-sm">st</div>
                              </div>
                            </article>
                          </section>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </ScrollArea>
              </CardContent>
            </Tabs>

          </motion.div>
        )}
      </div>

      {/* Separate animation for button as I didn't get css to work when it was the same for both - *shrug* */}
      {showPreviewAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardFooter className="border-t p-4 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!invoice || isPreviewLoading}
              className="w-3/5 bg-green-500 hover:bg-green-600 text-white"
            >
              {isPreviewLoading ? (
                <span className="animate-spin mr-2">⏳</span>
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              {isPreviewLoading ? 'Bokför...' : 'Godkänn faktura'}
            </Button>
          </CardFooter>
        </motion.div>
      )}


      {/* Modal popup to display invoice and to confirm and save it to the database */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[70vw] h-[80vh] flex flex-col ">
          <DialogHeader >
            <DialogTitle className="text-2xl font-bold text-green-600 ">Verifikation</DialogTitle>
          </DialogHeader>

          <div className="GridContainer grid grid-cols-2 gap-16 h-[70vh]">
            {/* <ScrollArea className="h-[90%] px-4" ref={scrollAreaRef}> */}
            <DialogDescription className="ColOne p-2 h-full ">

              <div className="FakturaInfo space-y-2 ">
                <h3 className="font-semibold text-lg mb-4">Fakturainfo</h3>
                <div className="Fakturanummer grid grid-cols-2 gap-4">

                  <div>
                    <p className="font-semibold text-gray-600">Fakturanummer:</p>
                    <p>{invoice.InvoiceNumber}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Datum:</p>
                    <p>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Belopp:</p>
                    <p className="font-bold text-green-600">{invoice.invoiceTotal}kr</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Kund:</p>
                    <p>{invoice.customerName}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-gray-600">Beskrivning:</p>
                  <p>{invoice.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="paid-status" className="font-semibold text-gray-600">Betalnings status:</Label>

                  <Switch isOn={isOn} setIsOn={setIsOn}
                    id="paid-status"
                    checked={invoice.isPaid}
                    onCheckedChange={() => handleStatusChange('isPaid')} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="booked-status" className="font-semibold text-gray-600">Bokförnings status:</Label>
                  <Badge variant={invoice.isBooked ? "success" : "destructive"}>
                    {invoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span className="ml-1">{invoice.isBooked ? "Bokförd" : "Ej bokförd"}</span>
                  </Badge>
                </div>
              </div>

              <div className="ChatSection bg-gray-500/15 pt-1 mt-4 border-1 border-gray-300 shadow-inner shadow-gray-500/60 rounded-md">
                <div className=" flex flex-col py-4 px-2 overflow-y-auto flex-grow mb-2 max-h-[35.5vh]">
                  {renderedMessages}
                  {loading && <ChatLoader className="mb-12" />}
                </div>
                <form onSubmit={handleSubmit} className="bg-transparent">
                  <div className="flex flex-row w-[100%] justify-between items-center space-x-2 border-gray-300 border-2 rounded-b-md ">
                    <div className="flex-grow p-4 h-auto flex items-center bg-gray-100/80 rounded-b-md">
                      <textarea
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                          e.target.style.height = "auto";
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent default behavior (new line)
                            handleChatSubmit(); // Call the submit handler
                          }
                        }}
                        placeholder="Fråga Ledge..."
                        className="flex-grow text-base p-2 bg-transparent focus:outline-none resize-none overflow-hidden "
                        rows="1"
                      />
                      <button
                        type="submit"
                        className="p-[0.75rem] bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </DialogDescription>

            {/* Booking suggestion - right column */}
            <div className="RightColumn p-2 max-h-[70vh]">
              <div className="p-0 h-full " >
                <h3 className="font-semibold text-lg">Bokföringsförslag</h3>
                <ScrollArea ref={scrollAreaRef} className="max-h-[60vh] w-full overflow-y-auto border-t-2">

                  <Table className="Scroll table overflow-y-auto overflow-x-hidden w-full  " >
                    <TableHeader className="border-2 bg-gray-100">
                      <TableRow>
                        <TableHead className="w-8 border-2">Konto</TableHead>
                        <TableHead className="w-18 border-2">Beskrivning</TableHead>
                        <TableHead className="border-2">Debet</TableHead>
                        <TableHead className="border-2">Kredit</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody >
                      {rows.map((_, index) => (

                        <TableRow >
                          <TableCell className="border-2  w-8">1000</TableCell>
                          <TableCell className="w-18 border-2">Pågående nyanläggningar och förskott
                            för byggnader och mark
                          </TableCell>
                          <TableCell className="text-center border-2"> 128 </TableCell>
                          <TableCell className="text-center border-2"> 123 </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <DialogFooter className="mt-4">
                  <Button onClick={handleSaveChanges} className="bg-green-500 mb-14 hover:bg-green-600 text-white">
                    Bekräfta och bokför
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}