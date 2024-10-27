import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, PieChart, DollarSign } from 'lucide-react'
import {
  TooltipShad,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ProfitabilityCard = ({ runway }) => {
  if (!runway) {
    return null; // or return a loading state or placeholder
  }

  const getStatusColor = (percentage) => {
    if (percentage >= 80) return 'text-green-500'
    if (percentage >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const statusColor = getStatusColor(runway.percentage)

  return (
    <Card className="max-h-64 overflow-hidden flex flex-col pb-4">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 py-2 pt-6">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
          <PieChart className="mr-2 h-4 w-4" />
          Lönsamhet
        </CardTitle>
        
        <TooltipProvider>
          <TooltipShad>
            <TooltipTrigger>
                <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </TooltipTrigger>
              <TooltipContent>
                <p>Lönsamhets räknas utifrån vinstmarginalen på ett normaliserat värde</p>
              </TooltipContent>
          </TooltipShad>
      </TooltipProvider>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between py-2">
        <div className="flex items-center justify-around">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                className="text-gray-200 stroke-current" 
                strokeWidth="10" 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent"
              ></circle>
              <circle 
                className={`${statusColor} stroke-current`}
                strokeWidth="10" 
                strokeLinecap="round" 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent"
                strokeDasharray={`${runway.percentage * 2.51}, 251.2`}
                transform="rotate(-90 50 50)"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <DollarSign className={`h-8 w-8 ${statusColor}`} />
            </div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${statusColor}`}>
              {runway.message}
            </div>
            <div className="text-sm text-muted-foreground">
              Runway: {runway.months} månader
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-sm">
            <span>Lönsamhet poäng:</span>
            <span className={`font-semibold ${statusColor}`}>
              {runway.percentage}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfitabilityCard