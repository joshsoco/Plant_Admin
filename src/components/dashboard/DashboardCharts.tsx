import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from 'recharts';
import { TrendingUp, Leaf, Clock, AlertCircle } from 'lucide-react';
import { authService } from '@/features/auth/services/authService';

export function DashboardCharts() {
  const [dailyActivityData, setDailyActivityData] = useState<any[]>([]);
  const [weeklyTrendData, setWeeklyTrendData] = useState<any[]>([]);
  const [mostIdentifiedPlants, setMostIdentifiedPlants] = useState<any[]>([]);
  const [peakUsageData, setPeakUsageData] = useState<any[]>([]);
  const [flaggedPlants, setFlaggedPlants] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = authService.getTokenData()?.accessToken;
        const res = await fetch('http://127.0.0.1:8000/api/plants/admin/identifications/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) return;

        const today = new Date();

        // -------------------- Daily Activity --------------------
        const last5Days: Date[] = [];
        for (let i = 4; i >= 0; i--) {
          const d = new Date();
          d.setDate(today.getDate() - i);
          last5Days.push(d);
        }

        const dailyMap: Record<string, { identifications: number; users: Set<string> }> = {};
        data.identifications.forEach((rec: any) => {
          const dateObj = new Date(rec.identified_at);
          const key = dateObj.toDateString();
          if (!dailyMap[key]) dailyMap[key] = { identifications: 0, users: new Set() };
          dailyMap[key].identifications += 1;
          dailyMap[key].users.add(rec.user?.username ?? 'Unknown');
        });

        setDailyActivityData(
          last5Days.map((d) => {
            const key = d.toDateString();
            return {
              dayLabel: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
              identifications: dailyMap[key]?.identifications || 0,
              users: dailyMap[key]?.users.size || 0,
            };
          })
        );

        // -------------------- Weekly Trends --------------------
        const weekMap: Record<string, { identifications: number; correct: number; users: Set<string> }> = {};
        data.identifications.forEach((rec: any) => {
          const date = new Date(rec.identified_at);
          const day = date.getDay();
          const diffToMonday = (day + 6) % 7;
          const monday = new Date(date);
          monday.setDate(date.getDate() - diffToMonday);
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          const weekKey = `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

          if (!weekMap[weekKey]) weekMap[weekKey] = { identifications: 0, correct: 0, users: new Set() };
          weekMap[weekKey].identifications += 1;
          if (rec.is_correct) weekMap[weekKey].correct += 1;
          weekMap[weekKey].users.add(rec.user?.username ?? 'Unknown');
        });

        const last3Weeks: string[] = [];
        const currentMonday = new Date(today);
        currentMonday.setDate(today.getDate() - ((currentMonday.getDay() + 6) % 7));
        for (let i = 2; i >= 0; i--) {
          const monday = new Date(currentMonday);
          monday.setDate(monday.getDate() - i * 7);
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          const weekKey = `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
          last3Weeks.push(weekKey);
          if (!weekMap[weekKey]) weekMap[weekKey] = { identifications: 0, correct: 0, users: new Set() };
        }

        setWeeklyTrendData(
          last3Weeks.map((wk) => ({
            week: wk,
            identifications: weekMap[wk].identifications,
            users: weekMap[wk].users.size,
            accuracy: weekMap[wk].identifications ? Math.round((weekMap[wk].correct / weekMap[wk].identifications) * 100) : 0,
          }))
        );

        // -------------------- Most Identified Plants --------------------
        const plantMap: Record<string, number> = {};
        data.identifications.forEach((rec: any) => {
          const name = rec.common_name || rec.scientific_name || 'Unknown';
          plantMap[name] = (plantMap[name] || 0) + 1;
        });
        const totalPlants = Object.values(plantMap).reduce((a, b) => a + b, 0);
        setMostIdentifiedPlants(
          Object.entries(plantMap)
            .map(([name, count]) => ({ name, count, percentage: Number(((count / totalPlants) * 100).toFixed(1)) }))
            .sort((a, b) => b.count - a.count)
        );

        // -------------------- Peak Usage --------------------
        const hourMap: Record<number, number> = {};
        for (let i = 0; i < 24; i++) hourMap[i] = 0; // Initialize all 24 hours
        data.identifications.forEach((rec: any) => {
          const date = new Date(rec.identified_at);
          hourMap[date.getHours()] += 1;
        });

        setPeakUsageData(
          Object.entries(hourMap).map(([hour, usage]) => {
            const h = Number(hour);
            return { hourLabel: `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'AM' : 'PM'}`, usage };
          })
        );

        // -------------------- Flagged Plants --------------------
        const flaggedMap: Record<string, number> = {};
        data.identifications
          .filter((rec: any) => rec.is_correct === false) // change to is_flagged if your backend uses that
          .forEach((rec: any) => {
            const name = rec.common_name || rec.scientific_name || 'Unknown';
            flaggedMap[name] = (flaggedMap[name] || 0) + 1;
          });
        setFlaggedPlants(
          Object.entries(flaggedMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    
    <div className="dashboard-charts grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">

      {/* most identified */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" /> Most Identified Plants
          </CardTitle>
          <CardDescription>Top plant species identified this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mostIdentifiedPlants.slice(0, 5).map((plant, index) => {
              let bgColor = 'bg-gray-200 dark:bg-gray-700';
              if (index === 0) bgColor = 'bg-yellow-400';
              else if (index === 1) bgColor = 'bg-gray-300';
              else if (index === 2) bgColor = 'bg-yellow-700';
              return (
                <div key={plant.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 flex items-center justify-center rounded-full font-semibold text-sm ${bgColor}`}>{index + 1}</div>
                    <span className="font-medium text-foreground dark:text-white text-sm">{plant.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground dark:text-gray-400">{plant.count.toLocaleString()}</span>
                    <span className="text-sm font-medium text-foreground dark:text-white">{plant.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Flagged Plants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" /> Flagged Plants
          </CardTitle>
          <CardDescription>Top 5 incorrectly identified plants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {flaggedPlants.map((plant, index) => (
              <div key={plant.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full font-semibold text-sm bg-red-400">{index + 1}</div>
                  <span className="font-medium text-foreground dark:text-white text-sm">{plant.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground dark:text-gray-400">{plant.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>



      {/* Daily Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" /> Daily Activity
          </CardTitle>
          <CardDescription>Plant identifications and active users (last 5 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              identifications: { label: 'Identifications', color: '#f59e0b' },
              users: { label: 'Active Users', color: '#3b82f6' },
            }}
            className="h-[250px] w-full"
          >
            <AreaChart data={dailyActivityData}>
              <defs>
                <linearGradient id="colorIdentifications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="dayLabel" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor' }} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="identifications" stroke="#f59e0b" strokeWidth={2} fill="url(#colorIdentifications)" />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#colorUsers)" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" /> Weekly Trends
          </CardTitle>
          <CardDescription>Identification volume and active users (last 3 weeks)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              identifications: { label: 'Identifications', color: '#f59e0b' },
              users: { label: 'Active Users', color: '#3b82f6' },
            }}
            className="h-[250px] w-full"
          >
            <BarChart data={weeklyTrendData}>
              <XAxis dataKey="week" axisLine={false} tickLine={false} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="identifications" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Most Identified Plants */}
      

      

      {/* Peak Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" /> Peak Usage Times
          </CardTitle>
          <CardDescription>Hourly usage patterns throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ usage: { label: 'Usage', color: '#f59e0b' } }} className="h-[250px] w-full">
            <AreaChart data={peakUsageData}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hourLabel" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor' }} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="usage" stroke="#f59e0b" strokeWidth={2} fill="url(#colorUsage)" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
