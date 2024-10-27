import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

export default function InvoicePreview({ invoice, setInvoice }) {
  //const [messages, setMessages] = useState([])
  //const [inputMessage, setInputMessage] = useState("")

  // const [multipleItems, setMultipleItems] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef(null)

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
      formData.append('invoice', selectedFile)
      formData.append('additionalInfo', additionalInfo)

      const response = await axios.post('/api/upload-invoice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Upload successful:', response.data)
      // Here you might want to show a success message to the user
    } catch (error) {
      console.error('Upload failed:', error)
      // Here you might want to show an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  // Display text if there's no invoice yet
  if (!invoice){
    return (
      <Card className="w-full h-[600px] flex flex-col shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold text-gray-800 ">Förhandsgranska faktura</CardTitle>
        </CardHeader>
        <CardContent className=" h-[75%] flex justify-center items-center p-0 ">
          <h1>Ladda upp en faktura för att Förhandsgranska</h1>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[600px] flex flex-col shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-gray-800 ">Förhandsgranska faktura</CardTitle>
      </CardHeader>

      <Tabs defaultValue="details" className="flex flex-col h-full overflow-hidden">
        <TabsList className="w-full border-b rounded-none p-4">
          <TabsTrigger value="details" className="w-full">Faktura </TabsTrigger>
          <TabsTrigger value="customer" className="w-full">Kund </TabsTrigger>
          <TabsTrigger value="vendor" className="w-full">Leverantör </TabsTrigger>
          <TabsTrigger value="items" className="w-full">Specifikation </TabsTrigger>
        </TabsList>

      <CardContent className="flex-grow overflow-auto p-0 ">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>

          <TabsContent value="details">
            <Card className="border-0 shadow-none">
              <CardContent>
                <div className="grid grid-cols-1 gap-4 mt-6">
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
                    <Label htmlFor="invoiceDate">Fakturadatum</Label>
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
                    <Label htmlFor="paymentDetails">Bankgiro/PlusGiro</Label>
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
            <Card className="border-0 shadow-none">
              <CardContent>
                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="customerName">Kundnamn</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={invoice.customerName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerAddress">Kundadress</Label>
                    <Input
                      id="customerAddress"
                      name="customerAddress"
                      value={invoice.customerAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerAddressRecipient">Kundadressmottagare</Label>
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
            <Card className="border-0 shadow-none">
              <CardContent>
                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="vendorName">Leverantörsnamn</Label>
                    <Input
                      id="vendorName"
                      name="vendorName"
                      value={invoice.vendorName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendorAddress">Leverantörsadress</Label>
                    <Input
                      id="vendorAddress"
                      name="vendorAddress"
                      value={invoice.vendorAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendorAddressRecipient">Leverantörsadressmottagare</Label>
                    <Input
                      id="vendorAddressRecipient"
                      name="vendorAddressRecipient"
                      value={invoice.vendorAddressRecipient}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendorTaxId">Momsregistreringsnummer</Label>
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

          <TabsContent value="items">
            {invoice.items.map((item, i) =>  (
              <Card key={i} className="mb-4 border-0 border-b-2 rounded-none shadow-none space-y-4 mt-6">
                <h2>Artikel: {i+1}</h2>
                <CardContent className="shadow-none">
                  <div className="grid grid-flow-row grid-cols-12 grid-rows-3 gap-4 ">
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
                </div>
              </CardContent>
            </Card>
            ))}
          </TabsContent>
        </ScrollArea>
      </CardContent>
      </Tabs>
      <CardFooter className="border-t p-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!invoice || isLoading } 
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : (
            <p className="w-4 h-4 mr-2" ></p>
          )}
          {isLoading ? 'Bokför...' : 'Bokför faktura'}
        </Button>
      </CardFooter>
    </Card>
  )
}