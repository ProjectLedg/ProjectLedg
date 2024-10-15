import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ArrowUpRight, ArrowDownRight, Edit2, Download } from 'lucide-react'

const MetricCard = ({ title, value, change, changeType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
      {changeType === 'positive' ? (
        <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
      ) : (
        <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
      )}
    </CardHeader>
    <CardContent>
      <div className="text-lg sm:text-2xl font-bold">{value}</div>
      <p className={`text-xs ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </CardContent>
  </Card>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
        <p className="text-sm font-semibold mb-2">{label}</p>
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
  // Mock data
  const mockFinancialData = {
    metrics: [
      { title: "Totala Tillgångar", value: "180 000 SEK", change: "+9% QoQ", changeType: "positive" },
      { title: "Totala Skulder", value: "100 000 SEK", change: "+5% QoQ", changeType: "negative" },
      { title: "Intäkter (YTD)", value: "204 000 SEK", change: "+12% YoY", changeType: "positive" },
      { title: "Kostnader (YTD)", value: "161 500 SEK", change: "+8% YoY", changeType: "negative" }
    ],
    balansData: [
      { date: '2023-Q1', assets: 120000, liabilities: 80000 },
      { date: '2023-Q2', assets: 135000, liabilities: 85000 },
      { date: '2023-Q3', assets: 150000, liabilities: 90000 },
      { date: '2023-Q4', assets: 165000, liabilities: 95000 },
      { date: '2024-Q1', assets: 180000, liabilities: 100000 },
    ],
    resultatData: [
      { month: 'JAN', income: 30000, expenses: 25000 },
      { month: 'FEB', income: 32000, expenses: 26000 },
      { month: 'MAR', income: 35000, expenses: 27000 },
      { month: 'APR', income: 33000, expenses: 26500 },
      { month: 'MAY', income: 36000, expenses: 28000 },
      { month: 'JUN', income: 38000, expenses: 29000 },
    ]
  }

  const [financialData, setFinancialData] = useState(mockFinancialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Commented out API call logic
  /*
  useEffect(() => {
    const fetchFinancialData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('http://localhost:7223/financial-reports')
        if (!response.ok) {
          throw new Error('Failed to fetch financial data')
        }
        const data = await response.json()
        setFinancialData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFinancialData()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
  }
  */

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-0">Finansiella Rapporter</h2>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {financialData.metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-lg sm:text-xl mb-2 sm:mb-0">Balansrapport</CardTitle>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Ladda ner
            </Button>
          </CardHeader>
          <CardContent >
            <ChartContainer 
            
              config={{ 
                assets: { label: 'Tillgångar', color: 'hsl(var(--chart-1))' },
                liabilities: { label: 'Skulder', color: 'hsl(var(--chart-2))' }
              }} 
              className="h-[200px] sm:h-[300px] w-[100%] "
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialData.balansData} className="ml-[-2rem]">
                  <XAxis dataKey="date" tick={{fontSize: 10}} interval={'preserveStartEnd'} />
                  <YAxis tick={{fontSize: 10}} tickFormatter={(value) => `${value / 1000}k`} />
                  <Line type="monotone" dataKey="assets" stroke="var(--color-assets)" strokeWidth={2} />
                  <Line type="monotone" dataKey="liabilities" stroke="var(--color-liabilities)" strokeWidth={2} />
                  <ChartTooltip content={<CustomTooltip />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-lg sm:text-xl mb-2 sm:mb-0">Resultatrapport</CardTitle>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Ladda ner
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{ 
                income: { label: 'Intäkter', color: 'hsl(var(--chart-3))' },
                expenses: { label: 'Kostnader', color: 'hsl(var(--chart-4))' }
              }} 
              className="h-[200px] sm:h-[300px] w-[100%]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData.resultatData} className="ml-[-2rem]">
                  <XAxis dataKey="month" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} tickFormatter={(value) => `${value / 1000}k`} />
                  <Bar dataKey="income" fill="var(--color-income)" />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" />
                  <ChartTooltip content={<CustomTooltip />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}