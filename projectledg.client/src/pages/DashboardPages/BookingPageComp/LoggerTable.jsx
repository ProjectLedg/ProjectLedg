import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X, ListFilter, ArrowUpNarrowWide, ArrowDownWideNarrow} from "lucide-react"
    
import invoiceLogger from './invoiceLogger.json'

export default function LoggerTable() {
const [startItem, setStartItem] = useState(0)
const [endItem, setEndItem] = useState(20)
const [showUnpaid, setShowUnpaid] = useState(false)
const [showUnbooked, setShowUnbooked] = useState(false)
const [sortBy, setSortBy] = useState("id") // Default sorting by invoice id
const [sortOrder, setSortOrder] = useState("asc") // Default sort order ascending

    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(key)
            setSortOrder("asc")
        }
    };

    const sortedData = [...invoiceLogger.mockTestData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

        if (sortOrder === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0     
        } else {
            return bValue < aValue ? -1 : bValue > aValue ? 1 : 0
        }
    });

    const handleInvoiceClick = (invoice) => {
        setSelectedInvoice({ ...invoice })
        setIsModalOpen(true)
    }

return (
    <div>
    <Table>
        <TableHeader>
            <TableRow className="bg-gray-100">
                <DropdownMenu className="flex flex-row justify-around">
                        <TableHead className="font-bold cursor-pointer min-w-52" onClick={() => handleSort("id")}>Fakturanummer {sortBy === "id" && (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" /> )}</TableHead>
                        <TableHead className="font-bold cursor-pointer min-w-52" onClick={() => handleSort("date")}>Fakturadatum {sortBy === "date" && (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />)}</TableHead>
                        <TableHead className="font-bold cursor-pointer min-w-52" onClick={() => handleSort("dueDate")}>Förfallodatum {sortBy === "date" && (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) }</TableHead>
                        <TableHead className="font-bold cursor-pointer min-w-52" onClick={() => handleSort("amount")}>Belopp {sortBy === "amount" && (sortOrder === "asc" ? <ArrowUpNarrowWide className="ml-1 w-4 h-4 inline" /> : <ArrowDownWideNarrow className="ml-1 w-4 h-4 inline" />) }</TableHead>
                    <DropdownMenuTrigger>
                        <TableHead 
                            className="font-bold flex justify-center items-center">
                                Status 
                                <ListFilter className="ml-2 w-4 h-4 inline" />
                        </TableHead>
                    </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
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
        <TableBody>
            {sortedData
            .filter((item) => item.isPaid === false || item.isPaid === !showUnpaid) // set if only show unpaid items
            .filter((item) => item.isBooked === false || item.isBooked === !showUnbooked) // set if only show unbooked items
            .slice(startItem, endItem) // pagination
            .map((invoice) => (
                <TableRow
                    key={invoice.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleInvoiceClick(invoice)}
                >
                    <TableCell className="font-medium">
                        {invoice.id}
                    </TableCell>
                    <TableCell >
                        {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                        {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                        {invoice.amount}kr
                    </TableCell>
                    <TableCell>
                        <div className="flex space-x-2">
                            <Badge variant={invoice.isPaid ? "success" : "destructive"}>
                                {invoice.isPaid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                <span className="ml-1">{invoice.isPaid ? "Betald" : "Ej betald"}</span>
                            </Badge>
                            <Badge variant={invoice.isBooked ? "success" : "destructive"}>
                                {invoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                <span className="ml-1">{invoice.isBooked ? "Bokförd" : "Ej Bokförd"}</span>
                            </Badge>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </div>

    )
}