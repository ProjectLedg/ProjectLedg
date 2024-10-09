import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { ArrowUpRight, ArrowDownRight, Edit2 } from 'lucide-react'

const cashData = [
  { date: '2023-03-01', amount: 54000 },
  { date: '2023-03-08', amount: 55000 },
  { date: '2023-03-15', amount: 58000 },
  { date: '2023-03-22', amount: 57000 },
  { date: '2023-03-29', amount: 62607 },
]

const adSpendData = [
  { month: 'APR', amount: 300 },
  { month: 'MAY', amount: 400 },
  { month: 'JUN', amount: 300 },
  { month: 'JUL', amount: 400 },
  { month: 'AUG', amount: 300 },
  { month: 'SEP', amount: 500 },
  { month: 'OCT', amount: 400 },
  { month: 'NOV', amount: 400 },
  { month: 'DEC', amount: 400 },
  { month: 'JAN', amount: 400 },
  { month: 'FEB', amount: 400 },
  { month: 'MAR', amount: 409.97 },
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

export default function DashboardHomePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">March 2021</h2>
        <Button variant="outline" size="sm">
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Cash" value="$62,607" change="+108% MoM" changeType="positive" />
        <MetricCard title="Income" value="$28,561" change="+12% MoM" changeType="positive" />
        <MetricCard title="Gross Burn" value="$4,040" change="+119% MoM" changeType="negative" />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runway</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Profitable!</div>
            <div className="mt-4 h-3 w-full rounded-full bg-gray-200">
              <div className="h-3 rounded-full bg-green-500" style={{ width: '100%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer config={{ cash: { label: 'Cash', color: 'hsl(var(--chart-1))' } }}>
                <LineChart data={cashData}>
                  <XAxis 
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    width={80}
                  />
                  <Line type="monotone" dataKey="amount" stroke="var(--color-cash)" strokeWidth={2} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advertising & Marketing</CardTitle>
            <div className="text-2xl font-bold">$409.97</div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer config={{ adSpend: { label: 'Ad Spend', color: 'hsl(var(--chart-2))' } }}>
                <BarChart data={adSpendData}>
                  <XAxis 
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    width={80}
                  />
                  <Bar dataKey="amount" fill="var(--color-adSpend)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}