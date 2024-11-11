import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

export default function UserDropdown({ user, companies, currentCompany, onCompanyChange, isChatOpen }) {
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
        <div className={`flex items-center w-full max-w-sm px-2 pb-6 dark:bg-darkBackground bg-background border-b-2 dark:border-darkBorder ${isChatOpen ? 'justify-around' : 'justify-between'} h-16`}>
            <div className="flex items-center space-x-3 ">
                <Avatar className={`p-[0.125rem]  border-2 border-green-500 rounded-full ${isChatOpen ? 'ml-3' : 'ml-[0.25rem] '}`}>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="bg-green-50 dark:bg-green-900 text-green-500 font-semibold">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <motion.div
                    initial="hidden"
                    animate={isChatOpen ? "hidden" : "visible"}
                    variants={textVariants}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-md font-semibold">{user.name}</h2>
                    <p className="text-xs text-muted-foreground dark:text-darkSecondary">{currentCompany.name}</p>
                </motion.div>
            </div>
            <DropdownMenu>
                {/* Render DropdownMenuTrigger only if chat is not open */}
                {!isChatOpen && (
                    <DropdownMenuTrigger asChild>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={buttonVariants}
                        >
                            <TooltipProvider>
                                <TooltipShad>
                                    <TooltipTrigger>
                                        <Button variant="outline" className="ml-auto border-0 p-5 rounded-full flex items-center justify-center relative dark:bg-darkBackground hover:dark:bg-darkSurface">
                                            <ChevronsUpDown className="absolute inset-0 h-4 w-4 m-auto opacity-50" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="dark:bg-darkBackground dark:border-darkBorder">Växla mellan företag</TooltipContent>
                                </TooltipShad>
                            </TooltipProvider>

                        </motion.div>
                    </DropdownMenuTrigger>
                )}
                <DropdownMenuContent align="end" className="w-[15rem] dark:bg-darkSurface dark:border-darkBorder">
                    {companies.map((company) => (
                        <DropdownMenuItem
                            key={company.id}
                            onClick={() => onCompanyChange(company)}
                            className="cursor-pointer"
                        >
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    currentCompany.id === company.id ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {company.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
