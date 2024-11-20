import React, { useState } from "react"
import { ResetProvider } from "@/services/ResetProvider"
import InvoiceUploader from "./BookingPageComp/InvoiceUploader"
import InvoicePreview from "./BookingPageComp/InvoicePreview"
import InvoiceLogger from "./BookingPageComp/InvoiceLogger"
import TransactionViewer from "./BookingPageComp/TransactionViewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BookingPage() {
    // State to hold invoice data for child components
    const [invoice, setInvoice] = useState(null); 
    const [isUploadLoading, setIsUploadLoading] = useState(false)

    return (
        <Tabs defaultValue="details" className="mb-6">
            <TabsList className="dark:bg-darkBackground">
                <TabsTrigger value="details">Bokföring</TabsTrigger>
                <TabsTrigger value="customer">Verifikationer</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
                <ResetProvider>
                    <div className="space-y-4 p-4">     
                        <div className="grid grid-cols-1 gap-4">
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <InvoiceUploader 
                                        setInvoice={setInvoice} 
                                        isUploadLoading={isUploadLoading} 
                                        setIsUploadLoading={setIsUploadLoading} 
                                    />
                                </div>
                                <div className="xl:col-span-2">
                                    <InvoicePreview 
                                        invoice={invoice} 
                                        setInvoice={setInvoice} 
                                        isUploadLoading={isUploadLoading} 
                                        setIsUploadLoading={setIsUploadLoading}
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <InvoiceLogger />
                            </div>
                        </div>
                    </div>
                </ResetProvider>
            </TabsContent>

            <TabsContent value="customer">
                <ResetProvider>
                    <div className="space-y-4 p-4">
                        
                        <TransactionViewer />
                    </div>
                </ResetProvider>
            </TabsContent>
        </Tabs>
    );
}