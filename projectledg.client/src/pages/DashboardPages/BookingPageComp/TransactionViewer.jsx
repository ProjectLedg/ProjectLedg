import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import ReloadButton from "@/components/ReloadButton"
import { FileText } from 'lucide-react'
import { axiosConfig } from '/axiosconfig'
import LoggerPagination from "./LoggerPagination"

const TransactionViewer = () => {
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { companyId } = useParams()
  // Pagination
  const pagination = 20;
  const [startItem, setStartItem] = useState(0)
  const [endItem, setEndItem] = useState(pagination)
  const [pageNumber, setPageNumber] = useState(1)

  const totalTransactions = transactions.length;
  const totalPages = Math.ceil(transactions.length / pagination);

  // Search filter for logger table
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await axiosConfig.get(`/Transaction/GetTransactionsForBooking/companyId/${companyId}`)
      console.log(response)


      if (response.status === 200) {
        setTransactions(response.data)
      }

    } catch (error) {
      setError("Något gick fel")
      console.error("Error fetching transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }
  const displayedTransactions = transactions.slice(startItem, endItem);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[600px] flex flex-col shadow-lg">
        <CardHeader className="flex flex-row justify-between border-b dark:border-darkBorder">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center dark:text-white">
            <FileText className="mr-2 text-green-500" />
            Verifikationer
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 mt-8">
          <Skeleton className="h-12 w-[90%] rounded-md dark:bg-darkSecondary" />
          <Skeleton className="h-12 w-[70%] rounded-md dark:bg-darkSecondary" />
          <Skeleton className="h-12 w-[88%] rounded-md dark:bg-darkSecondary" />
          <Skeleton className="h-12 w-[66%] rounded-md dark:bg-darkSecondary" />
          <Skeleton className="h-12 w-[75%] rounded-md dark:bg-darkSecondary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full h-[600px] flex flex-col shadow-lg">
        <CardHeader className="flex flex-row justify-between border-b dark:border-darkBorder">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center dark:text-white">
            <FileText className="mr-2 text-green-500" />
            Verifikationer
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full w-full flex flex-col justify-center items-center space-y-2">
          <p className="text-black">{error}</p>


          {/* <Button
            className="bg-green-500 hover:bg-green-600 dark:text-white ml-4"
            onClick={fetchTransactions}
          >
            Ladda om
          </Button> */}

          <ReloadButton onClick={fetchTransactions} isLoading={isLoading} />

        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[90vh] md:h-[40rem] flex flex-col shadow-lg">
      <CardHeader className="flex flex-col md:flex-row justify-between border-b-2 dark:border-darkBorder">
        <CardTitle className="text-2xl font-bold mr-2 text-gray-800 flex items-center dark:text-white">
          <FileText className="mr-2 text-green-500" />
          Verifikationer
        </CardTitle>
        <Input
          type="text"
          placeholder="Sök här..."
          value={searchQuery}
          onChange={handleSearch}
          className="bg-gray-100 md:w-[25%] rounded-md "
        />
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full bg-gray-200 md:bg-white dark:bg-darkBackground">
          <Table className="hidden md:table dark:border-darkBorder">
            <TableHeader className="bg-gray-100 dark:bg-darkBorder dark:border-darkBorder">
              <TableRow className="dark:border-darkBorder">
                <TableHead className="text-left dark:text-white/90">Datum</TableHead>
                <TableHead className="text-left dark:text-white/90">Kund</TableHead>
                <TableHead className="text-left dark:text-white/90">Fakturanummer</TableHead>
                <TableHead className="text-left dark:text-white/90">Summa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransactions.filter((item) =>
                // Filter based on search query
                Object.values(item)
                  .filter((value) => typeof value === "string")
                  .some((value) => value.toString().toLowerCase().includes(searchQuery))
              ).map((transaction, index) => (
                <TableRow
                  key={index}
                  className="border-b dark:border-darkBorder hover:bg-gray-50 dark:hover:bg-darkSurface cursor-pointer"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <TableCell className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {transaction.vendorOrCustomerName}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {transaction.invoiceNumber}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm font-medium text-green-500">
                    {transaction.invoiceTotal.toFixed(2)} kr
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="md:hidden space-y-4 bg-gray-200 dark:bg-darkBackground ">
            <div className="flex flex-col">
              {transactions
                .filter((item) =>
                  // Filter based on search query
                  Object.values(item)
                    .filter((value) => typeof value === "string")
                    .some((value) => value.toString().toLowerCase().includes(searchQuery))
                )
                .map((trans) => (
                  <Card key={trans.invoiceNumber} className="mt-2 w-full shadow-lg">
                    <CardContent
                      className="grid grid-cols-2 justify-between items-center gap-3 py-4 px-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-darkBackground dark:border-darkBorder transition-colors duration-200"
                      onClick={() => handleTransactionClick(trans)} // Use trans, which contains the transaction data
                    >
                      <p className="font-semibold text-lg text-gray-700 dark:text-white mb-1 px-2">Fakturanr: </p>
                      <p className="font-semibold text-lg text-gray-700 dark:text-white mb-1 px-2 text-end">{trans.invoiceNumber}</p>

                      <p className="font-semibold text-gray-600 dark:text-white px-2">Kund: </p>
                      <p className="font-semibold text-gray-600 dark:text-white px-2 text-end">{trans.vendorOrCustomerName}</p>

                      <p className="text-gray-600 dark:text-white px-2">Fakturadatum: </p>
                      <p className="text-gray-600 dark:text-white px-2 text-end">{new Date(trans.transactionDate).toLocaleDateString()}</p>

                      <p className="font-medium text-gray-600 dark:text-white px-2">Belopp: </p>
                      <p className="font-semibold text-green-500 px-2 text-end">{trans.invoiceTotal}kr</p>

                      {/* We don't have 'isPaid' or 'isBooked' in the data, so we'll remove those badges */}
                      {/* If you want to display those fields later, you can add them back when available */}

                      <p className="col-span-2 text-center text-sm text-gray-400 dark:text-gray-500">Tryck för att se detaljer</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

        </ScrollArea>
      </CardContent>
      <div className="hidden md:flex justify-center gap-3 pt-2 mb-3 border-t-2 dark:border-darkBorder">
        <LoggerPagination
          totalPages={totalPages}
          totalInvoices={totalTransactions}
          pagination={pagination}
          setStartItem={setStartItem}
          setEndItem={setEndItem}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="px-4 py-4 w-[95%] md:w-[85vw] max-h-[80vh] max-w-3xl rounded-lg dark:border-darkBorder dark:bg-darkBackground">
          <DialogHeader>
            <DialogTitle className=" text-2xl font-bold text-green-600">Verifikation</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="mt-4 space-y-6">
              {/* Grid for details */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 px-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-white">Datum</p>
                  <p className="text-sm text-gray-900 dark:text-darkSecondary">
                    {new Date(selectedTransaction.transactionDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-white">Kund</p>
                  <p className="text-sm text-gray-900 dark:text-darkSecondary">
                    {selectedTransaction.vendorOrCustomerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-white">Fakturanummer</p>
                  <p className="text-sm text-gray-900 dark:text-darkSecondary">
                    {selectedTransaction.invoiceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-white">Summa</p>
                  <p className="text-lg font-semibold text-green-600">
                    {selectedTransaction.invoiceTotal.toFixed(2)} kr
                  </p>
                </div>
              </div>

              {/* Table for bas accounts */}
              <div className="overflow-x-auto col-span-2">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-darkBorder dark:border-darkBorder">
                      <TableHead className="text-left dark:text-white/90">Bas Konto</TableHead>
                      <TableHead className="text-left dark:text-white/90">Beskrivning</TableHead>
                      <TableHead className="text-left dark:text-white/90">Debit</TableHead>
                      <TableHead className="text-left dark:text-white/90">Kredit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTransaction.basAccounts.map((account, index) => (
                      <TableRow key={index} className="border-b dark:border-darkBorder hover:bg-gray-50 dark:hover:bg-darkSurface">
                        <TableCell className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                          {account.accountNumber}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                          {account.description}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                          {account.debit.toFixed(2)}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                          {account.credit.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Stäng
            </Button>
          </DialogFooter>
        </DialogContent>

      </Dialog>
    </Card>
  );
}

export default TransactionViewer