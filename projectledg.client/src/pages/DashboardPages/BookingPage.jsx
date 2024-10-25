import React from "react"
import InvoiceUploader from "./BookingPageComp/InvoiceUploader"
import AccountingBotChat from "./BookingPageComp/InvoicePreview"
import InvoiceLogger from "./BookingPageComp/InvoiceLogger"

export default function BookingPage() {
    return (
        <div className="container mx-auto">
        
            <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <InvoiceUploader/>
                    </div>
                    <div className="md:col-span-2">
                        <AccountingBotChat />
                    </div>
                    
                </div>
                <div className="w-full">
                    <InvoiceLogger />
                </div>
            </div>
        </div>
    )
}