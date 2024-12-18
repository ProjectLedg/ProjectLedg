import React, { useState, useEffect } from 'react'
import { axiosConfig } from '/axiosconfig'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { RefreshCcw, HelpCircle } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import {
  TooltipProvider,
  TooltipShad,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const toolDescription = [
  "Summan av alla företagets tillgångar, inklusive kontanter, lager och fastigheter.",
  "Summan av företagets alla skulder, inklusive lån och leverantörsskulder.",
  "Totala inkomster från försäljning av varor och tjänster.",
  "Totala utgifter för verksamheten, såsom löner, hyra och materialkostnader."
];



const MetricCard = ({ title, value, change, changeType, toolDescription }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium dark:text-darkSecondary">
        {title}
      </CardTitle>
      <TooltipProvider>
        <TooltipShad>
          {/* Hide on mobile as it doesn't work */}
          <TooltipTrigger className="hidden lg:block">
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground dark:text-darkSecondary" />
          </TooltipTrigger>
          <TooltipContent className="dark:bg-darkBackground dark:border-darkBorder  ">
            <p dangerouslySetInnerHTML={{ __html: toolDescription }} ></p>
          </TooltipContent>
        </TooltipShad>
      </TooltipProvider>
    </CardHeader>
    <CardContent>
      <div className="text-lg sm:text-2xl font-bold">{value}</div>
      <p className={`text-xs ${changeType === 'positiv' ? 'text-green-500' :
        changeType === 'negativ' ? 'text-red-500' :
          'text-gray-500'
        }`}>
        {changeType === "ingen" ? "" : change}
      </p>
    </CardContent>
  </Card>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-md dark:bg-darkBackground dark:border-darkBorder">
        <p className="text-sm font-semibold mb-2 dark:text-darkSecondary">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}: </span>
            {entry.value.toLocaleString()} SEK
          </p>
        ))}
      </div>
    );
  }
  return null;
};




export default function FinancialReportsPage() {
  const { companyId } = useParams()
  const [financialData, setFinancialData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const currentYear = 2023 // new Date().getFullYear()
      const response = await axiosConfig.post('/Finance/GetFinancialReport', {
        companyId: parseInt(companyId),
        year: currentYear
      })
      console.log(response.data);

      setFinancialData(response.data)
    } catch (error) {
      setError('Failed to fetch financial data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [companyId])

  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="space-y-4 p-4 ">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight mb-2 sm:mb-0">Finansiella Rapporter</h2>
        <Button onClick={fetchData} variant="outline" size="sm" disabled={isLoading} className="dark:bg-darkSurface dark:border-darkBorder">
          <RefreshCcw className="mr-2 h-4 w-4 dark:text-darkSecondary" />
          Uppdatera data
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !financialData ? (
          Array(4).fill(0).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[140px] dark:bg-darkSecondary" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-[100px] mb-1 dark:bg-darkSecondary" />
                <Skeleton className="h-4 w-[60px] dark:bg-darkSecondary" />
              </CardContent>
            </Card>
          ))
        ) : (
          financialData.financialData.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={`${metric.amount.toLocaleString()} SEK`}
              change={metric.change}
              changeType={metric.changeType.toLowerCase()}
              toolDescription={toolDescription[index % toolDescription.length]}

            />
          ))
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-lg sm:text-xl mb-2 sm:mb-0 dark:text-darkSecondary">Balansrapport</CardTitle>
            {/* <Button variant="ghost" size="sm" className="w-full sm:w-auto hover:dark:bg-darkBackground">
              <Download className="mr-2 h-4 w-4 " />
              Ladda ner
            </Button> */}
          </CardHeader>
          <CardContent>
            {isLoading || !financialData ? (
              <Skeleton className="h-[200px] sm:h-[300px] w-full dark:bg-darkSecondary" />
            ) : (
              <ChartContainer
                config={{
                  assets: { label: 'Tillgångar', color: 'hsl(var(--chart-1))' },
                  liabilities: { label: 'Skulder', color: 'hsl(var(--chart-2))' }
                }}
                className="h-[200px] sm:h-[300px] w-[100%]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData.balanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: isDarkMode ? 'white' : 'grey' }}
                      tickLine={{ stroke: isDarkMode ? 'white' : 'grey' }}
                      axisLine={{ stroke: isDarkMode ? 'white' : 'grey' }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: isDarkMode ? 'white' : 'grey' }}
                      tickLine={{ stroke: isDarkMode ? 'white' : 'grey' }}
                      axisLine={{ stroke: isDarkMode ? 'white' : 'grey' }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <ChartTooltip content={<CustomTooltip />}
                      cursor={{ stroke: isDarkMode ? 'white' : 'grey', strokeDasharray: '3 3' }}
                    />
                    <Line type="monotone" dataKey="assets" stroke={isDarkMode ? '#00B8D9' : '#4CAF50'} name="Tillgångar" strokeWidth={2} />
                    <Line type="monotone" dataKey="liabilities" stroke={isDarkMode ? '#FF6F00' : '#4d5696'} name="Skulder" strokeWidth={2} />

                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-lg sm:text-xl mb-2 sm:mb-0 dark:text-darkSecondary">Resultatrapport</CardTitle>
            {/* <Button variant="ghost" size="sm" className="w-full sm:w-auto hover:dark:bg-darkBackground">
              <Download className="mr-2 h-4 w-4" />
              Ladda ner
            </Button> */}
          </CardHeader>
          <CardContent>
            {isLoading || !financialData ? (
              <Skeleton className="h-[200px] sm:h-[300px] w-full dark:bg-darkSecondary" />
            ) : (
              <ChartContainer
                config={{
                  revenue: { label: 'Intäkter', color: 'hsl(var(--chart-3))' },
                  expenses: { label: 'Kostnader', color: 'hsl(var(--chart-4))' }
                }}
                className="h-[200px] sm:h-[300px] w-[100%]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData.resultData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="monthName" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `${value / 1000}k`} />
                    <ChartTooltip content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="revenue" fill={isDarkMode ? '#00B8D9' : '#4CAF50'} name="Intäkter" />
                    <Bar dataKey="expenses" fill={isDarkMode ? '#FF6F00' : '#4d5696'} name="Kostnader" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="text-center text-red-500 mt-4">
          {error}
          <Button onClick={fetchData} variant="outline" size="sm" className="ml-2 dark:bg-darkSurface dark:border-darkBorder">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}