import { useState } from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination"

export default function LoggerPagination({ totalPages, totalInvoices, pagination, setStartItem, setEndItem, pageNumber, setPageNumber }) {

    // Set pagination  variables   
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
        <Pagination >
            <PaginationContent >
                {/* Previous button */}
                <PaginationItem className="cursor-pointer"  disabled={pageNumber === 1}>
                    <PaginationPrevious onClick={handlePreviousPageClick} className="dark:hover:bg-darkBackground"  />
                </PaginationItem>

                {/* Map all pages */}
                {Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => {
                    const page = adjustedStartPage + index;
                    return (
                        <PaginationItem className="cursor-pointer" key={page} active={pageNumber === page}>
                            <PaginationLink 
                                className={pageNumber === page ? "text-white bg-green-500 hover:bg-green-500/80" : ""} 
                                onClick={() => handleNumberPageClick(page)}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                {/* Next button */}
                <PaginationItem className="cursor-pointer" disabled={pageNumber === totalPages}>
                    <PaginationNext onClick={handleNextPageClick} className="dark:hover:bg-darkBackground"/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
} 