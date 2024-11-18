import React, { useState } from "react"
import { ResetProvider } from "@/services/ResetProvider"
import InvoiceUploader from "./BookingPageComp/InvoiceUploader"
import InvoicePreview from "./BookingPageComp/InvoicePreview"
import InvoiceLogger from "./BookingPageComp/InvoiceLogger"

export default function BookingPage() {
    // State to hold invoice data for child components
    const [invoice, setInvoice] = useState(null); 
    const [isUploadLoading, setIsUploadLoading] = useState(false)

    return (
        <ResetProvider>
        <div className="space-y-4 p-4">     
            <div className="grid grid-cols-1 gap-4">
                    <h1 className="text-3xl font-bold">Bokföring</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <InvoiceUploader setInvoice={setInvoice} isUploadLoading={isUploadLoading} setIsUploadLoading={setIsUploadLoading} />
                    </div>
                    <div className="xl:col-span-2">
                        <InvoicePreview invoice={invoice} setInvoice={setInvoice} isUploadLoading={isUploadLoading} setIsUploadLoading={setIsUploadLoading}/>
                    </div>
                    
                </div>
                <div className="w-full">
                    <InvoiceLogger />
                </div>
            </div>
        </div>
        </ResetProvider>
    )
}