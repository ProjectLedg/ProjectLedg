import { useRef, useEffect, useState } from 'react'
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import CompanyCard from './CompanySelectPageComponents/CompanyCard'
import { useNavigate } from 'react-router-dom'
import {axiosConfig} from '/axiosconfig'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export default function CompanySelectPage() {
  const companyIcons = [
    "src/assets/company-icons/balance.png",
    "src/assets/company-icons/bank.png",
    "src/assets/company-icons/box.png",
    "src/assets/company-icons/briefcase.png",
    "src/assets/company-icons/calculator.png",
    "src/assets/company-icons/city.png",
    "src/assets/company-icons/company.png"
  ]

  const infoText = {
    sectionTitle: "Välj företag",
    sectionDescription: "Välj ett företag för att fortsätta eller lägg till ett nytt"
  }

  const scrollContainerRef = useRef(null);
  const [companies, setCompanies] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserCompanies = async () => {
      try {
        setProgress(0);
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(20);
        
        const response = await axiosConfig.get("Company/getUserCompanies");
        console.log(response)
        setProgress(60);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(80);

        const companiesData = response.data;
        setCompanies(companiesData);

        if (companiesData.length === 0) {
          navigate(`/company-create`)
        } else if (companiesData.length === 1) {
          navigate(`/dashboard/${companiesData[0].id}`)
        }

        setProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("An error occurred retrieving companies:", error);
      } finally {
        setIsLoading(false);
      }
    };  
    getUserCompanies();

    const container = scrollContainerRef.current;
    if (container) {
      if (container.scrollWidth - container.clientWidth === 0) {
        setShowRightArrow(false)
      }

      const handleScroll = () => {
        setShowLeftArrow(container.scrollLeft > 0)
        setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth)
      }

      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [navigate]);

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
    if (!isDragging) return;
    e.preventDefault();
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Progress value={progress} className="w-[60%] mb-4" />
        <p className="text-primary">Laddar in företag...</p>
      </div>
    )
  }
 
  return ( 
    <section className="bg-gradient-to-bl from-blue-700/40 to-gray-200 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-5xl w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-green-700">{infoText.sectionTitle}</h1>
        <p className="text-gray-600 text-center mb-8">
          {infoText.sectionDescription}
        </p>
        <div className='relative'>
          {showLeftArrow && (
            <Button
              onClick={() => scroll('left')}
              className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10'
              size="icon"
              variant="ghost"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {showRightArrow && (
            <Button
              onClick={() => scroll('right')}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10'
              size="icon"
              variant="ghost"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          <div
            ref={scrollContainerRef}
            className='flex overflow-x-auto space-x-4 p-4 scrollbar-hide cursor-grab active:cursor-grabbing' 
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {companies.map((company, i) => (
              <CompanyCard
                key={company.id}
                companyId={company.id}
                companyName={company.companyName}
                orgNumber={company.orgNumber}
                imageUrl={companyIcons[i % companyIcons.length]}
                handleCompanySelect={handleCompanySelect}
              />
            ))}
            <button onClick={handleCompanyAdd} className='flex-shrink-0 w-48 h-48 bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-green-100 transition-colors duration-300 border-2 border-dashed border-green-300'>
              <PlusCircle size={48} className='text-green-500 mb-2' />
              <span className="text-green-700 font-medium">Lägg till nytt företag</span>
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