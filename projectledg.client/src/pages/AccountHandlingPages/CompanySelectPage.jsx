import {useRef, useEffect, useState} from 'react'
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import CompanyCard  from './CompanySelectPageComponents/CompanyCard'


export default function CompanySelectPage() {
    const companies = [
        { id: 1, companyName: 'ProjectLedge AB', orgNumber:"5512121212", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzEeCxzRgaXXJLyj5E5VJSYryWOImZBbjPXg&sheight=80&width=80' },
        { id: 2, companyName: 'AddeBadde Bygg & VVS AB', orgNumber: "5500224466", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzEeCxzRgaXXJLyj5E5VJSYryWOImZBbjPXg&sheight=80&width=80' },
        { id: 3, companyName: 'Emplojd.com', orgNumber: "5511335577", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzEeCxzRgaXXJLyj5E5VJSYryWOImZBbjPXg&sheight=80&width=80' },
        { id: 4, companyName: 'Emplojd.com', orgNumber: "5511335577", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzEeCxzRgaXXJLyj5E5VJSYryWOImZBbjPXg&sheight=80&width=80' },
        { id: 5, companyName: 'Emplojd.com', orgNumber: "5511335577", imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzEeCxzRgaXXJLyj5E5VJSYryWOImZBbjPXg&sheight=80&width=80' },
    ]

    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

useEffect(() => {
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        setShowLeftArrow(container.scrollLeft > 0)
        setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth)
    }

    const container = scrollContainerRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
}, []);

const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = direction === "left" ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth'});
}

const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
}

const handleMouseUp = () => {
    setIsDragging(false);
}

const handleMouseMove = (e) => {
    if (!isDragging)
        return 
        e.preventDefault()
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk; 
}

 
    return (
        <section className="bg-slate-300 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-3xl w-full">
                <h1 className="text-2xl font-bold text-center mb-2">Välj företag</h1>
                <p className="text-gray-600 text-center mb-8">
                    Logged in users can view full business profiles and can save contact details.
                </p>
                <div className='relative'>
                    {showLeftArrow && (
                        <button
                            onClick={() => scroll('left')}
                            className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10'
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={24}/>
                        </button>
                    )}

                    {showRightArrow && (
                        <button
                            onClick={() => scroll('right')}
                            className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10'
                            aria-label='Scroll right'
                        >
                            <ChevronRight size={24}/>
                        </button>
                    )}

                    <div
                        ref={scrollContainerRef}
                        className='flex overflow-x-auto space-x-4 pb-4 scrollbar-hide cursor-grab active:cursor-grabbing' 
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            WebkitOverflowScrolling: "touch",
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        {companies.map((company) => (
                            <CompanyCard
                                key={company.id}
                                companyName={company.companyName}
                                orgNumber={company.orgNumber}
                                imageUrl={company.imageUrl}
                            />
                        ))}
                        <button className='flex-shrink-0 w-48 bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-200 transition-colors duration-300'>
                            <PlusCircle size={48} className='text-gray-400 mb-2' />
                            <span className="sr-only">Lägg till nytt företag</span>
                        </button>
                    </div>
                    {showLeftArrow && (
                        <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                    )}
                    {showRightArrow && (
                        <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                    )}

                </div>
            </div>
        </section>
    )
}