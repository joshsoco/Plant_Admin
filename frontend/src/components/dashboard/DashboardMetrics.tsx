import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Leaf, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  TrendingDown,
  Database,
  CheckCircle
} from "lucide-react"

export function DashboardMetrics() {
  const metrics = [
    {
      title: "Total Users",
      value: "8,247",
      change: "+12.3%",
      trend: "up",
      description: "New registrations this month",
      subtitle: "Web & Mobile combined",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      title: "Plant Identifications", 
      value: "24,891",
      change: "+18.7%",
      trend: "up",
      description: "Identifications completed today",
      subtitle: "456 today • 3,201 this week",
      icon: Leaf,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30"
    },
    {
      title: "Flagged Plants",
      value: "23", 
      change: "-8.4%",
      trend: "down",
      description: "Pending review",
      subtitle: "12 high priority • 11 medium",
      icon: AlertTriangle,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/30"
    },
    {
      title: "System Status",
      value: "99.7%",
      change: "+0.2%", 
      trend: "up",
      description: "Uptime & Performance",
      subtitle: "AI models operational",
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30"
    },
  ]

  return (
    <div className="space-y-4"> 
      
      {/* Main KPI Cards Grid */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {metrics.slice(0, 4).map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>
    </div>
  )
}

function MetricCard({ metric }: { metric: any }) {
  const Icon = metric.icon
  
  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow bg-card dark:bg-card border-border dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground dark:text-gray-300">
          {metric.title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${metric.bgColor}`}>
          <Icon className={`h-4 w-4 ${metric.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground dark:text-white">
            {metric.value}
          </div>
          <div className={`flex items-center text-xs sm:text-sm px-2 py-1 rounded-full ${
            metric.trend === "up" 
              ? "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30" 
              : "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30"
          }`}>
            {metric.trend === "up" ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {metric.change}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium text-foreground dark:text-gray-200">
            {metric.description}
          </p>
          <p className="text-xs text-muted-foreground dark:text-gray-400">
            {metric.subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}