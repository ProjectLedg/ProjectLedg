import { useState, useEffect, useRef } from "react"
import { useReset } from "@/services/ResetProvider"
import { motion } from "framer-motion"
import { axiosConfig } from '/axiosconfig'
import InvoiceModal from "./InvoiceModal"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText } from "lucide-react"
import { useParams } from "react-router-dom"


export default function InvoicePreview({ invoice, setInvoice, isUploadLoading, setIsUploadLoading }) {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isBasAccLoading, setIsBasAccLoading] = useState(false)
  const scrollAreaRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPreviewAnimation, setShowPreviewAnimation] = useState(false);
  const [basAccounts, setBasAccounts] = useState([])
  const [isPaidStatus, setIsPaidStatus] = useState(false)
  const [isBooked, setIsBooked] = useState(false);
  const { companyId } = useParams()


  // Sets state for showing preview fade in animation when upload invoice is loading
  useEffect(() => {
    if (!isUploadLoading) {
      setShowPreviewAnimation(true);
    } else {
      setShowPreviewAnimation(false);
    }
  }, [isUploadLoading]);


  const { reset } = useReset();

  useEffect(() => {
    if (reset) {
      setIsPreviewLoading(false)
      setIsBasAccLoading(false)
      setIsModalOpen(false)
      setShowPreviewAnimation(false)
      setBasAccounts([])
      setIsPaidStatus(false)
      setIsBooked(false)
    }

  }, [reset]);


  // console.log("INVOICE PREVIEW: ", invoice)

  // Handles iterating through and updatign the invoice with edited input
  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target

    // Check if input is part of the item nested object, we have to iterate through the array and reconstruct it with the updated values
    if (name.startsWith("item")) {
      // Extract the item index from dataset
      const index = dataset.index;
      // const propertyName = name.replace('item', '').charAt(0) + name.slice(5);
      const propertyName = name.replace('item', '');

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

  const handleIsPaidStatusChange = () => {

    // Create new invoice with same data but override isPaid and nake it the opposite
    setInvoice({...invoice, isPaid: !isPaidStatus})

    // Set is paid status to the opposite of what it is (true/false)
    setIsPaidStatus(!isPaidStatus)
  }

  // Convert ints to decimals and removes kr and SEK text
  function convertInvoiceData(invoiceData) {
    return {
      AdditionalContext: invoiceData.AdditionalContext || null,
      InvoiceNumber: invoiceData.InvoiceId || null,
      InvoiceTotal: parseFloat(invoiceData.InvoiceTotal),
      TotalTax: parseFloat(invoiceData.TotalTax),
      Items: invoiceData.Items.map(item => ({
        Description: item.Description,
        Quantity: parseInt(item.Quantity),
        UnitPrice: parseFloat(item.UnitPrice),
        Amount: parseFloat(item.Amount)
      }))
    };
  }

  // Transform invoice to match backend expectations
  const transformInvoice = (invoice) => ({
    invoiceNumber: invoice.InvoiceId,
    invoiceDate: new Date(invoice.InvoiceDate).toISOString(), 
    dueDate: new Date(invoice.DueDate).toISOString(),
    invoiceTotal: parseFloat(invoice.InvoiceTotal),
    items: invoice.Items.map(item => ({
      description: item.Description,
      quantity: parseFloat(item.Quantity),
      unitPrice: parseFloat(item.UnitPrice),
      amount: parseFloat(item.Amount)
    })),
    invoiceFilePath: invoice.InvoiceFilePath,
    paymentDetails: typeof invoice.PaymentDetails === 'string' ? invoice.PaymentDetails : "",  // Force empty string if not a string
    totalTax: parseFloat(invoice.TotalTax),
    isPaid: isPaidStatus,
    isOutgoing: false, // Always false when creating invoices in this component
    isBooked: false, // As invoice just is created it isn't booked yet
    customerId: invoice.CustomerId,
    customerName: invoice.CustomerName,
    customerAddress: invoice.CustomerAddress,
    customerAddressRecipient: invoice.CustomerAddressRecipient,
    vendorName: invoice.VendorName,
    vendorAddress: invoice.VendorAddress,
    vendorAddressRecipient: invoice.VendorAddressRecipient,
    vendorTaxId: invoice.VendorTaxId,
    companyId: parseInt(companyId, 10)
  });

  // Transform basAccounts to match backend expectations
  const transformBasAccounts = (basAccounts) => (
    basAccounts.accounts.map(account => ({
      basAccount: account.BasAccount.toString(), // To string as that is what backend expects
      description: account.Description,
      debit: parseFloat(account.Debit),
      credit: parseFloat(account.Credit)
    }))
  );
  

  const handleSubmitInvoiceMap = async (event) => {
    event.preventDefault()

    // Open modal and turn on loading animation
    setIsPreviewLoading(true)
    setIsModalOpen(true);

    // Convert ints to decimals
    const transformedInvoice = convertInvoiceData(invoice);


    try {
      // Open modal and turn on loading animation
      // setIsModalOpen(true);
      // setIsBasAccLoading(true);

      // Wait for invoice mapping and get a list of bas accounts back
      const response = await axiosConfig.post("/Assistant/MapInvoiceDataToBasAccount", transformedInvoice);
      // console.log(response);
      // console.log(response.data);
      console.log("response basacc: ", response.data)
      setBasAccounts(response.data)

      // Turn off loading animation
      // setIsBasAccLoading(false);



      console.log('Upload successful:', response)
      // Here you might want to show a success message to the user
    } catch (error) {
      console.error('Upload failed:', error)
      // Here you might want to show an error message to the user
    } finally {
      // Turn off loading animation
      setIsPreviewLoading(false)
    }
  }

  const handleSaveChanges = async (event) => {   

    // Create object to send to backend
    const invBaAccDto = {
      companyId: parseInt(companyId, 10),
      invoice: transformInvoice(invoice),
      accounts: transformBasAccounts(basAccounts)
    };

    try {
      // console.log("invBaAccDto", invBaAccDto)
      
      
      const response = await axiosConfig.post("/BasAccount/ProcessInvoiceWithBasAccounts", invBaAccDto)
      console.log(response.data)

      // Set is booked to true to trigger success animation in modal popup
      setIsBooked(true);

    } catch (error) {
      console.log("Something went wrong: ", error)
    }  
  }


  // Loading skeleton animation while wating for invoice to upload
  if (isUploadLoading) {
    return (
      <Card
        className="w-full h-[600px] flex flex-col shadow-lg border">
        <CardHeader className="border-b dark:border-darkBorder">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white ">Förhandsgranska faktura</CardTitle>
        </CardHeader>

        {/* Fade in for skeleton loader */}
        {isUploadLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Skeleton className="h-12 w-[100%] rounded-none dark:bg-darkSecondary" />
            <CardContent className="h-full overflow-hidden grid grid-cols-1 gap-4">
              <div className="space-y-2 mt-8">
                <Skeleton className="h-4 w-[40%] mt-2 dark:bg-darkSecondary" />
                <Skeleton className="h-12 w-[85%] rounded-md dark:bg-darkSecondary" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[25%] mt-2 dark:bg-darkSecondary" />
                <Skeleton className="h-12 w-[70%] rounded-md dark:bg-darkSecondary" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[50%] mt-2 dark:bg-darkSecondary" />
                <Skeleton className="h-12 w-[80%] rounded-md dark:bg-darkSecondary" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[30%] mt-2 dark:bg-darkSecondary" />
                <Skeleton className="h-12 w-[65%] rounded-md dark:bg-darkSecondary" />
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
        <CardHeader className="border-b dark:border-darkBorder">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Förhandsgranska faktura</CardTitle>
        </CardHeader>
        <CardContent className=" h-[75%] flex justify-center items-center p-0 ">
          <h3 className="text-xl text-center text-gray-400 dark:text-darkSecondary">Ladda upp en faktura för att förhandsgranska</h3>
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
                            <Label htmlFor="InvoiceId">Fakturanummer</Label>
                            <Input
                              id="InvoiceId"
                              name="InvoiceId"
                              value={invoice.InvoiceId ? invoice.InvoiceId : null}
                              placeholder={invoice.InvoiceId ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="InvoiceTotal">Totalt belopp</Label>
                            <div className="relative w-full">
                              <Input
                                id="InvoiceTotal"
                                name="InvoiceTotal"
                                value={invoice.InvoiceTotal ? invoice.InvoiceTotal : null}
                                placeholder={invoice.InvoiceTotal ? null : "Ej Läsbart"}

                                onChange={handleInputChange}
                              />
                              <div className="absolute right-0 top-0 h-full flex items-center bg-slate-400 text-white rounded-r-md px-4 text-sm">kr</div>
                            </div>
                          </article>
                          <article>
                            <Label htmlFor="TotalTax">Total moms</Label>
                            <div className="relative w-full">
                              <Input
                                id="TotalTax"
                                name="TotalTax"
                                value={invoice.TotalTax ? invoice.TotalTax : null}
                                placeholder={invoice.TotalTax ? null : "Ej Läsbart"}
                                onChange={handleInputChange}
                              />
                              <div className="absolute right-0 top-0 h-full flex items-center bg-slate-400 text-white rounded-r-md px-4 text-sm">kr</div>
                            </div>
                          </article>
                          <article>
                            <Label htmlFor="InvoiceDate">Fakturadatum</Label>
                            <Input
                              id="InvoiceDate"
                              name="InvoiceDate"
                              type="date"
                              value={invoice.InvoiceDate ? invoice.InvoiceDate : null}
                              placeholder={invoice.InvoiceDate ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="DueDate">Förfallodatum</Label>
                            <Input
                              id="DueDate"
                              name="DueDate"
                              type="date"
                              value={invoice.DueDate}
                              placeholder={invoice.DueDate ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="PaymentDetails">Bankgiro/PlusGiro</Label>
                            <Input
                              id="PaymentDetails"
                              name="PaymentDetails"
                              value={invoice.PaymentDetails ? invoice.PaymentDetails : null}
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
                            <Label htmlFor="CustomerName">Kundnamn</Label>
                            <Input
                              id="CustomerName"
                              name="CustomerName"
                              value={invoice.CustomerName ? invoice.CustomerName : null}
                              placeholder={invoice.CustomerName ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="CustomerAddress">Kundadress</Label>
                            <Input
                              id="CustomerAddress"
                              name="CustomerAddress"
                              value={invoice.CustomerAddress ? invoice.CustomerAddress : null}
                              placeholder={invoice.CustomerAddress ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="CustomerAddressRecipient">Kundadressmottagare</Label>
                            <Input
                              id="CustomerAddressRecipient"
                              name="CustomerAddressRecipient"
                              value={invoice.CustomerAddressRecipient ? invoice.CustomerAddressRecipient : null}
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
                            <Label htmlFor="VendorName">Leverantörsnamn</Label>
                            <Input
                              id="VendorName"
                              name="VendorName"
                              value={invoice.VendorName ? invoice.VendorName : null}
                              placeholder={invoice.VendorName ? null : "Ej Läsbart"}
                              
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="vendorAddress">Leverantörsadress</Label>
                            <Input
                              id="VendorAddress"
                              name="VendorAddress"
                              value={invoice.VendorAddress ? invoice.VendorAddress : null}
                              placeholder={invoice.VendorAddress ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="VendorAddressRecipient">Leverantörsadressmottagare</Label>
                            <Input
                              id="VendorAddressRecipient"
                              name="VendorAddressRecipient"
                              value={invoice.VendorAddressRecipient ? invoice.VendorAddressRecipient : null}
                              placeholder={invoice.VendorAddressRecipient ? null : "Ej Läsbart"}
                              onChange={handleInputChange}
                            />
                          </article>
                          <article>
                            <Label htmlFor="VendorTaxId">Momsregistreringsnummer</Label>
                            <Input
                              id="VendorTaxId"
                              name="VendorTaxId"
                              value={invoice.VendorTaxId ? invoice.VendorTaxId : null}
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
                                  data-index={i}
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
                                  data-index={i}
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
                                    placeholder={item.UnitPrice ? null : "Ej läsbart"}
                                    data-index={i}
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
              onClick={handleSubmitInvoiceMap}
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
      <InvoiceModal
        basAccounts={basAccounts}
        invoice={invoice}
        isModalOpen={isModalOpen}
        isBooked={isBooked}
        setIsModalOpen={setIsModalOpen}
        handleSaveChanges={handleSaveChanges} 
        handleIsPaidStatusChange={handleIsPaidStatusChange}
        />
    </Card>
  )
}