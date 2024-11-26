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
    <Card className="max-h-64 overflow-hidden flex flex-col dark:bg-darkSurface dark:border-0 ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 pt-7 px-4">
        <div className=" titleContainer flex flex-row gap-1 items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            Lönsamhet
          </CardTitle>
          <PieChart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground dark:text-darkSecondary" />
        </div>
        <TooltipProvider>
          <TooltipShad>
            <TooltipTrigger className="hidden lg:block">
              <HelpCircle className="ml-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground dark:text-darkSecondary" />
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
      <CardContent className=" CardContent min-h-60 md:min-h-fit pt-2 flex-grow max-w-full flex flex-col sm:items-center justify-between">
        <div className="flex flex-row w-full h-full md:flex-col items-center justify-evenly">

          <div className="SCORECIRCLE relative w-36 h-36 md:w-24 md:h-24">
            <svg className="lg:max-w[80%) lg:max-w[80%] w-full h-full" viewBox="0 0 100 100">
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
            <div className="absolute inset-0 flex items-center justify-center text-4xl md:text-3xl"
            >
              <span
                className={`font-semibold ${statusColor} `}

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
