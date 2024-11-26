import React, { useState, useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { axiosConfig } from '/axiosconfig'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from '@/components/ui/progress'
import { HelpCircle, Wallet, TrendingDown, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import ProfitabilityCard from './DashboardPageComp/ProfitabilityCard'
import MetricGraph from './DashboardPageComp/MetricGraph'
import { Skeleton } from "@/components/ui/skeleton"

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
    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 pt-7 px-4">
      <div className=" titleContainer flex flex-row gap-1 items-center">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground dark:text-darkSecondary" />}
      </div>
      <TooltipProvider>
        <TooltipShad>
          {/* Hide on mobile as it doesn't work */}
          <TooltipTrigger className="hidden lg:block">
            <HelpCircle className="ml-2 h-4 w-4 text-muted-foreground dark:text-darkSecondary" />
          </TooltipTrigger>
          <TooltipContent className="dark:bg-darkBackground dark:border-darkBorder  ">
            <p dangerouslySetInnerHTML={{ __html: toolDescription }} ></p>
          </TooltipContent>
        </TooltipShad>
      </TooltipProvider>
    </CardHeader>
    <CardContent className="sm:pt-2">
      <div className="text-lg sm:text-2xl font-bold ">{value}</div>
      <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${changeType === 'positive' ? 'bg-green-100 text-green-800 dark:bg-darkPositive dark:text-white' : 'bg-red-100 text-red-800 dark:bg-darkNegative dark:text-white'
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

const SkeletonLoader = () => {


  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Översikt</h2>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-56 w-full">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[140px] dark:bg-darkSecondary" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[100px] mb-1 dark:bg-darkSecondary" />
              <Skeleton className="h-4 w-[60px] dark:bg-darkSecondary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 ">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="h-[37vh] w-full">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[140px] dark:bg-darkSecondary" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[100px] mb-1 dark:bg-darkSecondary" />
              <Skeleton className="h-4 w-[60px] dark:bg-darkSecondary" />
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};

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

        // Unecessary as this is why we use axios config //Adrian
        // const axiosConfig = axios.create({
        //   baseURL: 'https://projectledgserver.azurewebsites.net/api',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     // Include additional headers if needed
        //   },
        //   withCredentials: false, // Ensure this is false unless you specifically need credentials
        // });

        const [topGraphsResponse, filterGraphsResponse] = await Promise.all([
          axiosConfig.post('/Finance/dashboardtopgraphs', payload),
          axiosConfig.post('/Finance/dashboardbottomgraphs', payload)
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

  if (isLoading) return <SkeletonLoader />;
  if (error) return <SkeletonLoader />;
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
    <div className="space-y-4 p-4 ">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight ">Översikt</h2>
      </div>
      <div className={`GRIDCONTAINER flex ${isChatOpen ? 'flex-col' : 'flex-row'}`}>
        <div className={`md:grid gap-4 space-y-4 md:space-y-0 sm:grid-cols-2 lg:grid-cols-4  w-full `}>

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
                <Line type="monotone" dataKey="amount" stroke={isDarkMode ? '#00B8D9' : '#4CAF50'} strokeWidth={2} dot={false} />
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
                    <Cell
                      key={`cell-${index}`}
                      fill={isDarkMode
                        ? (entry.amount >= 0 ? "#00B8D9" : "#FF6F00") // Dark mode colors
                        : (entry.amount >= 0 ? "#4CAF50" : "#F44336") // Light mode colors
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            }
          />
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
                <Tooltip content={<CustomTooltip />} x />
                <Bar dataKey="amount">
                  {profit.profitHistory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={isDarkMode
                        ? (entry.amount >= 0 ? "#00B8D9" : "#FF6F00") // Dark mode colors
                        : (entry.amount >= 0 ? "#4CAF50" : "#F44336") // Light mode colors
                      }
                    />
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
