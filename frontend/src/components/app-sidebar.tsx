import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  AlertTriangle,
  Search,
  ScanEye,
  BookOpen,
  Bot,
  Database,
  Leaf,
  Info,
  Map,
  BarChart3,
  Send,
  CircleQuestionMark,
  CircleGauge, 
  Proportions,
  MessageSquare,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: CircleGauge,
      },
      {
        title: "Plant Identifications",
        url: "/dashboard/identifications",
        icon: Search,
        items: [
          {
            title: "Recent Activity",
            url: "/dashboard/identifications/recent",
          },
          {
            title: "Most Popular",
            url: "/dashboard/identifications/popular",
          },
          {
            title: "Search History",
            url: "/dashboard/identifications/search",
          },
        ],
      },
      {
        title: "Content Moderation",
        url: "/dashboard/moderation",
        icon: ScanEye,
        items: [
          {
            title: "Flagged Plants",
            url: "/dashboard/moderation/flagged",
          },
          {
            title: "User Reports",
            url: "/dashboard/moderation/reports",
          },
          {
            title: "Review Queue",
            url: "/dashboard/moderation/queue",
          },
        ],
      },
      {
        title: "AI Management",
        url: "/dashboard/ai",
        icon: Bot,
        items: [
          {
            title: "LLM Performance",
            url: "/dashboard/ai/performance",
          },
          {
            title: "Model Outputs",
            url: "/dashboard/ai/outputs",
          },
          {
            title: "Training Data",
            url: "/dashboard/ai/training",
          },
        ],
      },
      {
        title: "System Management",
        url: "/dashboard/system",
        icon: Database,
        items: [
          {
            title: "Cache Status",
            url: "/dashboard/system/cache",
          },
          {
            title: "System Logs",
            url: "/dashboard/system/logs",
          },
          {
            title: "Performance",
            url: "/dashboard/system/performance",
          },
        ],
      },
      {
        title: "Analytics - Plants",
        url: "/dashboard/analytics-plants",
        icon: BarChart3,
      },
    ],
    projects: [
      {
        name: "Plant Database",
        url: "/dashboard/database", 
        icon: BookOpen,
      },
      {
        name: "Reports",
        url: "/dashboard/reports", 
        icon: Proportions,
      },
    ],
    navSecondary: [
      {
        title: "Help",
        url: "/dashboard/help",
        icon: CircleQuestionMark,
      },
      {
        title: "About", 
        url: "/dashboard/about",
        icon: Info,
      },
    ],
  }
  return (
    <Sidebar variant="inset" className="sidebar" {...props}>
      <SidebarHeader>
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Leaf  className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-sidebar-foreground dark:text-white">Plant-Identifier</span>
                  <span className="truncate text-xs text-muted-foreground dark:text-gray-400">Admin Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
