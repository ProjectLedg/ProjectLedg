import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, CirclePlus } from "lucide-react";
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { axiosConfig } from '/axiosconfig'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    TooltipShad,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function UserDropdown({isChatOpen, isNavOpen }) {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [userData, setuserData] = useState(null);
    const [companyData, setcompanyData] = useState([]);
    const [currentCompany, setCurrentCompany] = useState(null);


    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
          
          try {
            const userDataresponse = await axiosConfig.get('/User/getUser')
            const companyDataresponse = await axiosConfig.get('/Company/getUserCompanies')
                        
            const fetchedCompanyData = companyDataresponse.data.map(company => ({
                id: company.id,
                name: company.companyName
              }));
            
            setuserData(userDataresponse.data.firstName)
            setcompanyData(fetchedCompanyData)
            
            const activeCompany = fetchedCompanyData.find(company => company.id === companyId);
            setCurrentCompany(activeCompany);
            
            
          } catch (error) {
            console.log("Error message from userDropdown: ", error)
          } 
        };
    
        fetchData();
        return () => {
            isMounted = false;
        };
          
    },[]);   
    
    
    const handleCompanyChange = (company) => {
        console.log(company)
        setCurrentCompany(company); // Update current company
        navigate(`/dashboard/${company.id}`); // Navigate to the new site
    };

    const handleRouteCompanyCreate = ()=> {
        navigate("/company-create");
    };
    
    
    const textVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
    };

    const buttonVariants = {
        hidden: {
            opacity: 0,
            transition: { duration: 0 }, // Instant transition for hiding
        },
        visible: {
            opacity: 1,
            transition: { duration: 5 }, // Slow transition for showing
        },
    };

    return (
        <div className={`flex items-center w-full max-w-sm px-2  dark:bg-darkBackground bg-background border-b-2 dark:border-darkBorder ${isChatOpen ? 'justify-around ' : 'justify-between pb-6'} h-16`}>
            <div className="flex items-center space-x-3 ">
                <Avatar className={`p-[0.125rem]  border-2 border-green-500 rounded-full ${isChatOpen ? 'ml-3 mb-7' : 'ml-[0.25rem] '}`}>
                    <AvatarImage src={userData?.avatarUrl || ""} alt={userData?.firstName || ""} />
                    <AvatarFallback className="bg-green-50 dark:bg-green-900 text-green-500 font-semibold"> {userData ? userData.charAt(0) : "?"}</AvatarFallback>
                </Avatar>
                <motion.div
                    initial="hidden"
                    animate={isChatOpen ? "hidden" : "visible"}
                    variants={textVariants}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-md font-semibold">{userData}</h2>
                    <p className="text-xs text-muted-foreground dark:text-darkSecondary">{currentCompany?.name || "No Company"}</p>
                </motion.div>
            </div>
            <DropdownMenu>
                {/* Render DropdownMenuTrigger only if chat is not open */}
                {!isChatOpen && isNavOpen && (
                    <DropdownMenuTrigger asChild>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={buttonVariants}
                        >
                            <TooltipProvider>
                                <TooltipShad>
                                    <TooltipTrigger>
                                        <Button
                                            variant="outline"
                                            className="ml-auto border-0 p-5 rounded-full flex items-center justify-center relative dark:bg-darkBackground hover:dark:bg-darkSurface cursor-pointer"
                                        >
                                            <ChevronsUpDown className="absolute inset-0 h-4 w-4 m-auto opacity-50" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        // Hide tooltip content when nav is open
                                        className={`${isNavOpen ? 'hidden' : ''} dark:bg-darkBackground dark:border-darkBorder`}
                                    >
                                        Växla mellan företag
                                    </TooltipContent>
                                </TooltipShad>
                            </TooltipProvider>
                        </motion.div>
                    </DropdownMenuTrigger>
                )}



                <DropdownMenuContent align="end" className="w-[15rem] dark:bg-darkSurface dark:border-darkBorder">
                    {companyData.map((company) => (
                        <DropdownMenuItem
                            key={company.id}
                            onClick={() => handleCompanyChange(company)}
                            className="cursor-pointer"
                        >
                      <Check
                    className={cn(
                        "mr-2 h-4 w-4 text-green-500",
                        currentCompany?.id === company.id ? "opacity-100" : "opacity-0"
                    )}/>
                            {company.name}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleRouteCompanyCreate}
                    >
                        <CirclePlus
                        className="mr-2 h-4 w-4"
                        />
                        <p>Lägg till företag</p>

                    
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
