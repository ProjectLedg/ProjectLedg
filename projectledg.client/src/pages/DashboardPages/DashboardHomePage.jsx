import React, { useState, useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from '@/components/ui/progress'
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
  <Card className="overflow-hidden max-h-64 dark:bg-darkSurface dark:border-0 ">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
        {Icon && <Icon className="mr-2 h-4 w-4 dark:text-darkSecondary" />}
        {title}
      </CardTitle>
      <TooltipProvider>
        <TooltipShad>
          <TooltipTrigger>
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground dark:text-darkSecondary" />
          </TooltipTrigger>
          <TooltipContent className="dark:bg-darkBackground dark:border-darkBorder  ">
            <p dangerouslySetInnerHTML={{ __html: toolDescription }} ></p>
          </TooltipContent>
        </TooltipShad>
      </TooltipProvider>
    </CardHeader>
    <CardContent>
      <div className="text-lg sm:text-2xl font-bold ">{value}</div>
      <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${changeType === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        }`}>
        {change}
      </div>
      <div className="h-[60px] sm:h-[80px] mt-4 ">
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
      <div className="bg-white p-2 border border-gray-300 rounded shadow dark:bg-darkBackground dark:border-darkBorder">
        <p className="text-xs sm:text-sm">{`${label} : ${payload[0].value.toLocaleString()} kr`}</p>
      </div>
    );
  }
  return null;
};

const DashboardHomePage = () => {
  const { companyId } = useParams();
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
        const currentYear = 2023;        //new Date().getFullYear();
        const payload = {
          companyId: parseInt(companyId),
          year: currentYear
        };
        
        const axiosConfig = axios.create({
          baseURL: 'https://projectledg.azurewebsites.net/api/',
          headers: {
            'Content-Type': 'application/json',
            // Include additional headers if needed
          },
          withCredentials: false, // Ensure this is false unless you specifically need credentials
        });

        const [topGraphsResponse, filterGraphsResponse] = await Promise.all([
          axiosConfig.post('Finance/dashboardtopgraphs', payload),
          axiosConfig.post('Finance/dashboardbottomgraphs', payload)
        ]);

        setTopGraphsData(topGraphsResponse.data);
        setFilterGraphsData(filterGraphsResponse.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!topGraphsData || !filterGraphsData) return null;

  const { revenue, profit, expenses, runway } = topGraphsData;

  const isDarkMode = document.documentElement.classList.contains('dark'); 

  const metricOptions = [
    { value: 'grossProfit', label: 'Total vinst' },
    { value: 'operatingMargin', label: 'Rörelsemarginal' },
    { value: 'cashFlowAnalysis', label: 'Kassaflödesanalys' },
    { value: 'grossMargin', label: 'Bruttomarginal' },
  ];

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight ">Översikt</h2>
      </div>
      <div className={`GRIDCONTAINER flex ${isChatOpen ? 'flex-col' : 'flex-row'}`}>
        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ${isChatOpen ? 'w-[100%] pb-4' : 'w-[50%] pr-2'}`}>

          <MetricCard
            title={
              <span style={{ color: isDarkMode ? '#b0b0b0' : '#64748b' }}>
                Omsättning
              </span>
            }
            value={`${revenue.totalRevenue.toLocaleString()} kr`}
            change={`${revenue.changePercentage}% MoM`}
            changeType={revenue.changePercentage >= 0 ? 'positive' : 'negative'}
            icon={Wallet}
            toolDescription={tooltipInfo.revenue}
            chart={
              <LineChart data={revenue.revenueHistory}>
                <XAxis
                  dataKey="monthName"
                  tick={{ fontSize: 10 }}
                  interval={'preserveStartEnd'}
                  tickLine={{ stroke: isDarkMode ? 'white' : 'grey' }}
                  axisLine={{ stroke: isDarkMode ? 'white' : 'grey' }}
                  style={{
                    fill: isDarkMode ? 'white' : 'grey', 
                  }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="amount" stroke="#10B34A" strokeWidth={2} dot={false} />
              </LineChart>
            }
          />

          <MetricCard
            title={
              <span style={{ color: isDarkMode ? '#b0b0b0' : '#64748b' }}>
                Vinst
              </span>
            }
            value={`${profit.totalProfit.toLocaleString()} kr`}
            change={`${profit.changePercentage}% MoM`}
            changeType={profit.changePercentage >= 0 ? 'positive' : 'negative'}
            icon={TrendingUp}
            toolDescription={tooltipInfo.income}
            chart={
              <BarChart data={profit.profitHistory}>
                <XAxis
                  dataKey="monthName"
                  tick={{ fontSize: 10 }}
                  interval={'preserveStartEnd'}
                  tickLine={{ stroke: isDarkMode ? 'white' : 'grey' }}
                  axisLine={{ stroke: isDarkMode ? 'white' : 'grey' }}
                  style={{
                    fill: isDarkMode ? 'white' : 'grey', 
                  }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount">
                  {profit.profitHistory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? "#10B34A" : "#EF4444"} />
                  ))}
                </Bar>
              </BarChart>
            }
          />
        </div>

        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ${isChatOpen ? 'w-[100%] ' : 'w-[50%] pl-2 '}`}>
          <MetricCard
            title={
              <span style={{ color: isDarkMode ? '#b0b0b0' : '#64748b' }}>
                Kostnader
              </span>
            }
            value={`${expenses.totalExpenses.toLocaleString()} kr`}
            change={`${expenses.changePercentage}% MoM`}
            changeType={expenses.changePercentage <= 0 ? 'positive' : 'negative'}
            icon={TrendingDown}
            toolDescription={tooltipInfo.expenses}
            chart={
              <BarChart data={expenses.expensesHistory}>
                <XAxis
                  dataKey="monthName"
                  tick={{ fontSize: 10 }}
                  interval={'preserveStartEnd'}
                  tickLine={{ stroke: isDarkMode ? 'white' : 'grey' }}
                  axisLine={{ stroke: isDarkMode ? 'white' : 'grey' }}
                  style={{
                    fill: isDarkMode ? 'white' : 'grey', // Apply white color in dark mode
                  }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} x/>
                <Bar dataKey="amount">
                  {expenses.expensesHistory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? "#10B34A" : "#EF4444"} />
                  ))}
                </Bar>
              </BarChart>
            }
          />
          {runway && <ProfitabilityCard runway={runway} />}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 ">
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

export default DashboardHomePage