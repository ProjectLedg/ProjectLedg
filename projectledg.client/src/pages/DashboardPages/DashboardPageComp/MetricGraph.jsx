import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2 } from 'lucide-react'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

const MetricGraph = ({ metricFilter, setMetricFilter, title, metricsData, metricOptions }) => {
  const currentMetricData = metricsData[metricFilter] || [];
  const isDarkMode = document.documentElement.classList.contains('dark');

  const formatYAxis = (value) => {
    if (metricFilter === 'operatingMargin' || metricFilter === 'grossMargin') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const formattedValue = metricFilter === 'operatingMargin' || metricFilter === 'grossMargin'
        ? `${value.toFixed(1)}%`
        : value.toLocaleString();
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow dark:bg-darkSurface">
          <p className="text-sm">{`${label}: ${formattedValue}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden dark:bg-darkSurface dark:border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
          <BarChart2 className="mr-2 h-4 w-4" />
          {title}
        </CardTitle>
        <Select value={metricFilter} onValueChange={setMetricFilter}>
          <SelectTrigger className="w-[180px] dark:bg-darkBackground dark:border-darkBorder">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent className="dark:bg-darkBackground dark:border-darkBorder">
            {metricOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentMetricData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1.2">
                  <stop offset="0%" stopColor={isDarkMode ? '#33CBE2' : '#66D466'} stopOpacity={1} />
                  <stop offset="100%" stopColor={isDarkMode ? 'transparent' : 'white'} stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="monthName"
                tickLine={{ stroke: isDarkMode ? 'white' : 'black' }}
                axisLine={{ stroke: isDarkMode ? 'white' : 'black' }}
                style={{ fill: isDarkMode ? 'white' : 'black' }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickLine={{ stroke: isDarkMode ? 'white' : 'black' }}
                axisLine={{ stroke: isDarkMode ? 'white' : 'black' }}
                style={{ fill: isDarkMode ? 'white' : 'black' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={isDarkMode ? '#33CBE2' : '#4CAF50'}
                strokeWidth={2}
                fill="url(#areaGradient)"
                name={metricOptions.find(o => o.value === metricFilter)?.label || metricFilter}
              />
            </AreaChart>

          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricGraph