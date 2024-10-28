import { useState } from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination"



export default function LoggerPagination({totalPages, totalInvoices}) {
    const [startItem, setStartItem] = useState(1)
    const [endItem, setEndItem] = useState(20)
    const [pageNumber, setPageNumber] = useState(1)

    // Pagination set variables
    const pagination = 20;
    
    // Determine the start and end of the visible range
    const maxVisiblePages = 3;
    const startPage = Math.max(1, pageNumber - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    const adjustedStartPage = Math.max(1, Math.min(startPage, totalPages - maxVisiblePages + 1));

    const handlePreviousPageClick = () => {
        // Make sure user can't go into the negatives past "page 1"
        if (pageNumber > 1) {
            const updatedPageNumber = pageNumber - 1;
            const updatedEndItem = updatedPageNumber * pagination;
            const updatedStartItem = updatedEndItem - pagination;


            console.log(updatedPageNumber)

            setPageNumber(updatedPageNumber);
            setEndItem(updatedEndItem);
            setStartItem(updatedStartItem);
        }
    }

    const handleNextPageClick = () => {
        // Make sure user can't go into the negatives past the amount of available items
        if (pageNumber < totalPages) {
            const updatedPageNumber = pageNumber + 1;
            const updatedStartItem = pageNumber * pagination;
            const updatedEndItem = Math.min(updatedStartItem + pagination, totalInvoices);

            console.log(updatedPageNumber)


            setPageNumber(updatedPageNumber);
            setEndItem(updatedEndItem);
            setStartItem(updatedStartItem);
        }
    }

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous button */}
                <PaginationItem disabled={pageNumber === 1}>
                    <PaginationPrevious onClick={handlePreviousPageClick} />
                </PaginationItem>

                {/* Map all pages */}
                {Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => {
                    const page = adjustedStartPage + index;
                    return (
                        <PaginationItem key={page} active={pageNumber === page}>
                            <PaginationLink className={pageNumber === page ? "bg-green-400" : ""} onClick={() => setPageNumber(page)}>{page}</PaginationLink>
                        </PaginationItem>
                    );
                })}
                {/* Next button */}
                <PaginationItem disabled={pageNumber === totalPages}>
                    <PaginationNext onClick={handleNextPageClick} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
} 