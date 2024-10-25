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

export default function InvoicePreview() {
  //const [messages, setMessages] = useState([])
  //const [inputMessage, setInputMessage] = useState("")

  const [multipleItems, setMultipleItems] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef(null)

  const [invoice, setInvoice] = useState({
    invoiceNumber: "12345678",
    invoiceDate: "2024-01-01",
    dueDate: "2024-01-31",
    invoiceTotal: 1337,
    items: [
      { description: "test1", quantity: "1", unitPrice: "2000", amount: 0, taxPercentage: "25", taxAmount: 500 },
      { description: "test2", quantity: "1", unitPrice: "100", amount: 0, taxPercentage: "22", taxAmount: 22 },
      { description: "test3", quantity: "1", unitPrice: "100", amount: 0, taxPercentage: "18", taxAmount: 18 }
    ],
    paymentDetails: "1234",
    totalTax: 334.25,
    customerName: "Yomama",
    customerAddress: "Arenavägen 61",
    customerAddressRecipient: "Kånkelberry",
    vendorName: "Snus AB",
    vendorAddress: "Ingenstans 33",
    vendorAddressRecipient: "Snusmumriken",
    vendorTaxId: "4567  ",
  })


  useEffect(() => {
    if (invoice.items.length > 1){
      setMultipleItems(true);
    } 
    else {
      setMultipleItems(false);
    }

  }, [invoice])

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
    const { name, value } = e.target
    setInvoice(prev => ({
      ...prev,
      [name]: value
    }))
  }

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

  return (
    <Card className="w-full h-[600px] flex flex-col shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-gray-800 ">Förhandsgranska faktura</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 ">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <Tabs defaultValue="details" className="mb-6">
          
            <TabsList className="w-full ">
              <TabsTrigger value="details" className="w-full">Faktura </TabsTrigger>
              <TabsTrigger value="customer" className="w-full">Kund </TabsTrigger>
              <TabsTrigger value="vendor" className="w-full">Leverantör </TabsTrigger>
              <TabsTrigger value="items" className="w-full">Specifikation </TabsTrigger>
            </TabsList>
            
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
                    <div className=" grid grid-flow-row grid-cols-6 grid-rows-2 gap-4 ">
                    <div className="col-span-4">
                      <Label htmlFor="itemDescription">Beskrivning</Label>
                      <Input
                        id="itemDescription"
                        name="itemDescription"
                        value={item.description}
                        onChange={handleInputChange}
                      />
                    </div>
                      <div className="col-span-2">
                        <Label htmlFor="itemAmount">Belopp</Label>
                        <Input
                          id="itemAmount"
                          name="itemAmount"
                          value={item.amount}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div >
                        <Label htmlFor="itemQuantity">Kvantitet</Label>
                        <Input
                          id="itemQuantity"
                          name="itemQuantity"
                          value={item.quantity}
                          onChange={handleInputChange}
                        />
                      </div>  
                      
                    
                      <div className="col-span-2">
                      <Label htmlFor="itemUnitPrice">Enhetspris</Label>
                      <Input
                        id="itemUnitPrice"
                        name="itemUnitPrice"
                        value={item.unitPrice}
                        onChange={handleInputChange}
                      />
                    </div>
                      <div className="col-span-2">
                      <Label htmlFor="itemTaxAmount">Var av moms</Label>
                      <Input
                        id="itemTaxAmount"
                        name="itemTaxAmount"
                        value={item.taxAmount}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemTaxPercentage">Momssats %</Label>
                      <Input
                        id="itemTaxPercentage"
                        name="itemTaxPercentage"
                        value={item.taxPercentage}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </TabsContent>
          </Tabs>




          {/* Shows if there are messages */}
          {/* {Array.isArray(messages) && messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              } mb-4 `}
            >
              <div className={`flex items-end max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.sender === 'user' ? "/placeholder-user.jpg" : "/placeholder-bot.jpg"} />
                  <AvatarFallback>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-green-100 text-gray-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))} */}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button 
          onClick={handleSubmit} 
          disabled={invoice != null || isLoading} 
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