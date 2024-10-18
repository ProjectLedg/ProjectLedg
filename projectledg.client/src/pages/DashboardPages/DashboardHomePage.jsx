import { useState, useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Wallet, TrendingDown, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import ProfitabilityCard from './DashboardPageComp/ProfitabilityCard'
import MetricGraph from './DashboardPageComp/MetricGraph'
import {
  TooltipShad,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const tooltipInfo = {
  income: "Inkomst: <br /> Den totala summan pengar som tjänats in under en viss period.",
  expenses: "Kostnader: <br /> Den totala summan pengar som spenderats under en viss period.",
  revenue: "Omsättning: <br /> Den totala summan pengar som genererats från försäljning av varor eller tjänster under en viss period."
}

const MetricCard = ({ title, value, change, changeType, toolDescription, chart, icon: Icon }) => (
  <Card className="overflow-hidden max-h-64">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {title}
      </CardTitle>
      <TooltipProvider>
        <TooltipShad>
          <TooltipTrigger>
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p dangerouslySetInnerHTML={{ __html: toolDescription }}></p>
          </TooltipContent>
        </TooltipShad>
      </TooltipProvider>

    </CardHeader>
    <CardContent>
      <div className="text-lg sm:text-2xl font-bold">{value}</div>
      <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
  const { companyId } = useParams();
  const { isChatOpen } = useOutletContext();

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
  const [topMetricFilter, setTopMetricFilter] = useState('revenue')
  const [bottomMetricFilter, setBottomMetricFilter] = useState('customers')

  const metricsData = {
    revenue: [
      { month: "Jan", value: 100000 },
      { month: "Feb", value: 120000 },
      { month: "Mar", value: 150000 },
      { month: "Apr", value: 180000 },
      { month: "May", value: 200000 },
      { month: "Jun", value: 220000 },
      { month: "Jul", value: 250000 },
    ],
    customers: [
      { month: "Jan", value: 1000 },
      { month: "Feb", value: 1200 },
      { month: "Mar", value: 1500 },
      { month: "Apr", value: 1800 },
      { month: "May", value: 2000 },
      { month: "Jun", value: 2200 },
      { month: "Jul", value: 2500 },
    ],
    orders: [
      { month: "Jan", value: 500 },
      { month: "Feb", value: 600 },
      { month: "Mar", value: 750 },
      { month: "Apr", value: 900 },
      { month: "May", value: 1000 },
      { month: "Jun", value: 1100 },
      { month: "Jul", value: 1250 },
    ],
    averageOrderValue: [
      { month: "Jan", value: 200 },
      { month: "Feb", value: 200 },
      { month: "Mar", value: 200 },
      { month: "Apr", value: 0 },
      { month: "May", value: -100 },
      { month: "Jun", value: -150 },
      { month: "Jul", value: -200 },
    ],
  }

  const metricOptions = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'customers', label: 'Customers' },
    { value: 'orders', label: 'Orders' },
    { value: 'averageOrderValue', label: 'Average Order Value' },
  ]

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
      <div className={`GRIDCONTAINER flex ${isChatOpen ? 'flex-col' : 'flex-row'}`}>

        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ${isChatOpen ? 'w-[100%] pb-4' : 'w-[50%] pr-2'}`}>

          <MetricCard
            title="Omsättning"
            value={`${dashboardData.totalCash.currentValue.toLocaleString()} kr`}
            change={`${dashboardData.totalCash.changePercentage}% MoM`}
            changeType={dashboardData.totalCash.changePercentage >= 0 ? 'positive' : 'negative'}
            icon={Wallet}
            toolDescription={tooltipInfo.revenue}
            chart={
              <LineChart data={dashboardData.totalCash.history}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={'preserveStartEnd'} />
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
            toolDescription={tooltipInfo.income}
            chart={
              <BarChart data={dashboardData.income.history}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={'preserveStartEnd'} />
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
        </div>

        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ${isChatOpen ? 'w-[100%] ' : 'w-[50%] pl-2 '}`}>

          <MetricCard
            title="Kostnader"
            value={`${dashboardData.grossBurn.currentValue.toLocaleString()} kr`}
            change={`${dashboardData.grossBurn.changePercentage}% MoM`}
            changeType={dashboardData.grossBurn.changePercentage <= 0 ? 'positive' : 'negative'}
            icon={TrendingDown}
            toolDescription={tooltipInfo.expenses}
            chart={
              <BarChart data={dashboardData.grossBurn.history}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={'preserveStartEnd'} />
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

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <MetricGraph
          metricFilter={topMetricFilter}
          setMetricFilter={setTopMetricFilter}
          title="Left Metric"
          metricsData={metricsData}
          metricOptions={metricOptions}
        />
        <MetricGraph
          metricFilter={bottomMetricFilter}
          setMetricFilter={setBottomMetricFilter}
          title="Right Metric"
          metricsData={metricsData}
          metricOptions={metricOptions}
        />
      </div>
    </div>
  )
}