import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, PieChart, DollarSign } from "lucide-react";
import {
  TooltipShad,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProfitabilityCard = ({ runway }) => {
  if (!runway) {
    return null; // or return a loading state or placeholder
  }

  const getStatusColor = (percentage) => {
    if (percentage >= 80) return "text-green-500 dark:text-darkPositive";
    if (percentage >= 50) return "text-yellow-500";
    return "text-red-500 dark:text-dark-negative";
  };

  const statusColor = getStatusColor(runway.percentage);

  return (
    <Card className="max-h-64 overflow-hidden flex flex-col pb-4 dark:bg-darkSurface dark:border-0 ">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 py-2 pt-6">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center dark:text-darkSecondary">
          <PieChart className="mr-2 h-4 w-4" />
          Lönsamhet
        </CardTitle>

        <TooltipProvider>
          <TooltipShad>
            <TooltipTrigger>
              <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground dark:text-darkSecondary" />
            </TooltipTrigger>
            <TooltipContent className="dark:bg-darkBackground dark:border-darkBorder">
              <p>
                Lönsamhet räknas utifrån vinstmarginalen på ett normaliserat
                värde
              </p>
            </TooltipContent>
          </TooltipShad>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
      <div className="flex flex-col md:flex-row items-center justify-around">

          <div className="relative w-16 h-16 md:w-32 md:h-32">
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
              <span
                className={`text-2xl md:text-4xl font-semibold ${statusColor}`}
              >
                {runway.percentage}
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${statusColor}`}>
              {runway.message}
            </div>
            <div className="text-xs text-muted-foreground dark:text-darkSecondary">
              Runway: {runway.months} månader
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitabilityCard;
