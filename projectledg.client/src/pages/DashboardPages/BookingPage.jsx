import { useState } from "react"
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
        <ResetProvider>
            <div className="space-y-4 p-4">
                <Tabs defaultValue="details">
                    <div className="grid grid-cols-1 ">
                        <h2 className="text-3xl font-bold mb-2">Bokför</h2>

                        <TabsList className="max-w-[250px] h-11 mb-1 dark:bg-darkSurface">
                            <TabsTrigger value="details" className="dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white">Bokföring</TabsTrigger>
                            <TabsTrigger value="customer" className="dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white" >Verifikationer</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                                <div className="md:col-span-1">
                                    <InvoiceUploader
                                        setInvoice={setInvoice}
                                        isUploadLoading={isUploadLoading}
                                        setIsUploadLoading={setIsUploadLoading}
                                    />
                                </div>
                                <div className="lg:col-span-2">
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
                        </TabsContent>
                        <TabsContent value="customer">
                            <TransactionViewer />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </ResetProvider >
    );
}