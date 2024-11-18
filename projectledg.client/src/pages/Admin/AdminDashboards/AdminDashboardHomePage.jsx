import React, { useState, useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { axiosConfig } from '/axiosconfig'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from '@/components/ui/progress'
import { HelpCircle, Wallet, TrendingDown, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import ProfitabilityCard from '../AdminComps/ProfitabilityCard'
import MetricGraph from '../AdminComps/MetricGraph'
import {
  TooltipShad,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const tooltipInfo = {
  logins: "Antal Inloggningar: <br /> Det totala antalet unika inloggningar för Ledge; filtrerat på Dag/Vecka/År.",
  sum: "Totala summan av bokförda fakturor: <br /> Den totala summan av alla fakturor.",
  ingoing: "Ingående fakturor: <br /> Det totala antalet ingående fakturor som har bokförts.",
  outgoing: "Omsättning: <br /> Den totala summan pengar som genererats från försäljning av varor eller tjänster under en viss period."
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

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10))
    }, 70)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-64 space-y-4">
        <Progress value={progress} className="w-full" />
        <p className="text-center text-sm text-muted-foreground">Loading financial data...</p>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow dark:bg-gray-700">
        <p className="text-xs sm:text-sm">{`${label} : ${payload[0].value.toLocaleString()} kr`}</p>
      </div>
    );
  }
  return null;
};

const AdminDashboardHomePage = () => {
  const { userId } = useParams();
  const { isChatOpen } = useOutletContext();

  const [topGraphsData, setTopGraphsData] = useState(null);
  const [filterGraphsData, setFilterGraphsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [topMetricFilter, setTopMetricFilter] = useState('grossProfit');
  const [bottomMetricFilter, setBottomMetricFilter] = useState('operatingMargin');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentYear = new Date().getFullYear();
        const payload = { year: currentYear };
  
        const [topGraphsResponse, filterGraphsResponse] = await Promise.all([
          axiosConfig.get('/Statistics/users/logins/today', { params: payload }),
          axiosConfig.get('/Statistics/invoices/ingoing/today', { params: payload })
        ]);
  
        console.log("Top Graphs Data:", topGraphsResponse.data);
        console.log("Filter Graphs Data:", filterGraphsResponse.data);
  
        setTopGraphsData(topGraphsResponse.data);
        setFilterGraphsData(filterGraphsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [userId]);
  

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!topGraphsData || !filterGraphsData) return <div>No data available.</div>;

  const {
    revenue = { totalRevenue: 0, changePercentage: 0, revenueHistory: [] },
    profit = { totalProfit: 0, changePercentage: 0, profitHistory: [] },
    expenses = { totalExpenses: 0, changePercentage: 0, expensesHistory: [] },
    runway = null,
  } = topGraphsData;

  const metricOptions = [
    { value: 'grossProfit', label: 'Total vinst' },
    { value: 'operatingMargin', label: 'Rörelsemarginal' },
    { value: 'cashFlowAnalysis', label: 'Kassaflödesanalys' },
    { value: 'grossMargin', label: 'Bruttomarginal' },
  ];

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Översikt</h2>
      </div>
      <div className={`GRIDCONTAINER flex ${isChatOpen ? 'flex-col' : 'flex-row'}`}>
        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ${isChatOpen ? 'w-[100%] pb-4' : 'w-[50%] pr-2'}`}>
          <MetricCard
            title="Omsättning"
            value={`${revenue.totalRevenue.toLocaleString()} kr`}
            change={`${revenue.changePercentage}% MoM`}
            changeType={revenue.changePercentage >= 0 ? 'positive' : 'negative'}
            icon={Wallet}
            toolDescription={tooltipInfo.outgoing}
            chart={
              <LineChart data={revenue.revenueHistory}>
                <XAxis dataKey="monthName" tick={{ fontSize: 10 }} interval={'preserveStartEnd'} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            }
          />
          <MetricCard
            title="Vinst"
            value={`${profit.totalProfit.toLocaleString()} kr`}
            change={`${profit.changePercentage}% MoM`}
            changeType={profit.changePercentage >= 0 ? 'positive' : 'negative'}
            icon={TrendingUp}
            toolDescription={tooltipInfo.sum}
            chart={
              <BarChart data={profit.profitHistory}>
                <XAxis dataKey="monthName" tick={{ fontSize: 10 }} interval={'preserveStartEnd'} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount">
                  {profit.profitHistory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? "#10B981" : "#EF4444"} />
                  ))}
                </Bar>
              </BarChart>
            }
          />
        </div>

        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ${isChatOpen ? 'w-[100%] ' : 'w-[50%] pl-2 '}`}>
          <MetricCard
            title="Kostnader"
            value={`${expenses.totalExpenses.toLocaleString()} kr`}
            change={`${expenses.changePercentage}% MoM`}
            changeType={expenses.changePercentage <= 0 ? 'positive' : 'negative'}
            icon={TrendingDown}
            toolDescription={tooltipInfo.ingoing}
            chart={
              <BarChart data={expenses.expensesHistory}>
                <XAxis dataKey="monthName" tick={{ fontSize: 10 }} interval={'preserveStartEnd'} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount">
                  {expenses.expensesHistory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? "#10B981" : "#EF4444"} />
                  ))}
                </Bar>
              </BarChart>
            }
          />
          {runway && <ProfitabilityCard runway={runway} />}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <MetricGraph
          metricFilter={topMetricFilter}
          setMetricFilter={setTopMetricFilter}
          title=""
          metricsData={filterGraphsData}
          metricOptions={metricOptions}
        />
        <MetricGraph
          metricFilter={bottomMetricFilter}
          setMetricFilter={setBottomMetricFilter}
          title=""
          metricsData={filterGraphsData}
          metricOptions={metricOptions}
        />
      </div>
    </div>
  )
}

export default AdminDashboardHomePage
