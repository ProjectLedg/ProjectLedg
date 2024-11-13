import React, { useState, useRef, useEffect } from "react"
import { axiosConfigMultipart } from '/axiosconfig'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function InvoiceUploader({ setInvoice, isUploadLoading, setIsUploadLoading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState("")
  // const [isLoading, setIsLoading] = useState(false)
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
    customerName: "Yomama AB",
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

    if (file) {
      setSelectedFile(file);

      // Create preview url so user can open file and preview it
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Open open file with preview url in new window
  const openFileInNewWindow = () => {
    if (previewUrl) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<iframe src="${previewUrl}" frameborder="0" style="width:100%; height:100%;"></iframe>`);
      }
    }
  }

  // Removes kr and SEK text
  const convertInvoiceData = (invoiceData) => {
    return {
      ...invoiceData,
        InvoiceTotal: invoiceData.InvoiceTotal.replace('kr', '').replace('SEK', '').trim(),
        TotalTax: invoiceData.TotalTax.replace('kr', '').replace('SEK', '').trim(),
      Items: invoiceData.Items.map(item => ({
        ...item,    
        Amount: item.Amount.replace('kr', '').replace('SEK', '').trim(),
        UnitPrice: item.UnitPrice.replace('kr', '').replace('SEK', '').trim(),
      }))
    };
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploadLoading(true);

    try {
      // Create formData from file
      const formData = new FormData();
      formData.append("file", selectedFile);
      // formData.append("additionalInfo", additionalInfo);

      // Send formData to API endpoint
      const response = await axiosConfigMultipart.post("/IngoingInvoice/Analyze", formData);

      const convertedInvoice = convertInvoiceData(response.data)

      // Update state with response data
      setInvoice(convertedInvoice);
      console.log("conv inv: ", convertedInvoice)


      console.log("Request successful:", response);
      console.log("response data:", response.data);
    } catch (error) {
      // Handle specific error cases
      if (error.response && error.response.status === 400) {
        console.error("400 Bad Request:", error.response.data);
      } else {
        console.error("Request failed:", error);
      }
    } finally {
      // Ensure loading state is reset
      setIsUploadLoading(false);
    }
  }

  const { reset } = useReset();


  useEffect(() => {
    if (reset) {
      setSelectedFile(null)
      setPreviewUrl(null)
      setAdditionalInfo("")
      setInvoice(null)
    }
  }, [reset]);

  return (
    <Card className="w-half h-[600px] flex flex-col shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Ladda upp faktura</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex items-center justify-center w-full">
              <Label
                htmlFor="dropzone-file"
                className="flex flex-col text-center items-center justify-center w-full h-56 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700"
              >
                {selectedFile && selectedFile.type.startsWith('image') && previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="absolute inset-0 object-cover w-full h-full opacity-40 rounded-lg"
                  />
                )}
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-1 relative z-10">
                  <Upload className={"w-8 h-8 mb-4 text-gray-500"} />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold dark:text-white">Klicka för att ladda upp eller släpp filen här</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white">SVG, PNG, JPG eller GIF (MAX. 800x400px)</p>
                </div>
                <Input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf,text/plain"
                />
              </Label>
            </div>
            {selectedFile && (
              <div>
                <h3 className="font-semibold">Vald fil:</h3>
                <div className="flex items-center gap-2">
                  <a onClick={openFileInNewWindow} className="text-blue-500 underline cursor-pointer">
                    {selectedFile.name}
                  </a>
                  {/* <button type="button" onClick={openFileInNewWindow} className="text-sm text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600">
                    Öppna i nytt fönster
                  </button> */}
                </div>
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
          disabled={!selectedFile || isUploadLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          {isUploadLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          {isUploadLoading ? 'Laddar upp...' : 'Ladda upp'}
        </Button>
      </CardFooter>
    </Card>
  )
}
