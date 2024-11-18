import { useState } from "react"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X, ListFilter, Filter, ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"


export default function LoggerTable({ invoices, handleInvoiceClick, startItem, endItem }) {
    const [showUnpaid, setShowUnpaid] = useState(false)
    const [showUnbooked, setShowUnbooked] = useState(false)
    const [sortBy, setSortBy] = useState("id") // Default sorting by invoice id
    const [sortOrder, setSortOrder] = useState("asc") // Default sort order ascending

    // Sets the sort order for the selected column
    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(key)
            setSortOrder("asc")
        }
    };

    // Sort the data for the column in asc or desc order
    const sortedData = [...invoices].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (sortOrder === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
            return bValue < aValue ? -1 : bValue > aValue ? 1 : 0
        }
    });

    return (
        <div>
            {/* Desktop view */}
            <Table className="hidden md:table">
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-darkBackground dark:border-darkBorder ">
                        <DropdownMenu className="flex flex-row justify-around">
                            <TableHead className="font-bold cursor-pointer dark:bg-darkBackground dark:text-darkSecondary" onClick={() => handleSort("invoiceNumber")}>Fakturanummer {sortBy === "invoiceNumber" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                            <TableHead className="font-bold cursor-pointer dark:bg-darkBackground dark:text-darkSecondary" onClick={() => handleSort("vendorName")}>Kund {sortBy === "vendorName" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                            <TableHead className="font-bold cursor-pointer dark:bg-darkBackground dark:text-darkSecondary" onClick={() => handleSort("invoiceDate")}>Fakturadatum {sortBy === "invoiceDate" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                            <TableHead className="font-bold cursor-pointer dark:bg-darkBackground dark:text-darkSecondary" onClick={() => handleSort("dueDate")}>Förfallodatum {sortBy === "dueDate" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                            <TableHead className="font-bold cursor-pointer dark:bg-darkBackground dark:text-darkSecondary" onClick={() => handleSort("invoiceTotal")}>Belopp {sortBy === "invoiceTotal" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                            <DropdownMenuTrigger>
                                <TableHead
                                    className="font-bold flex justify-center items-center dark:text-darkSecondary ">
                                    Status
                                    <Filter className="ml-2 w-4 h-4 inline" />
                                </TableHead>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Visa endast</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={showUnpaid}
                                    onCheckedChange={setShowUnpaid}
                                >
                                    Ej betald
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUnbooked}
                                    onCheckedChange={setShowUnbooked}
                                >
                                    Ej bokförd
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableRow>
                </TableHeader>
                <TableBody className="border-b dark:border-darkBorder">
                    {sortedData
                        .filter((item) => item.isPaid === false || item.isPaid === !showUnpaid) // set if only show unpaid items
                        .filter((item) => item.isBooked === false || item.isBooked === !showUnbooked) // set if only show unbooked items
                        .slice(startItem, endItem) // pagination - start at startItem and end at endItem = 1 page   
                        .map((invoice) => (
                            <TableRow
                                key={invoice.id}
                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-darkBackground dark:border-darkBorder transition-colors duration-200"
                                onClick={() => handleInvoiceClick(invoice)}
                            >
                                <TableCell className="font-medium p-4">
                                    {invoice.invoiceNumber}
                                </TableCell>
                                <TableCell className="font-medium p-4">
                                    {invoice.vendorName}
                                </TableCell>
                                <TableCell className="p-4" >
                                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="p-4">
                                    {new Date(invoice.dueDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="font-medium p-4">
                                    {invoice.invoiceTotal}kr
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="flex space-x-2">
                                        <Badge className="w-[45%] max-h-5 dark:text-white" variant={invoice.isPaid ? "success" : "destructive"}>
                                            {invoice.isPaid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                            <span className="ml-1 dark:text-white">{invoice.isPaid ? "Betald" : "Ej betald"}</span>
                                        </Badge>
                                        <Badge className="w-[45%] max-h-5 dark:text-white " variant={invoice.isBooked ? "success" : "destructive"}>
                                            {invoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                            <span className="ml-1 dark:text-white">{invoice.isBooked ? "Bokförd" : "Ej Bokförd"}</span>
                                        </Badge>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            {/* Mobile view switch to card based layout instead of the table */}
            <div className="md:hidden space-y-4 bg-gray-200 dark:bg-darkBackground ">

                <div className="mt-2 flex flex-wrap justify-between items-center bg-white dark:bg-darkBackground p-4 rounded-md shadow-sm">
                    {/* Sorting Options */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleSort("invoiceNumber")}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md border dark:border-none dark:text-white dark:bg-darkSurface ${sortBy === "invoiceNumber" ? "bg-green-500 text-white" : "bg-white text-gray-700"
                                }`}
                        >
                            Fakturanummer
                            {sortBy === "invoiceNumber" &&
                                (sortOrder === "asc" ? (
                                    <ArrowUpNarrowWide className="ml-2 w-4 h-4" />
                                ) : (
                                    <ArrowDownWideNarrow className="ml-2 w-4 h-4" />
                                ))}
                        </button>
                        <button
                            onClick={() => handleSort("vendorName")}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md border dark:border-none dark:text-white dark:bg-darkSurface  ${sortBy === "vendorName" ? "bg-green-500 text-white" : "bg-white text-gray-700"
                                }`}
                        >
                            Kund
                            {sortBy === "vendorName" &&
                                (sortOrder === "asc" ? (
                                    <ArrowUpNarrowWide className="ml-2 w-4 h-4" />
                                ) : (
                                    <ArrowDownWideNarrow className="ml-2 w-4 h-4" />
                                ))}
                        </button>
                        {/* Add more sorting buttons as needed */}
                    </div>

                    {/* Filtering Options */}
                    <div className="">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center px-4 py-2 text-sm font-medium bg-white text-gray-700 rounded-md border dark:border-none dark:text-white dark:bg-darkSurface shadow-sm">
                                    Filter
                                    <Filter className="ml-2 w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-4 space-y-2 shadow-lg bg-white dark:border-darkBorder dark:text-white dark:bg-darkSurface rounded-md">
                                <DropdownMenuLabel>Visa endast</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={showUnpaid}
                                    onCheckedChange={setShowUnpaid}
                                >
                                    Ej betald
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={showUnbooked}
                                    onCheckedChange={setShowUnbooked}
                                >
                                    Ej bokförd
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                
                {sortedData
                    .filter((item) => item.isPaid === false || item.isPaid === !showUnpaid) // set if only show unpaid items
                    .filter((item) => item.isBooked === false || item.isBooked === !showUnbooked) // set if only show unbooked items
                    .slice(startItem, endItem) // pagination - start at startItem and end at endItem = 1 page   
                    .map((invoice) => (
                        <Card key={invoice.id} className="mt-2 shadow-lg">

                            <CardContent 
                                className="grid grid-cols-2 justify-between items-center gap-3 py-4 px-2  rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-darkBackground dark:border-darkBorder transition-colors duration-200"
                                onClick={() => handleInvoiceClick(invoice)}
                            >
                                <p className="font-semibold text-lg text-gray-700 dark:text-white mb-1 px-2">Fakturanr: </p>
                                <p className="font-semibold text-lg text-gray-700 dark:text-white mb-1 px-2">{invoice.invoiceNumber}</p>
                                <p className="font-semibold text-gray-600 dark:text-white px-2">Kund: </p>
                                <p className="font-semibold text-gray-600 dark:text-white px-2">{invoice.vendorName}</p>
                                <p className="text-gray-600 dark:text-white px-2">Fakturadatum: </p>
                                <p className="text-gray-600 dark:text-white px-2">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                                <p className="text-gray-600 dark:text-white px-2">Förfallodatum: </p>
                                <p className="text-gray-600 dark:text-white px-2">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                                <p className="font-medium text-gray-600 dark:text-white px-2">Belopp: </p>
                                <p className="font-semibold text-green-500 px-2">{invoice.invoiceTotal}kr</p>
                                <Badge className="max-w-28 mx-2 mt-2 max-h-5 dark:text-white" variant={invoice.isPaid ? "success" : "destructive"}>
                                    {invoice.isPaid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                    <span className="ml-1 dark:text-white">{invoice.isPaid ? "Betald" : "Ej betald"}</span>
                                </Badge>
                                <Badge className="max-w-28 mt-2 mx-2 max-h-5 dark:text-white " variant={invoice.isBooked ? "success" : "destructive"}>
                                    {invoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                    <span className="ml-1 dark:text-white">{invoice.isBooked ? "Bokförd" : "Ej Bokförd"}</span>
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    )
}