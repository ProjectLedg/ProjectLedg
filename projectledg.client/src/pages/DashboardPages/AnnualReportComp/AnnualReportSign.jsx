"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle } from "lucide-react"
import {

    TooltipContent,
    TooltipProvider,
    TooltipShad,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Component() {
    const [role, setRole] = useState('')
    const [disposableIncome, setDisposableIncome] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log({ role, disposableIncome, firstName, lastName })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 rounded-lg bg-gray-100">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Din roll i företaget</p>
                    <TooltipProvider>
                        <TooltipShad>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ange din roll i företaget tex, VD, CEO etc för att korrekt signera bokslutet</p>
                            </TooltipContent>
                        </TooltipShad>
                    </TooltipProvider>
                </div>
                <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Ange din roll i företaget"
                />


            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Andel som överförs till nästa räkneskapsår (%)</p>
                    <TooltipProvider>
                        <TooltipShad>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ange hur stor andel i procent av lönsamheten ni vill föra över till nästa räkneskapsår</p>
                            </TooltipContent>
                        </TooltipShad>
                    </TooltipProvider>
                </div>
                <Input
                    type="number"
                    value={disposableIncome}
                    onChange={(e) => setDisposableIncome(e.target.value)}
                    placeholder="Ange andel"
                    min="0"
                    max="100"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium">Förnamn</p>
                    <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Förnamn"
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Efternamn</p>
                    <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Efternamn"
                    />
                </div>
            </div>

            <Button type="submit" className="w-full">Signera</Button>
        </form>
    )
}