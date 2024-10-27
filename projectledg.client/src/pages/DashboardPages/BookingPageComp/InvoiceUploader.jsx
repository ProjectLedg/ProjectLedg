import React, { useState, useRef } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function InvoiceUploader( {setInvoice} ) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef(null)

  // TEMP TEST DATA - REMOVE WHEN API WORKS
  const [invoiceTestData, setInvoiceTestData] = useState({
    invoiceNumber: "12345678",
    invoiceDate: "2024-01-01",
    dueDate: "2024-01-31",
    invoiceDescription: "Tjänster för konsultande",
    invoiceTotal: 1337,
    items: [
      { description: "test1", amount: 10256, taxAmount: 500, taxPercentage: "25", unitPrice: "2000", quantity: "1" },
      { description: "test2", amount: 137, taxAmount: 22, taxPercentage: "22", unitPrice: "100", quantity: "4" },
      { description: "test3", amount: 2005, taxAmount: 18, taxPercentage: "18", unitPrice: "100", quantity: "10" }
    ],
    paymentDetails: "1234",
    totalTax: 334.25,
    customerName: "Yomama",
    customerAddress: "Arenavägen 61",
    customerAddressRecipient: "Kånkelberry",
    vendorName: "Snus AB",
    vendorAddress: "Ingenstans 33",
    vendorAddressRecipient: "Snusmumriken",
    vendorTaxId: "4567",
    isPaid: false,
    isBooked: false,
  })

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('invoice', selectedFile)
      formData.append('additionalInfo', additionalInfo)

      // TODO: Change to axios config when endpoint is fixed
      // const response = await axios.post('/api/upload-invoice', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })

      // Update invoice state and send back to BookingPage

      // Uncomment this when above api call works
      // setInvoice(response.data);

      // Temp to see if flow works in the meantime - REMOVE WHEN API WORKS
      setInvoice(invoiceTestData);

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
    <Card className="w-half h-[600px] flex flex-col shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-gray-800">Ladda upp faktura</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="dropzone-file"
              className="flex flex-col text-center items-center justify-center w-full h-56 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-1">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Klicka för att ladda upp</span> eller släpp filen här
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG eller GIF (MAX. 800x400px)</p>
              </div>
              <Input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Label>
          </div>
          {selectedFile && (
            <div>
              <h3 className="font-semibold">Vald fil:</h3>
              <p>{selectedFile.name}</p>
            </div>
          )}
          <div>
            <Label htmlFor="additionalInfo" className="font-semibold">
              Övrig information:
            </Label>
            <Textarea
              id="additionalInfo"
              placeholder="Lägg till ytterligare information om fakturan här..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="mt-1"
            />
          </div>
        </form>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedFile || isLoading} 
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Laddar upp...' : 'Ladda upp faktura'}
        </Button>
      </CardFooter>
    </Card>
  )
}