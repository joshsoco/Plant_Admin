import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { TrendingUp, Users, Leaf, Clock } from 'lucide-react';

// Mock data for plant identification analytics
const dailyActivityData = [
  { day: 'Mon', identifications: 1200, users: 450 },
  { day: 'Tue', identifications: 1450, users: 520 },
  { day: 'Wed', identifications: 1650, users: 580 },
  { day: 'Thu', identifications: 1380, users: 490 },
  { day: 'Fri', identifications: 1820, users: 640 },
  { day: 'Sat', identifications: 2100, users: 720 },
  { day: 'Sun', identifications: 1900, users: 680 }
];

const weeklyTrendData = [
  { week: 'Week 1', identifications: 8500, accuracy: 94.2 },
  { week: 'Week 2', identifications: 9200, accuracy: 94.8 },
  { week: 'Week 3', identifications: 10100, accuracy: 95.1 },
  { week: 'Week 4', identifications: 11300, accuracy: 95.6 }
];

const mostIdentifiedPlants = [
  { name: 'Monstera', count: 2847, percentage: 18.5 },
  { name: 'Snake Plant', count: 2156, percentage: 14.0 },
  { name: 'Pothos', count: 1923, percentage: 12.5 },
  { name: 'Fiddle Leaf', count: 1634, percentage: 10.6 },
  { name: 'Rubber Plant', count: 1201, percentage: 7.8 },
  { name: 'Others', count: 5639, percentage: 36.6 }
];

const peakUsageData = [
  { hour: '6 AM', usage: 12 },
  { hour: '8 AM', usage: 45 },
  { hour: '10 AM', usage: 78 },
  { hour: '12 PM', usage: 125 },
  { hour: '2 PM', usage: 156 },
  { hour: '4 PM', usage: 134 },
  { hour: '6 PM', usage: 98 },
  { hour: '8 PM', usage: 67 },
  { hour: '10 PM', usage: 34 }
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];

export function DashboardCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {/* Daily Activity Chart */}
      <Card className="bg-card dark:bg-card border-border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            Daily Activity
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-300">
            Plant identifications and active users this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              identifications: {
                label: "Identifications",
                color: "hsl(var(--primary))",
              },
              users: {
                label: "Active Users",
                color: "hsl(var(--secondary))",
              },
            }}
            className="h-[200px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyActivityData}>
                <defs>
                  <linearGradient id="colorIdentifications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="identifications"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorIdentifications)"
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Most Identified Plants */}
      <Card className="bg-card dark:bg-card border-border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
            Most Identified Plants
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-300">
            Top plant species identified this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mostIdentifiedPlants.slice(0, 5).map((plant, index) => (
              <div key={plant.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="font-medium text-foreground dark:text-white text-sm">
                    {plant.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground dark:text-gray-400">
                    {plant.count.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-foreground dark:text-white">
                    {plant.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card className="bg-card dark:bg-card border-border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Weekly Trends
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-300">
            Identification volume and accuracy trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              identifications: {
                label: "Identifications",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[200px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrendData}>
                <XAxis 
                  dataKey="week" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="identifications"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                  animationDuration={600}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Peak Usage Times */}
      <Card className="bg-card dark:bg-card border-border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Peak Usage Times
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-300">
            Hourly usage patterns throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              usage: {
                label: "Usage",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[200px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakUsageData}>
                <XAxis 
                  dataKey="hour" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}