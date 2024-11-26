import { useRef, useEffect, useState } from 'react'
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import CompanyCard from './CompanySelectPageComponents/CompanyCard'
import { useNavigate } from 'react-router-dom'
import { axiosConfig } from '/axiosconfig'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"



export default function CompanySelectPage() {

  // Test data
  // const companyIcons = [
  //   "src/assets/company-icons/balance.png",
  //   "src/assets/company-icons/bank.png",
  //   "src/assets/company-icons/box.png",
  //   "src/assets/company-icons/briefcase.png",
  //   "src/assets/company-icons/calculator.png",
  //   "src/assets/company-icons/city.png",
  //   "src/assets/company-icons/company.png"
  // ]

  // const testCompanies = [
  //   {
  //     "id": 1,
  //     "companyName": "Test Company",
  //     "orgNumber": "1234567890"
  //   },
  //   {
  //     "id": 1,
  //     "companyName": "Test Company",
  //     "orgNumber": "1234567890"
  //   },
  //   {
  //     "id": 1,
  //     "companyName": "Test Company",
  //     "orgNumber": "1234567890"
  //   },
  //   {
  //     "id": 1,
  //     "companyName": "Test Company",
  //     "orgNumber": "1234567890"
  //   },
  //   {
  //     "id": 1,
  //     "companyName": "Test Company",
  //     "orgNumber": "1234567890"
  //   },
  //   {
  //     "id": 1,
  //     "companyName": "Test Company",
  //     "orgNumber": "1234567890"
  //   },
  //   {
  //     "id": 1,
  //     "companyName": "Test Company",
  //     "orgNumber": "1234567890"
  //   },
  //   {
  //     "id": 1,
  //     "companyName": "Test Company",
  //     "orgNumber": "1234567890"
  //   }

  // ]

  const infoText = {
    sectionTitle: "Välj företag",
    sectionDescription: "Välj ett företag för att fortsätta eller lägg till ett nytt"
  }

  const scrollContainerRef = useRef(null);
  const [companies, setCompanies] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState();
  const [showRightArrow, setShowRightArrow] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const containerClass = companies.length && !showRightArrow ? "justify-center" : "justify-start";

  // Runs when companies has loaded in (as it needs that to calculate scroll width)
  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth);
    };

    const handleResize = () => {
      if (container) {
        setShowRightArrow(container.scrollWidth > container.clientWidth);
        setShowLeftArrow(container.scrollLeft > 0);
      }
    };

    if (container) {
      handleResize(); // Run once on mount
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [isLoading]);

  // Runs once per render 
  // Check if container is scrollable and center the items in the selector if not
  useEffect(() => {
    const container = scrollContainerRef.current;

    const checkScrollable = () => {
      if (container) {
        const isScroll = container.scrollWidth > container.clientWidth;
        setShowRightArrow(isScroll);
        setShowLeftArrow(false); // Default to false for left
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => {
      window.removeEventListener("resize", checkScrollable);
    };
  }, []);


  // Runs when navigate changes
  useEffect(() => {
    const getUserCompanies = async () => {
      try {
        setProgress(0);
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(20);

        
        const response = await axiosConfig.get("/Company/getUserCompanies");
        // console.log(response.data)
        setProgress(60);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(80);

        const companiesData = response.data;
        setCompanies(companiesData);
        // setCompanies(testCompanies) // TEST DEBUG

        // If user has no companies route them to company create as they need to create one
        if (companiesData.length === 0) {
          navigate(`/company-create`)
        // If user has exactly 1 company route them to the dashboard directly as there's no selections to choose anyway
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

    // if (container) {
    //   if (container.scrollWidth - container.clientWidth === 0) {
    //     setShowRightArrow(false)
    //   }



    //   container.addEventListener('scroll', handleScroll);
    //   return () => container.removeEventListener('scroll', handleScroll);
    //}
  }, [navigate]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = direction === "left" ? -200 : 200;
    // container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
    const newScrollLeft = container.scrollLeft + scrollAmount;

    // Clamp the scroll position
    container.scrollTo({
      left: Math.max(0, Math.min(newScrollLeft, container.scrollWidth - container.clientWidth)),
      behavior: 'smooth'
    });
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
    
    // Clamp the scroll position
    container.scrollLeft = Math.max(0, Math.min(newScrollLeft, container.scrollWidth - container.clientWidth));
  }

  const handleCompanySelect = (company) => {
    // console.log(company)
    navigate(`/dashboard/${company.companyId}`)
  }

  const handleCompanyAdd = () => {
    navigate('/company-create');
  }

  // Display when loading
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
        <h1 className="text-3xl font-bold text-center mb-2 text-green-500">{infoText.sectionTitle}</h1>
        <p className="text-gray-600 text-center mb-8">
          {infoText.sectionDescription}
        </p>
        <div className='relative'>
          {showLeftArrow && (
            <Button
              onClick={() => scroll('left')}
              className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-500 text-white hover:bg-green-400 hover:text-white rounded-full p-2 shadow-md z-20'
              size="icon"
              variant="ghost"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {showRightArrow && (
            <Button
              onClick={() => scroll('right')}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-500 text-white hover:bg-green-400 hover:text-white rounded-full p-2 shadow-md z-20'
              size="icon"
              variant="ghost"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          <div
            ref={scrollContainerRef}
            className={`overflow-x-auto overscroll-contain touch-pan-x scrollbar-hide flex space-x-4 p-4 cursor-grab active:cursor-grabbing  ${containerClass}`}
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
                // imageUrl={companyIcons[i % companyIcons.length]}
                handleCompanySelect={handleCompanySelect}
              />
            ))}
            <button onClick={handleCompanyAdd} className='flex-shrink-0 w-48 h-48 bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-green-100 transition-colors duration-300 border-2 border-dashed border-green-300'>
              <PlusCircle size={48} className='text-green-500 mb-2' />
              <span className="text-green-700 font-medium">Lägg till nytt företag</span>
            </button>
          </div>
          {/* Fade in the left and right side */}
          {showLeftArrow && (
            <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          )}
          {showRightArrow && (
            <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
          )}
        </div>
      </div>
    </section>
  )
}