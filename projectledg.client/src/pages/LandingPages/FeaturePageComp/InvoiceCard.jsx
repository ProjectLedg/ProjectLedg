import { useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import Switch from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import SuccessAnimation from "@/pages/DashboardPages/BookingPageComp/SuccessAnimation";


export default function InvoiceCard() {
    const [isBooked, setIsBooked] = useState(false); // New state for the demo page
    const [isPaid, setIsPaid] = useState(false);
    const scrollAreaRef = useRef(null);

    // Hardcoded dummy data
    const dummyInvoice = {
        VendorAddressRecipient: "ACME Corporation",
        InvoiceId: "INV-12345",
        InvoiceTotal: 5000,
        TotalTax: 1250,
        InvoiceDate: "2024-11-01",
        DueDate: "2024-11-30",
    };

    const dummyAccounts = [
        { BasAccount: "1000", Description: "Sales Revenue", Debit: "5000", Credit: "0" },
        { BasAccount: "2000", Description: "VAT Payable", Debit: "0", Credit: "1250" },
        { BasAccount: "3000", Description: "Cost of Goods Sold", Debit: "3000", Credit: "0" },
        { BasAccount: "4000", Description: "Operating Expenses", Debit: "2000", Credit: "0" },
        { BasAccount: "5000", Description: "Retained Earnings", Debit: "0", Credit: "1750" },
    ];

    const handleBookInvoice = () => {
        setIsBooked(true);
        setTimeout(() => {
            setIsBooked(false);
        }, 3000); // Reset after animation
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg w-[600px]">
            <div className={`${isBooked ? "hidden" : "block"}`}>
                <h1 className="text-2xl font-bold text-green-600">Verifikation</h1>
                {/* Invoice Info */}
                <div className="space-y-2 mb-3">

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col col-span-3 justify-between space-y-2">
                            <p className="font-bold text-lg text-gray-600 mb-1">{dummyInvoice.VendorAddressRecipient}</p>
                            <p className="text-gray-600">Belopp</p>
                            <p className="text-gray-500">Varav moms</p>
                            <p className="text-gray-600">Fakturadatum</p>
                            <p className="text-gray-600">Förfallodatum</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <p className="font-bold text-lg text-gray-600 mb-1">{dummyInvoice.InvoiceId}</p>
                            <p className="font-bold text-green-600">{dummyInvoice.InvoiceTotal}kr</p>
                            <p className="text-gray-500">{dummyInvoice.TotalTax}kr</p>
                            <p className="text-gray-600">{dummyInvoice.InvoiceDate}</p>
                            <p className="text-gray-600">{dummyInvoice.DueDate}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="paid-status" className="text-base text-gray-600">
                        Betald
                    </Label>
                    <Switch isOn={isPaid} setIsOn={setIsPaid} id="paid-status" checked={isPaid} />
                </div>

                {/* Booking Suggestions */}
                <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Bokföringsförslag</h3>
                    <ScrollArea ref={scrollAreaRef} className="max-h-[200px] overflow-y-auto">
                        <Table className="table-auto w-full">
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead>Konto</TableHead>
                                    <TableHead>Beskrivning</TableHead>
                                    <TableHead>Debet</TableHead>
                                    <TableHead>Kredit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dummyAccounts.map((account, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{account.BasAccount}</TableCell>
                                        <TableCell>{account.Description}</TableCell>
                                        <TableCell>{account.Debit}</TableCell>
                                        <TableCell>{account.Credit}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>

                {/* Confirm Button */}
                <Button onClick={handleBookInvoice} className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Bekräfta och bokför
                </Button>
            </div>

            {/* Success Animation */}
            {isBooked && <SuccessAnimation />}
        </div>
    );
}
