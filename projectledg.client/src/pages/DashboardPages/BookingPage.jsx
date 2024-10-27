import React, { useState } from "react"
import InvoiceUploader from "./BookingPageComp/InvoiceUploader"
import InvoicePreview from "./BookingPageComp/InvoicePreview"
import InvoiceLogger from "./BookingPageComp/InvoiceLogger"

export default function BookingPage() {
    // State to hold invoice data for child components
    const [invoice, setInvoice] = useState(null); 

    return (
        <div className="container mx-auto">
        
            <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <InvoiceUploader setInvoice={setInvoice}/>
                    </div>
                    <div className="md:col-span-2">
                        <InvoicePreview invoice={invoice}setInvoice={setInvoice}/>
                    </div>
                    
                </div>
                <div className="w-full">
                    <InvoiceLogger />
                </div>
            </div>
        </div>
    )
}