import { useState } from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination"

export default function LoggerPagination({totalPages, totalInvoices, setStartItem, setEndItem}) {
    const [pageNumber, setPageNumber] = useState(1)

    // Pagination set variables
    const pagination = 20;
    
    // Determine the start and end of the visible range
    const maxVisiblePages = 3;
    const startPage = Math.max(1, pageNumber - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    const adjustedStartPage = Math.max(1, Math.min(startPage, totalPages - maxVisiblePages + 1));

    const handlUpdateStartItem = (updatedStartItem) => {
        setStartItem(updatedStartItem)
    }

    const handlUpdateEndItem = (updatedEndItem) => {
        setEndItem(updatedEndItem)
    }

    // Makes sure clicking the pagination numbers does the correct action and nothing when pressing current page number
    const handleNumberPageClick = (page) => {
        if (page != pageNumber && page < pageNumber ) {
            handlePreviousPageClick()
        }
        else if (page != pageNumber && page > pageNumber) {
            handleNextPageClick()
        }
    }

    const handlePreviousPageClick = () => {
        // Make sure user can't go into the negatives past "page 1"
        if (pageNumber > 1) {
            const updatedPageNumber = pageNumber - 1;
            const updatedEndItem = updatedPageNumber * pagination;
            const updatedStartItem = updatedEndItem - pagination;

            setPageNumber(updatedPageNumber);

            handlUpdateStartItem(updatedStartItem);
            handlUpdateEndItem(updatedEndItem);
        }
    }

    const handleNextPageClick = () => {
        // Make sure user can't go into the negatives past the amount of available items
        if (pageNumber < totalPages) {
            const updatedPageNumber = pageNumber + 1;
            const updatedStartItem = pageNumber * pagination;
            const updatedEndItem = Math.min(updatedStartItem + pagination, totalInvoices);

            setPageNumber(updatedPageNumber);

            handlUpdateStartItem(updatedStartItem);
            handlUpdateEndItem(updatedEndItem);
        }
    }

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous button */}
                <PaginationItem className="cursor-pointer"  disabled={pageNumber === 1}>
                    <PaginationPrevious onClick={handlePreviousPageClick} />
                </PaginationItem>

                {/* Map all pages */}
                {Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => {
                    const page = adjustedStartPage + index;
                    return (
                        <PaginationItem className="cursor-pointer" key={page} active={pageNumber === page}>
                            <PaginationLink 
                                className={pageNumber === page ? "text-primary-foreground bg-green-500 hover:text-primary-foreground hover:bg-green-500/80" : ""} 
                                onClick={() => handleNumberPageClick(page)}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                {/* Next button */}
                <PaginationItem className="cursor-pointer" disabled={pageNumber === totalPages}>
                    <PaginationNext onClick={handleNextPageClick} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
} 