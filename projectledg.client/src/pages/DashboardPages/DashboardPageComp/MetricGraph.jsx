import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2 } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const MetricGraph = ({ metricFilter, setMetricFilter, title, metricsData, metricOptions }) => {
  const currentMetricData = metricsData[metricFilter] || [];

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
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="text-sm">{`${label}: ${formattedValue}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
          <BarChart2 className="mr-2 h-4 w-4" />
          {title}
        </CardTitle>
        <Select value={metricFilter} onValueChange={setMetricFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
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
            <LineChart data={currentMetricData}>
              <XAxis dataKey="monthName" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#10B981" 
                name={metricOptions.find(o => o.value === metricFilter)?.label || metricFilter} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricGraph