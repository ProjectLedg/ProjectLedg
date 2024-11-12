import React, { useState } from "react";
import { axiosConfig } from '/axiosconfig'
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceDetails } from "./InvoicingPageComp/InvoiceDetails";
import { CustomerInfo } from "./InvoicingPageComp/CustomerInfo";
import { InvoiceItems } from "./InvoicingPageComp/InvoiceItems";
import { InvoiceSummary } from "./InvoicingPageComp/InvoiceSummary";
import { useParams } from "react-router-dom";
import { Loader2, Check, FileText, Download, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function InvoicingPage() {
  const { companyId } = useParams();
  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    invoiceTotal: 0,
    items: [{ description: "", quantity: "1", unitPrice: "0", amount: 0, taxPercentage: "0", taxAmount: 0 }],
    paymentDetails: "",
    totalTax: 0,
    customerName: "",
    customerAddress: "",
    customerAddressRecipient: "",
    customerOrgNumber: "",
    customerTaxId: "",
  });
  const [outgoingInvoiceId, setOutgoingInvoiceId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle", "saving", "saved", "error"
  const [generatePdfStatus, setGeneratePdfStatus] = useState("idle"); // "idle", "generating", "generated", "error"
  const [pdfBlob, setPdfBlob] = useState(null);
  const [formErrors, setFormErrors] = useState([]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    if (field === "description") {
      newItems[index][field] = value;
    } else {
      const formattedValue = value.replace(/^0+(?=\d)/, '').replace(/^\./, '0.');
      newItems[index][field] = formattedValue;

      const numericValue = parseFloat(formattedValue) || 0;
      if (field === "quantity") newItems[index].quantity = Math.max(0, numericValue).toString();
      if (field === "unitPrice") newItems[index].unitPrice = Math.max(0, numericValue).toString();
      if (field === "taxPercentage") newItems[index].taxPercentage = Math.min(100, Math.max(0, numericValue)).toString();
    }

    const quantity = parseFloat(newItems[index].quantity) || 0;
    const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
    const taxPercentage = parseFloat(newItems[index].taxPercentage) || 0;

    newItems[index].amount = roundToCent(quantity * unitPrice);
    newItems[index].taxAmount = roundToCent(newItems[index].amount * (taxPercentage / 100));

    const newTotalTax = roundToCent(newItems.reduce((sum, item) => sum + item.taxAmount, 0));
    const newInvoiceTotal = roundToCent(newItems.reduce((sum, item) => sum + item.amount + item.taxAmount, 0));

    setInvoice(prev => ({
      ...prev,
      items: newItems,
      totalTax: newTotalTax,
      invoiceTotal: newInvoiceTotal
    }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: "1", unitPrice: "0", amount: 0, taxPercentage: "0", taxAmount: 0 }]
    }));
  };

  const removeItem = (index) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    const newTotalTax = roundToCent(newItems.reduce((sum, item) => sum + item.taxAmount, 0));
    const newInvoiceTotal = roundToCent(newItems.reduce((sum, item) => sum + item.amount + item.taxAmount, 0));
    setInvoice(prev => ({
      ...prev,
      items: newItems,
      totalTax: newTotalTax,
      invoiceTotal: newInvoiceTotal
    }));
  };

  const roundToCent = (amount) => {
    return Math.round(amount * 100) / 100;
  };

  const validateForm = () => {
    const errors = [];
    if (!invoice.invoiceNumber) errors.push("Fakturanummer krävs");
    if (!invoice.invoiceDate) errors.push("Fakturadatum krävs");
    if (!invoice.dueDate) errors.push("Förfallodatum krävs");
    if (!invoice.paymentDetails) errors.push("Betalningsdetaljer krävs");
    if (!invoice.customerName) errors.push("Kundnamn krävs");
    if (!invoice.customerAddress) errors.push("Kundadress krävs");
    if (!invoice.customerOrgNumber) errors.push("Organisationsnummer krävs");
    if (!invoice.customerTaxId) errors.push("Momsregistreringsnummer krävs");
    if (invoice.items.length === 0) errors.push("Åtminstone en artikel krävs");
    invoice.items.forEach((item, index) => {
      if (!item.description) errors.push(`Item ${index + 1} Beskrivning krävs`);
      if (parseFloat(item.quantity) <= 0) errors.push(`Item ${index + 1} Kvantitet måste vara större än 0`);
      if (parseFloat(item.unitPrice) <= 0) errors.push(`Item ${index + 1} Styckpris måste vara större än 0`);
    });
    setFormErrors(errors);
    return errors.length === 0;
  };

  const saveInvoice = async () => {
    if (!validateForm()) {

      return;
    }

    setSaveStatus("saving");
    try {
      const subtotal = roundToCent(invoice.items.reduce((sum, item) => sum + item.amount, 0));
      const formattedInvoice = {
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: new Date(invoice.invoiceDate).toISOString(),
        dueDate: new Date(invoice.dueDate).toISOString(),
        invoiceTotal: subtotal, // Use subtotal as invoiceTotal
        items: invoice.items.map(item => ({
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          amount: item.amount
        })),
        paymentDetails: invoice.paymentDetails,
        totalTax: invoice.totalTax,
        customerName: invoice.customerName,
        customerAddress: invoice.customerAddress,
        customerOrgNumber: invoice.customerOrgNumber,
        customerTaxId: invoice.customerTaxId
      };

      console.log("formattedInvoice:", formattedInvoice);
      const response = await axiosConfig.post(`/OutgoingInvoice/create/${companyId}`, formattedInvoice);
      setOutgoingInvoiceId(response.data.outgoingInvoiceId);
      setSaveStatus("saved");


      // Reset the button to "Save Invoice" after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");

      }, 3000);
    } catch (error) {
      console.error("Error saving invoice:", error);
      setSaveStatus("error");


      // Reset the button to "Save Invoice" after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");

      }, 3000);
    }
  };

  const generatePdf = async () => {
    if (!outgoingInvoiceId) return;

    setGeneratePdfStatus("generating");
    setPdfBlob(null);

    try {
      const response = await axiosConfig.post("/PDF/generate-invoice-pdf", {
        companyId: parseInt(companyId),
        outgoingInvoiceId: outgoingInvoiceId
      }, {
        responseType: 'blob' // Important: tells axios to expect binary data
      });

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      setPdfBlob(blob);
      setGeneratePdfStatus("ready");

    } catch (error) {
      console.error("Error generating PDF:", error);
      setGeneratePdfStatus("error");
      setPdfBlob(null);


      setTimeout(() => {
        setGeneratePdfStatus("idle");

      }, 3000);
    }
  };

  const downloadPdf = () => {
    if (!pdfBlob) return;

    // Create a URL for the blob
    const url = window.URL.createObjectURL(pdfBlob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${outgoingInvoiceId}_Invoice.pdf`;

    // Append to document, click, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the blob URL
    window.URL.revokeObjectURL(url);

    // Reset the status after download
    setTimeout(() => {
      setGeneratePdfStatus("idle");
      setPdfBlob(null);

    }, 1000);
  };

  const resetForm = () => {
    setInvoice({
      invoiceNumber: "",
      invoiceDate: "",
      dueDate: "",
      invoiceTotal: 0,
      items: [{ description: "", quantity: "1", unitPrice: "0", amount: 0, taxPercentage: "0", taxAmount: 0 }],
      paymentDetails: "",
      totalTax: 0,
      customerName: "",
      customerAddress: "",
      customerAddressRecipient: "",
      customerOrgNumber: "",
      customerTaxId: "",
    });
    setOutgoingInvoiceId(null);
    setSaveStatus("idle");
    setGeneratePdfStatus("idle");
    setPdfBlob(null);
    setFormErrors([]);


  };

  return (
    <div className="w-[92vw] sm:w-auto">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fakturering</h1>
        <Button variant="outline" onClick={resetForm} className="dark:bg-darkSurface dark:border-darkBorder">
          <RefreshCw className="mr-2 h-4 w-4" />
          Återställ formulär
        </Button>
      </div>

      {formErrors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fel</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}



      <Tabs defaultValue="details" className="mb-6 ">
        <TabsList className="dark:bg-darkBackground">
          <TabsTrigger value="details">Innehåll</TabsTrigger>
          <TabsTrigger value="customer">Kundinformation</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <InvoiceDetails invoice={invoice} handleInputChange={handleInputChange} />
        </TabsContent>

        <TabsContent value="customer">
          <CustomerInfo invoice={invoice} handleInputChange={handleInputChange} />
        </TabsContent>
      </Tabs>

      <InvoiceItems
        items={invoice.items}
        handleItemChange={handleItemChange}
        addItem={addItem}
        removeItem={removeItem}
      />

      <InvoiceSummary
        items={invoice.items}
        totalTax={invoice.totalTax}
        invoiceTotal={invoice.invoiceTotal}
      />

      <div className="flex justify-around sm:justify-end">
        <Button
          className="mr-2 w-48 dark:text-darkBackground"
          onClick={saveInvoice}
          disabled={saveStatus === "saving" || saveStatus === "saved"}
        >
          {saveStatus === "saving" && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sparar...
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="mr-2 h-4 w-4" />
              Sparad
            </>
          )}
          {saveStatus === "error" && "error"}
          {saveStatus === "idle" && "Spara faktura"}
        </Button>
        <Button
          variant="outline"
          onClick={generatePdfStatus === "ready" ? downloadPdf : generatePdf}
          disabled={!outgoingInvoiceId || generatePdfStatus === "generating"}
          className="w-48 dark:bg-darkSurface dark:border-darkBorder dark:text-darkSecondary"
        >
          {generatePdfStatus === "generating" && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Genererar...
            </>
          )}
          {generatePdfStatus === "ready" && (
            <>
              <Download className="mr-2 h-4 w-4" />
              Ladda ned PDF
            </>
          )}
          {generatePdfStatus === "error" && "Error"}
          {generatePdfStatus === "idle" && (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generera PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}