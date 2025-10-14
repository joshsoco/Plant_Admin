import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, Leaf, Clock } from "lucide-react";
import { useMotion } from "@/contexts/MotionContext";
import { PlantAPI } from "@/services/PlantBackendAPI";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#6b7280"];

export function DashboardCharts() {
  const { shouldReduceMotion } = useMotion();
  const [topPlantsChart, setTopPlantsChart] = useState<any[]>([]);
  const [flaggedPlantsChart, setFlaggedPlantsChart] = useState<any[]>([]);
  const [dailyActivityData, setDailyActivityData] = useState<any[]>([]);
  const [peakUsageData, setPeakUsageData] = useState<any[]>([]);
  const [weeklyTrendData, setWeeklyTrendData] = useState<any[]>([]);
  

  // Fetch Most Identified Plants
  useEffect(() => {
  const fetchTopPlants = async () => {
    try {
      const response = await PlantAPI.getDashboardStats();
      const data = response.data || response;

      const stats = data.stats || data.data || data;
      const mostIdentified =
        stats.mostIdentified || stats.most_identified || stats.topSearched || [];

      if (mostIdentified.length > 0) {
        const formatted = mostIdentified.map((p: any) => ({
          common_name: p.commonName || p.common_name || "Unknown",
          scientific_name: p.scientificName || p.scientific_name || "",
          count: p.searchCount || p.count || 0,
        }));
        setTopPlantsChart(formatted);
      } else {
        setTopPlantsChart([]);
      }
    } catch (error) {
      console.error("Error fetching top plants:", error);
      setTopPlantsChart([]);
    }
  };
  fetchTopPlants();
}, []);



  // Fetch Flagged Plants
  useEffect(() => {
  const fetchFlaggedPlants = async () => {
    try {
      const response = await PlantAPI.getPlantHistory();
      if (response.success && response.identifications) {
        const flaggedMap: Record<string, number> = {};

        response.identifications.forEach((plant: any) => {
          if (plant.is_correct === false) { // flagged
            flaggedMap[plant.predicted_name || 'Unknown'] =
              (flaggedMap[plant.predicted_name || 'Unknown'] || 0) + 1;
          }
        });

        const flaggedData = Object.entries(flaggedMap)
          .map(([predicted_name, flagged_count]) => ({ predicted_name, flagged_count }))
          .sort((a, b) => b.flagged_count - a.flagged_count)
          .slice(0, 5);

        setFlaggedPlantsChart(flaggedData);
      }
    } catch (err) {
      console.error('Error fetching flagged plants:', err);
      setFlaggedPlantsChart([]);
    }
  };

  fetchFlaggedPlants();
}, []);



  // Fetch Daily Activity (last 7 days)
  useEffect(() => {
  const fetchDailyActivity = async () => {
    try {
      const response = await PlantAPI.getPlantHistory();
      if (Array.isArray(response)) {
        const today = new Date();
        const dailyMap: Record<string, number> = {};
        const usersMap: Record<string, Set<number>> = {};

        // initialize last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          dailyMap[key] = 0;
          usersMap[key] = new Set();
        }

        response.forEach((plant: any) => {
          const date = new Date(plant.identified_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          if (dailyMap[date] !== undefined) {
            dailyMap[date] += 1;
            usersMap[date].add(plant.user.id); // or plant.user depending on serializer
          }
        });

        const chartData = Object.keys(dailyMap).map((date) => ({
          date,
          identifications: dailyMap[date],
          users: usersMap[date].size,
        }));

        setDailyActivityData(chartData);
      }
    } catch (err) {
      console.error("Error fetching daily activity:", err);
      setDailyActivityData([]);
    }
  };

  fetchDailyActivity();
}, []);

    //trends

    useEffect(() => {
  const fetchWeeklyTrends = async () => {
    try {
      const response = await PlantAPI.getPlantHistory();
      const history = Array.isArray(response) ? response : [];

      const today = new Date();
      const weeklyData: { week: string; identifications: number; users: number }[] = [];

      for (let i = 3; i >= 0; i--) {
        // Get Monday of the week i weeks ago
        const monday = new Date(today);
        const dayOfWeek = monday.getDay(); // 0 (Sun) - 6 (Sat)
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        monday.setDate(today.getDate() + diffToMonday - i * 7);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        const weekLabel = `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${sunday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

        const usersSet = new Set<number>();
        let identificationsCount = 0;

        history.forEach((plant: any) => {
          const created = new Date(plant.identified_at);
          if (created >= monday && created <= sunday) {
            identificationsCount += 1;
            usersSet.add(plant.user?.id);
          }
        });

        weeklyData.push({
          week: weekLabel,
          identifications: identificationsCount,
          users: usersSet.size,
        });
      }

      // <-- Log the data here
      console.log(weeklyData);

      setWeeklyTrendData(weeklyData);
    } catch (err) {
      console.error("Error fetching weekly trends:", err);
      setWeeklyTrendData([]);
    }
  };

  fetchWeeklyTrends();
}, []);
  






  // Fetch Peak Usage Times (today)
  useEffect(() => {
  const fetchPeakUsage = async () => {
    try {
      const response = await PlantAPI.getPlantHistory();
      
      // The API returns an array directly
      const history = response; 

      if (history && history.length > 0) {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Initialize hourly map
        const hourlyMap: Record<number, number> = {};
        for (let i = 0; i < 24; i++) hourlyMap[i] = 0;

        // Count identifications per hour
        history.forEach((plant: any) => {
          const created = new Date(plant.identified_at);
          if (created >= todayStart && created < todayEnd) {
            hourlyMap[created.getHours()] += 1;
          }
        });

        // Transform to chart data
        const chartData = Object.keys(hourlyMap).map((h) => {
          const hour = parseInt(h);
          const label =
            hour === 0
              ? "12 AM"
              : hour < 12
              ? `${hour} AM`
              : hour === 12
              ? "12 PM"
              : `${hour - 12} PM`;
          return { hour: label, usage: hourlyMap[hour] };
        });

        setPeakUsageData(chartData);
      } else {
        setPeakUsageData([]);
      }
    } catch (err) {
      console.error("Error fetching peak usage:", err);
      setPeakUsageData([]);
    }
  };

  fetchPeakUsage();
}, []);






  return (
    <div className="dashboard-charts grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
      {/* Daily Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Daily Activity
          </CardTitle>
          <CardDescription>Plant identifications by date</CardDescription>
        </CardHeader>
        <CardContent>
          {dailyActivityData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data available</p>
          ) : (
            <ChartContainer
              config={{
                identifications: { label: "Identifications", color: COLORS[0] },
                users: { label: "Active Users", color: COLORS[1] },
              }}
              className="h-[250px] w-full"
            >
              <AreaChart data={dailyActivityData}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="identifications"
                  stroke={COLORS[0]}
                  fill={COLORS[0] + "33"}
                  animationDuration={shouldReduceMotion ? 0 : 800}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={COLORS[1]}
                  fill={COLORS[1] + "33"}
                  animationDuration={shouldReduceMotion ? 0 : 800}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

     
      {/* Most Identified Plants */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Leaf className="h-5 w-5 text-green-600" />
      Most Identified Plants
    </CardTitle>
    <CardDescription>Top plant species identified this month</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {topPlantsChart.slice(0, 5).map((plant, index) => {
  const totalIdentifications = topPlantsChart.reduce(
    (acc, p) => acc + (p.count || 0),
    0
  );
  const percentage = totalIdentifications
    ? ((plant.count / totalIdentifications) * 100).toFixed(2)
    : 0;

  return (
    <div
      key={`${plant.common_name || "unknown"}-${index}`}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: COLORS[index % COLORS.length] }}
        />
        <span className="font-medium text-sm">
          {plant.common_name || "Unknown"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {plant.count?.toLocaleString() || 0}
        </span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
    </div>
  );
})}


    </div>
  </CardContent>
</Card>


      {/* Weekly Trends */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <TrendingUp className="h-5 w-5 text-blue-600" />
      Weekly Trends
    </CardTitle>
    <CardDescription>Plant identifications and active users per week</CardDescription>
  </CardHeader>
  <CardContent>
    {weeklyTrendData.length === 0 ? (
      <p className="text-sm text-muted-foreground">No data available</p>
    ) : (
      <ChartContainer
        config={{
          identifications: { label: "Identifications", color: COLORS[2] },
          users: { label: "Users", color: COLORS[1] },
        }}
        className="h-[250px] w-full"
      >
        <BarChart
          data={weeklyTrendData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }} // add bottom margin for rotated labels
          barGap={8}
        >
          <XAxis 
  dataKey="week" 
  axisLine={false} 
  tickLine={false} 
  interval={0} 
  tick={(props) => {
    const { x, y, payload } = props;
    return (
      <text
        x={x}
        y={y + 10} // adjust vertical position
        textAnchor="end"
        transform={`rotate(-30, ${x}, ${y + 10})`}
        fontSize={12}
      >
        {payload.value}
      </text>
    );
  }}
/>

          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          
          {/* Identifications bar */}
          <Bar
            dataKey="identifications"
            fill={COLORS[2]}
            radius={[4, 4, 0, 0]}
            isAnimationActive={!shouldReduceMotion}
          />

          {/* Users bar */}
          <Bar
            dataKey="users"
            fill={COLORS[1]}
            radius={[4, 4, 0, 0]}
            isAnimationActive={!shouldReduceMotion}
          />
        </BarChart>
      </ChartContainer>
    )}
  </CardContent>
</Card>




      {/* Peak Usage Times */}
      <Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Clock className="h-5 w-5 text-purple-600" />
      Peak Usage Times
    </CardTitle>
    <CardDescription>
      Hourly usage patterns for today (
      {new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
      )
      </CardDescription>
      </CardHeader>
      <CardContent>
    {peakUsageData.length === 0 ? (
      <p className="text-sm text-muted-foreground">No data available</p>
    ) : (
      <ChartContainer
        config={{ usage: { label: "Usage", color: COLORS[3] } }}
        className="h-[250px] w-full"
      >
        <LineChart data={peakUsageData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
        <XAxis dataKey="hour" axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="usage"
          stroke={COLORS[3]}
          strokeWidth={3}
          dot={{ r: 4 }}
          isAnimationActive={!shouldReduceMotion}
  />
          </LineChart>

      </ChartContainer>
    )}
  </CardContent>
</Card>



      {/* Most Flagged Plants */}
      <Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Leaf className="h-5 w-5 text-red-600" />
      Most Flagged Plants
    </CardTitle>
    <CardDescription>Top plant species flagged by users</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {flaggedPlantsChart.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data available</p>
      ) : (
        flaggedPlantsChart.map((plant, index) => (
          <div key={plant.predicted_name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium text-sm">{plant.predicted_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{plant.flagged_count}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </CardContent>
</Card>



    </div>
  );
}
