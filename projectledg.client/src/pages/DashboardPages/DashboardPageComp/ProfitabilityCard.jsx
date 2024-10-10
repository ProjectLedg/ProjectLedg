import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, TrendingUp, DollarSign } from 'lucide-react'

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
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
          <TrendingUp className="mr-2 h-4 w-4" />
          Lönsamhet
        </CardTitle>
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
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
              <DollarSign className={`h-12 w-12 ${statusColor}`} />
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className={`text-2xl font-bold ${statusColor}`}>
              {runway.status}
            </div>
            <div className="text-sm text-muted-foreground">
              Runway: {runway.months} månader
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-around text-m mb-1">
            <span>Lönsamhet poäng: </span>
            <span className={`font-large ${statusColor}`}>
              {runway.percentage}
            </span>
          </div>
          
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfitabilityCard