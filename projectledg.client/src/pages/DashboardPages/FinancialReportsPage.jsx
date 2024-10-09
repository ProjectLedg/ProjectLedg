import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ArrowUpRight, ArrowDownRight, Edit2, Download } from 'lucide-react'

const balansData = [
  { date: '2023-Q1', assets: 120000, liabilities: 80000 },
  { date: '2023-Q2', assets: 135000, liabilities: 85000 },
  { date: '2023-Q3', assets: 150000, liabilities: 90000 },
  { date: '2023-Q4', assets: 165000, liabilities: 95000 },
  { date: '2024-Q1', assets: 180000, liabilities: 100000 },
]

const resultatData = [
  { month: 'JAN', income: 30000, expenses: 25000 },
  { month: 'FEB', income: 32000, expenses: 26000 },
  { month: 'MAR', income: 35000, expenses: 27000 },
  { month: 'APR', income: 33000, expenses: 26500 },
  { month: 'MAY', income: 36000, expenses: 28000 },
  { month: 'JUN', income: 38000, expenses: 29000 },
]

const MetricCard = ({ title, value, change, changeType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {changeType === 'positive' ? (
        <ArrowUpRight className="h-4 w-4 text-green-500" />
      ) : (
        <ArrowDownRight className="h-4 w-4 text-red-500" />
      )}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </CardContent>
  </Card>
)

export default function FinancialReportsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Finansiella Rapporter</h2>
        <Button variant="outline" size="sm">
          <Edit2 className="mr-2 h-4 w-4" />
          Redigera
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Totala Tillgångar" value="180 000 kr" change="+9% QoQ" changeType="positive" />
        <MetricCard title="Totala Skulder" value="100 000 kr" change="+5% QoQ" changeType="negative" />
        <MetricCard title="Intäkter (YTD)" value="204 000 kr" change="+12% YoY" changeType="positive" />
        <MetricCard title="Kostnader (YTD)" value="161 500 kr" change="+8% YoY" changeType="negative" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Balansrapport</CardTitle>
            <Button variant="ghost" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Ladda ner
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{ 
                assets: { label: 'Tillgångar', color: 'hsl(var(--chart-1))' },
                liabilities: { label: 'Skulder', color: 'hsl(var(--chart-2))' }
              }} 
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balansData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line type="monotone" dataKey="assets" stroke="var(--color-assets)" strokeWidth={2} />
                  <Line type="monotone" dataKey="liabilities" stroke="var(--color-liabilities)" strokeWidth={2} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resultatrapport</CardTitle>
            <Button variant="ghost" size="sm">
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
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resultatData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="income" fill="var(--color-income)" />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}