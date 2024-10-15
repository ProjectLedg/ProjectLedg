import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Wallet, TrendingDown, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import ProfitabilityCard from './DashboardPageComp/ProfitabilityCard'

const MetricCard = ({ title, value, change, changeType, chart, icon: Icon }) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {title}
      </CardTitle>
      <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-lg sm:text-2xl font-bold">{value}</div>
      <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {change}
      </div>
      <div className="h-[60px] sm:h-[80px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {chart}
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p className="text-xs sm:text-sm">{`${label} : ${payload[0].value.toLocaleString()} kr`}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardHomePage() {
  // Get company id from url
  const {companyId} = useParams();

  const mockDashboardData = {
    currentMonth: "March 2021",
    totalCash: {
      currentValue: 62607,
      changePercentage: 108,
      history: [
        { month: "Jan", value: 40000 },
        { month: "Feb", value: 30000 },
        { month: "Mar", value: 45000 },
        { month: "Apr", value: 50000 },
        { month: "May", value: 55000 },
        { month: "Jun", value: 60000 },
        { month: "Jul", value: 62607 }
      ]
    },
    income: {
      currentValue: 28561,
      changePercentage: 12,
      history: [
        { month: "Jan", value: 20000 },
        { month: "Feb", value: 22000 },
        { month: "Mar", value: 24000 },
        { month: "Apr", value: -26000 },
        { month: "May", value: 27000 },
        { month: "Jun", value: 28000 },
        { month: "Jul", value: 28561 }
      ]
    },
    grossBurn: {
      currentValue: -4040,
      changePercentage: 119,
      history: [
        { month: "Jan", value: -2000 },
        { month: "Feb", value: -2200 },
        { month: "Mar", value: -2500 },
        { month: "Apr", value: -3000 },
        { month: "May", value: 3500 },
        { month: "Jun", value: 3800 },
        { month: "Jul", value: -4040 }
      ]
    },
    runway: {
      status: "Väldigt bra!",
      percentage: 80,
      months: 68
    }
  }

  const [dashboardData, setDashboardData] = useState(mockDashboardData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Commented out API call logic
  /*
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('http://localhost:7223/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
  }
  */


  useEffect(() => {
    console.log("Fetching financial r eports for Company ID:", companyId);
    // Add backend api fetch here
  }, [companyId])

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <h2>Financial Reports for Company {companyId}</h2>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{dashboardData.currentMonth}</h2>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Saldo" 
          value={`${dashboardData.totalCash.currentValue.toLocaleString()} kr`}
          change={`${dashboardData.totalCash.changePercentage}% MoM`}
          changeType={dashboardData.totalCash.changePercentage >= 0 ? 'positive' : 'negative'}
          icon={Wallet}
          chart={
            <LineChart data={dashboardData.totalCash.history}>
              <XAxis dataKey="month" tick={{fontSize: 10}} interval={'preserveStartEnd'} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          }
        />
        <MetricCard 
          title="Inkomst" 
          value={`${dashboardData.income.currentValue.toLocaleString()} kr`}
          change={`${dashboardData.income.changePercentage}% MoM`}
          changeType={dashboardData.income.changePercentage >= 0 ? 'positive' : 'negative'}
          icon={TrendingUp}
          chart={
            <BarChart data={dashboardData.income.history}>
              <XAxis dataKey="month" tick={{fontSize: 10}} interval={'preserveStartEnd'} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value">
                {dashboardData.income.history.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value >= 0 ? "#10B981" : "#EF4444"} />
                ))}
              </Bar>
            </BarChart>
          }
        />
        <MetricCard 
          title="Gross Burn" 
          value={`${dashboardData.grossBurn.currentValue.toLocaleString()} kr`}
          change={`${dashboardData.grossBurn.changePercentage}% MoM`}
          changeType={dashboardData.grossBurn.changePercentage <= 0 ? 'positive' : 'negative'}
          icon={TrendingDown}
          chart={
            <BarChart data={dashboardData.grossBurn.history}>
              <XAxis dataKey="month" tick={{fontSize: 10}} interval={'preserveStartEnd'} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value">
                {dashboardData.grossBurn.history.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value >= 0 ? "#10B981" : "#EF4444"} />
                ))}
              </Bar>
            </BarChart>
          }
        />
        {dashboardData.runway && <ProfitabilityCard runway={dashboardData.runway} />}
      </div>
    </div>
  )
}