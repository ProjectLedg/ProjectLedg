import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input";

import { Check, X, ListFilter, Filter, ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"


export default function LoggerTable({ invoices, handleInvoiceClick, startItem, endItem, searchQuery, handleSearch }) {
    const [showUnpaid, setShowUnpaid] = useState(false)
    const [showUnbooked, setShowUnbooked] = useState(false)
    const [sortBy, setSortBy] = useState("id") // Default sorting by invoice id
    const [sortOrder, setSortOrder] = useState("asc") // Default sort order ascending
    const [safeSearchQuery, setSafeSearchQuery] = useState()
    console.log("inv", invoices)

    useEffect(() => {


        const convertedString = searchQuery?.toString().toLowerCase() || ""

        console.log("Converted string: ", convertedString)

        setSafeSearchQuery(convertedString)

    }, [searchQuery])

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
            <Table className="hidden lg:table">
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-darkBorder dark:border-darkBorder">
                        <DropdownMenu className="flex flex-row justify-around">
                            <TableHead className="font-bold cursor-pointer dark:text-white/90" onClick={() => handleSort("invoiceNumber")}>Fakturanummer {sortBy === "invoiceNumber" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                            <TableHead className="font-bold cursor-pointer dark:text-white/90" onClick={() => handleSort("vendorName")}>Kund {sortBy === "vendorName" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                            <TableHead className="font-bold cursor-pointer dark:text-white/90" onClick={() => handleSort("invoiceDate")}>Fakturadatum {sortBy === "invoiceDate" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                            <TableHead className="font-bold cursor-pointer dark:text-white/90" onClick={() => handleSort("dueDate")}>Förfallodatum {sortBy === "dueDate" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                            <TableHead className="font-bold cursor-pointer dark:text-white/90" onClick={() => handleSort("invoiceTotal")}>Belopp {sortBy === "invoiceTotal" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                            <DropdownMenuTrigger>
                                <TableHead
                                    className="font-bold flex justify-center items-center dark:text-white/90 ">
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
                        .filter((item) =>
                            // Filter based on search query
                            Object.values(item)
                                .filter((value) => typeof value === "string" || typeof value === "number")
                                .some((value) => value?.toString().toLowerCase().includes(safeSearchQuery))
                        )
                        .slice(startItem, endItem) // pagination - start at startItem and end at endItem = 1 page   
                        .map((invoice) => (
                            <TableRow
                                key={invoice.id}
                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-darkSurface dark:border-darkBorder transition-colors duration-200"
                                onClick={() => handleInvoiceClick(invoice)}
                            >
                                <TableCell className="font-medium p-4">
                                    {invoice.invoiceNumber || "N/A"}
                                </TableCell>
                                <TableCell className="font-medium p-4">
                                    {invoice.vendorName || "N/A"}
                                </TableCell>
                                <TableCell className="p-4" >
                                    {new Date(invoice.invoiceDate).toLocaleDateString() || "N/A"}
                                </TableCell>
                                <TableCell className="p-4">
                                    {new Date(invoice.dueDate).toLocaleDateString() || "N/A"}
                                </TableCell>
                                <TableCell className="font-medium p-4">
                                    {invoice.invoiceTotal || 0}kr
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                                        <Badge className="w-[45%] md:w-[90%] max-h-5 dark:text-white" variant={invoice.isPaid ? "success" : "destructive"}>
                                            {invoice.isPaid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                            <span className="ml-1 dark:text-white">{invoice.isPaid ? "Betald" : "Ej betald"}</span>
                                        </Badge>
                                        <Badge className="w-[45%] md:w-[90%] max-h-5   dark:text-white " variant={invoice.isBooked ? "success" : "destructive"}>
                                            {invoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                            <span className="ml-1 dark:text-white">{invoice.isBooked ? "Bokförd" : "Bokförd"}</span>
                                        </Badge>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            {/* Mobile view switch to card based layout instead of the table */}
            <div className="lg:hidden bg-gray-200 dark:bg-darkBackground ">
                <div className="bg-white dark:bg-darkBackground rounded-b-md">
                    <Input
                        type="text"
                        placeholder="Sök här..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="bg-gray-100 dark:bg-gray-300 dark:text-gray-500 dark:placeholder:text-gray-400 dark:mt-2 w-[95%] mx-auto border-none"
                    />
                    <div className=" flex  items-center gap-x-1 px-2 py-3 bg-white rounded-b-md dark:bg-darkBackground">
                        {/* Sorting Options */}
                        <div className="flex items-center justify-between gap-x-1 m-auto">
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

                            {/* Filtering Options */}
                            <div>
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
                    </div>
                </div>


                {sortedData
                    .filter((item) => item.isPaid === false || item.isPaid === !showUnpaid) // set if only show unpaid items
                    .filter((item) => item.isBooked === false || item.isBooked === !showUnbooked) // set if only show unbooked items
                    .filter((item) =>
                        // Filter based on search query
                        Object.values(item)
                            .filter((value) => typeof value === "string" || typeof value === "number")
                            .some((value) => value?.toString().includes(safeSearchQuery))
                    )
                    .slice(startItem, endItem) // pagination - start at startItem and end at endItem = 1 page   
                    .map((invoice) => (
                        <Card key={invoice.id} className="mt-2 shadow-lg">

                            <CardContent
                                className="grid grid-cols-2 justify-between items-center gap-3 py-4 px-2  rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-darkBackground dark:border-darkBorder transition-colors duration-200"
                                onClick={() => handleInvoiceClick(invoice)}
                            >
                                <p className="font-semibold text-lg text-gray-700 dark:text-white mb-1 px-2">Fakturanr: </p>
                                <p className="font-semibold text-lg text-gray-700 dark:text-white mb-1 px-2">{invoice.invoiceNumber || "N/A"}</p>
                                <p className="font-semibold text-gray-600 dark:text-white px-2">Kund: </p>
                                <p className="font-semibold text-gray-600 dark:text-white px-2">{invoice.vendorName || "N/A"}</p>
                                <p className="text-gray-600 dark:text-white px-2">Fakturadatum: </p>
                                <p className="text-gray-600 dark:text-white px-2">{new Date(invoice.invoiceDate).toLocaleDateString() || "N/A"}</p>
                                <p className="text-gray-600 dark:text-white px-2">Förfallodatum: </p>
                                <p className="text-gray-600 dark:text-white px-2">{new Date(invoice.dueDate).toLocaleDateString() || "N/A"}</p>
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
                                <p className="mt-1 col-span-2 text-center text-sm text-gray-400 dark:text-gray-500">Tryck för att se detaljer</p>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    )
}