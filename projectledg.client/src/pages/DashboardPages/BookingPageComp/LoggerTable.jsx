import { useState } from "react"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X, ListFilter, Filter, ArrowUpNarrowWide, ArrowDownWideNarrow} from "lucide-react"
    

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
    <Table>
        <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-darkBackground dark:border-darkBorder">
                <DropdownMenu className="flex flex-row justify-around ">
                    <TableHead className="font-bold cursor-pointer dark:bg-darkBackground dark:text-darkSecondary" onClick={() => handleSort("id")}>Fakturanummer {sortBy === "id" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" /> }</TableHead>
                    <TableHead className="font-bold cursor-pointer dark:bg-darkBackground dark:text-darkSecondary" onClick={() => handleSort("date")}>Fakturadatum {sortBy === "date" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" />}</TableHead>
                    <TableHead className="font-bold cursor-pointer dark:bg-darkBackground dark:text-darkSecondary" onClick={() => handleSort("dueDate")}>Förfallodatum {sortBy === "dueDate" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" /> }</TableHead>
                    <TableHead className="font-bold cursor-pointer dark:bg-darkBackground dark:text-darkSecondary" onClick={() => handleSort("amount")}>Belopp {sortBy === "amount" ? (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) : <ListFilter className="ml-1 w-4 h-4 inline" /> }</TableHead>
                <DropdownMenuTrigger>
                    <TableHead 
                        className="font-bold flex justify-center items-center dark:text-darkSecondary ">
                            Status 
                            <Filter className="ml-2 w-4 h-4 inline" />
                    </TableHead>
                </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Visa endast</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
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
                    <TableCell className="font-medium py-4 px-6">
                        {invoice.id}
                    </TableCell>
                    <TableCell >
                        {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                        {invoice.amount}kr
                    </TableCell>
                    <TableCell className="w-64">
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
    )
}