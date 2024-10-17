import React from "react"
import InvoiceUploader from "./BookingPageComp/InvoiceUploader"
import AccountingBotChat from "./BookingPageComp/AccountingBotChat"
import InvoiceLogger from "./BookingPageComp/InvoiceLogger"

export default function BookingPage() {
    return (
        <div className="container mx-auto py-10">
        
            <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InvoiceUploader />
                    <AccountingBotChat />
                </div>
                <div className="w-full">
                    <InvoiceLogger />
                </div>
            </div>
        </div>
    )
}