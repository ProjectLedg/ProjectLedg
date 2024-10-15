import {useRef, useEffect, useState} from 'react'
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import CompanyCard  from './CompanySelectPageComponents/CompanyCard'
import { useNavigate } from 'react-router-dom'
import axiosConfig from '/axiosconfig'

export default function CompanySelectPage() {;
    
    // Images for the company placeholder icons (more can be added or changed later)
    const companyIcons = [
        "src/assets/company-icons/balance.png",
        "src/assets/company-icons/bank.png",
        "src/assets/company-icons/box.png",
        "src/assets/company-icons/briefcase.png",
        "src/assets/company-icons/calculator.png",
        "src/assets/company-icons/city.png",
        "src/assets/company-icons/company.png"
    ]

    // Replace with imported json?
    const infoText = {
        sectionTitle: "Välj företag",
        sectionDescription: ""
    }

    const scrollContainerRef = useRef(null);
    const [companies, setCompanies] = useState([]);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const navigate = useNavigate();


useEffect(() => {
    const getUserCompanies = async () => {
        try {
            const response = await axiosConfig.get("/Company/getUserCompanies");
            const companiesData = response.data;
            setCompanies(response.data);

            // if there's no companies go to company create page
            if (companiesData.length === 0 ) {
                navigate(`/company-create`)
            }
            // if there's only one company skip the select and go to dahsboard directly
            else if (companiesData.length === 1){
                navigate(`dashboard/${companiesData[0].id}`)
            }

        } catch (error) {
            console.error("An error occurred retrieving companies:", error);
        }
    };  
    getUserCompanies();



    // Check if there is any scrollable overflow in the container, if not (0) then disable the arrow (otherwise it'll show even if there is nothing to scroll upon first render)
    const container = scrollContainerRef.current;
    if (container.scrollWidth - container.clientWidth === 0)
        setShowRightArrow(false)  

    // Calculates which arrow to show if content has been scrolled
    // display left arrow if scrollLeft > 0 which means user has scrolled
    // display right arrow if current scroll position is less than the max scrollable distance
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        setShowLeftArrow(container.scrollLeft > 0)
        setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth)
    }

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);

}, []);

// Scrolls card carousel 200px in the arrow direction
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

const handleCompanySelect = (company) => {
    console.log(company)
    navigate(`/dashboard/${company.companyId}`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
}

const handleCompanyAdd = () => {    
    navigate('/company-create');
}

 
    return ( 
        <section className="bg-white min-h-screen flex items-center justify-center p-4 overflow-x-hidden	">
            <div className=" bg-green-300 rounded-xl p-8 shadow-lg max-w-5xl w-full">
                <h1 className="text-2xl font-bold text-center mb-2">{infoText.sectionTitle}</h1>
                <p className="text-gray-600 text-center mb-8">
                    {infoText.sectionDescription}
                </p>
                <div className='relative'>
                    {/* Left arrow button  */}
                    {showLeftArrow && (
                        <button
                            onClick={() => scroll('left')}
                            className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10'
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={24}/>
                        </button>
                    )}
                    {/* Right arrow button */}
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
                        className='flex overflow-x-auto space-x-4 p-4 scrollbar-hide cursor-grab active:cursor-grabbing' 
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            WebkitOverflowScrolling: "touch",
                            userSelect: 'none', // disables accidental markdown on the text when click and dragging

                        }}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >

                        {companies.map((company, i) => (
                            <CompanyCard
                                key={company.id}
                                companyId = {company.id}
                                companyName={company.companyName}
                                orgNumber={company.orgNumber}
                                imageUrl={companyIcons[i]}
                                handleCompanySelect={handleCompanySelect}
                            />
                        ))}
                        <button onClick={handleCompanyAdd} className='flex-shrink-0 w-48 bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-200 transition-colors duration-300'>
                            <PlusCircle size={48} className='text-gray-400 mb-2' />
                            <span className="sr-only">Lägg till nytt företag</span>
                        </button>
                    </div>
                    {showLeftArrow && (
                        <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-green-300 to-transparent pointer-events-none "></div>
                    )}
                    {showRightArrow && (
                        <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-green-300 to-transparent pointer-events-none"></div>
                    )}

                </div>
            </div>
        </section>
    )
}