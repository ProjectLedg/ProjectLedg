import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, FileText, Send } from "lucide-react"

export default function InvoicePreview({ invoice, setInvoice, }) {
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)


  // useEffect(() => {
  //   if (invoice.items.length > 1){
  //     setMultipleItems(true);
  //   } 
  //   else {
  //     setMultipleItems(false);
  //   }

  // }, [invoice])

  // useEffect(() => {
  //   if (scrollAreaRef.current) {
  //     scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
  //   }
  // }, [messages])

  // const fetchMessages = async () => {
  //   try {
  //     const response = await axios.get('/api/chat-messages')
  //     if (Array.isArray(response.data)) {
  //       setMessages(response.data)
  //     } else {
  //       console.error('API did not return an array:', response.data)
  //       setMessages([])
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch messages:', error)
  //     setMessages([])
  //   }
  // }

  // const sendMessage = async (e) => {
  //   e.preventDefault()
  //   if (!inputMessage.trim()) return

  //   setIsLoading(true)
  //   const newMessage = { content: inputMessage, sender: 'user' }

  //   try {
  //     setMessages(prevMessages => [...prevMessages, newMessage])
  //     setInputMessage("")

  //     const response = await axios.post('/api/chat-messages', { message: inputMessage })
  //     const botReply = { content: response.data.reply, sender: 'bot' }
  //     setMessages(prevMessages => [...prevMessages, botReply])
  //   } catch (error) {
  //     console.error('Failed to send message:', error)
  //     setMessages(prevMessages => prevMessages.slice(0, -1))
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target
   
    // Check if input is part of the item nested object, we have to iterate through the array and reconstruct it with the updated values
    if (name.startsWith("item")){
      // Extract the item index from dataset
      const index = dataset.index;
      const propertyName = name.replace('item', '').charAt(0).toLowerCase() + name.slice(5); // Removes "item" from the word, makes first char lowercase and puts together so t.ex itemDesciption = description

      // Update the specific item in the items array
      setInvoice(prev => {
        const updatedItems = prev.items.map((item, i) =>
          i === parseInt(index) ? { ...item, [propertyName]: value } : item
        );

        return {
          ...prev,
          items: updatedItems
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
    setIsLoading(true)

    try {
      const formData = new FormData()
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
      setIsLoading(false)
    }
  }

  const handleSaveChanges = () => {
    // Post and save changes to backend API 
    // NEED TO IMPLEMENT WHEN BACKEND API ENDPOINTS ARE FIXED

    setIsModalOpen(false)
  }

  // Display text if there's no invoice yet
  if (!invoice){
    return (
      <Card className="w-full h-[600px] flex flex-col shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold text-gray-800 ">Förhandsgranska faktura</CardTitle>
        </CardHeader>
        <CardContent className=" h-[75%] flex justify-center items-center p-0 ">
          <h3 className="text-xl text-gray-400">Ladda upp en faktura för att förhandsgranska</h3>
        </CardContent>
      </Card>
    )
  }

  // Display invoice preview
  return (
    <Card className="w-full h-[600px] flex flex-col shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-gray-800 ">Förhandsgranska faktura</CardTitle>
      </CardHeader>

      {/* Buttons to select different parts of the invoice */}
      <Tabs defaultValue="details" className="flex flex-col h-full overflow-hidden">
        <TabsList className="w-full border-b rounded-none p-6">
          <TabsTrigger value="details" className="w-full p-3">Faktura</TabsTrigger>
          <TabsTrigger value="customer" className="w-full p-3">Kund</TabsTrigger>
          <TabsTrigger value="vendor" className="w-full p-3">Leverantör</TabsTrigger>
          <TabsTrigger value="items" className="w-full p-3">Specifikation</TabsTrigger>
        </TabsList>

      <CardContent className="flex-grow overflow-auto p-0 ">
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
                      value={invoice.invoiceNumber}
                      onChange={handleInputChange}
                    />
                  </article>
                  <article>
                    <Label htmlFor="invoiceTotal">Totalt belopp</Label>
                    <Input
                      id="invoiceTotal"
                      name="invoiceTotal"
                      value={invoice.invoiceTotal}
                      onChange={handleInputChange}
                    />
                  </article>
                    <article>
                    <Label htmlFor="invoiceDate">Fakturadatum</Label>
                    <Input
                      id="invoiceDate"
                      name="invoiceDate"
                      type="date"
                      value={invoice.invoiceDate}
                      onChange={handleInputChange}
                    />
                    </article>
                    <article>
                    <Label htmlFor="dueDate">Förfallodatum</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={invoice.dueDate}
                      onChange={handleInputChange}
                    />
                    </article>
                    <article>
                    <Label htmlFor="paymentDetails">Bankgiro/PlusGiro</Label>
                    <Input
                      id="paymentDetails"
                      name="paymentDetails"
                      value={invoice.paymentDetails}
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
                      value={invoice.customerName}
                      onChange={handleInputChange}
                    />
                    </article>
                    <article>
                    <Label htmlFor="customerAddress">Kundadress</Label>
                    <Input
                      id="customerAddress"
                      name="customerAddress"
                      value={invoice.customerAddress}
                      onChange={handleInputChange}
                    />
                    </article>
                    <article>
                    <Label htmlFor="customerAddressRecipient">Kundadressmottagare</Label>
                    <Input
                      id="customerAddressRecipient"
                      name="customerAddressRecipient"
                      value={invoice.customerAddressRecipient}
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
                      value={invoice.vendorName}
                      onChange={handleInputChange}
                    />
                    </article>
                    <article>
                    <Label htmlFor="vendorAddress">Leverantörsadress</Label>
                    <Input
                      id="vendorAddress"
                      name="vendorAddress"
                      value={invoice.vendorAddress}
                      onChange={handleInputChange}
                    />
                    </article>
                    <article>
                    <Label htmlFor="vendorAddressRecipient">Leverantörsadressmottagare</Label>
                    <Input
                      id="vendorAddressRecipient"
                      name="vendorAddressRecipient"
                      value={invoice.vendorAddressRecipient}
                      onChange={handleInputChange}
                    />
                    </article>
                    <article>
                    <Label htmlFor="vendorTaxId">Momsregistreringsnummer</Label>
                    <Input
                      id="vendorTaxId"
                      name="vendorTaxId"
                      value={invoice.vendorTaxId}
                      onChange={handleInputChange}
                    />
                    </article>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoice specification (each item on the invoice) */}
          <TabsContent value="items">
            {invoice.items.map((item, i) =>  (
              <Card key={i} className="mb-4 border-0 border-b-2 rounded-none shadow-none space-y-4 mt-6">
                <CardContent className="shadow-none">
                  {/* <h2 className="mb-2 font-medium">Artikel: {i + 1}</h2> */}
                  <section className="grid grid-flow-row grid-cols-12 grid-rows-3 gap-4 mb-2 ">
                    <article className="col-span-full">
                      <Label htmlFor="itemDescription">Beskrivning</Label>
                      <Input
                        id="itemDescription"
                        name="itemDescription"
                        value={item.description}
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
                          value={item.amount}
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
                          value={item.taxAmount}
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
                          value={item.taxPercentage}
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
                            value={item.unitPrice}
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
                          value={item.quantity}
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
      <CardFooter className="border-t p-4 flex justify-center">
        <Button 
          onClick={handleSubmit} 
          disabled={!invoice || isLoading } 
          className="w-3/5 bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : (
              <FileText className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Bokför...' : 'Godkänn faktura'}
        </Button>
      </CardFooter>

      {/* Modal popup to display invoice and to confirm and save it to the database */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">Verifikation</DialogTitle>
          </DialogHeader>
          {invoice && (
            <div className="mt-4 space-y-4">
              <DialogDescription>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-600">Fakturanummer:</p>
                    <p>{invoice.invoiceNumber}</p>
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
              </DialogDescription>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="paid-status" className="font-semibold text-gray-600">Betalnings status:</Label>
                  <Switch
                    id="paid-status"
                    checked={invoice.isPaid}
                    onCheckedChange={() => handleStatusChange('isPaid')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="booked-status" className="font-semibold text-gray-600">Bokförnings status:</Label>
                  <Badge variant={invoice.isBooked ? "success" : "destructive"}>
                    {invoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span className="ml-1">{invoice.isBooked ? "Bokförd" : "Ej bokförd"}</span>
                  </Badge>
                </div>
                {!invoice.isBooked && (
                  <div>
                    <Label htmlFor="additional-info" className="font-semibold text-gray-600">Ytterliggare information:</Label>
                    <Textarea
                      // id="additional-info"
                      // placeholder="Lägg till ev information till Ledge för att hjälpa till med automatisk bokföring...  "
                      // value={selectedInvoice.additionalInfo}
                      // onChange={handleAdditionalInfoChange}
                      // className="mt-2"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveChanges} className="bg-green-500 hover:bg-green-600 text-white">
              Bekräfta och bokför
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}