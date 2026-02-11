"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/nexamart/admin-header";
import { AdminSidebar } from "@/components/nexamart/admin-sidebar";
import {
  TrendingUp,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  Target,
  MousePointer,
  UserPlus,
  UserCheck,
  MapPin,
  Chrome,
  Laptop,
  Activity,
  RefreshCw,
  ShoppingCart,
  Package,
  DollarSign,
  Repeat,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface AnalyticsData {
  stats: {
    totalUsers: string;
    pageViews: string;
    avgSessionDuration: string;
    conversionRate: string;
    bounceRate: string;
    sessions: string;
    newUsers: string;
    returningUsers: string;
    pagesPerSession: string;
    engagedSessions: string;
    avgEngagementTime: string;
    engagementRate: string;
  };
  changes: {
    users: number;
    pageViews: number;
    sessions: number;
  };
  topPages: Array<{
    path: string;
    pageViews: number;
    avgTime: string;
    bounceRate: string;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    sessions: number;
    percentage: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  geographic: {
    countries: Array<{
      country: string;
      users: number;
      sessions: number;
      percentage: number;
    }>;
    cities: Array<{
      city: string;
      users: number;
    }>;
  };
  technology: {
    browsers: Array<{
      browser: string;
      users: number;
      percentage: number;
    }>;
    operatingSystems: Array<{
      os: string;
      users: number;
      percentage: number;
    }>;
  };
  hourlyTraffic: number[];
  landingPages: Array<{
    page: string;
    sessions: number;
    bounceRate: string;
    avgDuration: string;
  }>;
  acquisitionChannels: Array<{
    channel: string;
    users: number;
    sessions: number;
    engagedSessions: number;
    percentage: number;
  }>;
  userTypes: {
    new: number;
    returning: number;
    newPercentage: number;
    returningPercentage: number;
  };
}

interface SalesAnalyticsData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalItemsSold: number;
    revenueChange: number;
    ordersChange: number;
  };
  ordersByStatus: Array<{ status: string; count: number; percentage: number }>;
  ordersByPaymentStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
    orderCount: number;
  }>;
  salesByCategory: Array<{
    category: string;
    revenue: number;
    quantity: number;
    percentage: number;
  }>;
  revenueTimeline: Array<{ date: string; revenue: number; orders: number }>;
  repeatCustomers: {
    total: number;
    percentage: number;
    avgOrdersPerCustomer: number;
  };
}

const defaultData: AnalyticsData = {
  stats: {
    totalUsers: "--",
    pageViews: "--",
    avgSessionDuration: "--",
    conversionRate: "--",
    bounceRate: "--",
    sessions: "--",
    newUsers: "--",
    returningUsers: "--",
    pagesPerSession: "--",
    engagedSessions: "--",
    avgEngagementTime: "--",
    engagementRate: "--",
  },
  changes: { users: 0, pageViews: 0, sessions: 0 },
  topPages: [],
  trafficSources: [],
  deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
  geographic: { countries: [], cities: [] },
  technology: { browsers: [], operatingSystems: [] },
  hourlyTraffic: Array(24).fill(0),
  landingPages: [],
  acquisitionChannels: [],
  userTypes: { new: 0, returning: 0, newPercentage: 0, returningPercentage: 0 },
};

const defaultSalesData: SalesAnalyticsData = {
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalItemsSold: 0,
    revenueChange: 0,
    ordersChange: 0,
  },
  ordersByStatus: [],
  ordersByPaymentStatus: [],
  topProducts: [],
  salesByCategory: [],
  revenueTimeline: [],
  repeatCustomers: { total: 0, percentage: 0, avgOrdersPerCustomer: 0 },
};

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData>(defaultData);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] =
    useState<SalesAnalyticsData>(defaultSalesData);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setData(defaultData);
      setLoading(false);
    }, 1000);
  };

  const fetchSalesAnalytics = async () => {
    setSalesLoading(true);
    setSalesError(null);
    setTimeout(() => {
      setSalesData(defaultSalesData);
      setSalesLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchAnalytics();
    fetchSalesAnalytics();
  }, [dateRange]);

  const peakHour = data.hourlyTraffic.indexOf(Math.max(...data.hourlyTraffic));
  const maxTraffic = Math.max(...data.hourlyTraffic, 1);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif text-foreground">
                Analytics
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track website performance, sales, and product interactions
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => {
                  fetchAnalytics();
                  fetchSalesAnalytics();
                }}
                disabled={loading && salesLoading}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 text-xs sm:text-sm"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading || salesLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">↻</span>
              </button>
              {/* Date Range Selector */}
              <div className="flex border border-border rounded-lg overflow-hidden">
                {(["7d", "30d", "90d"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${dateRange === range
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-muted"
                      }`}
                  >
                    {range === "7d" ? "7D" : range === "30d" ? "30D" : "90D"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {loading && salesLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Loading analytics data...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Error Banner */}
              {error && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800 text-sm">
                    {error}. Check your API configuration to see website
                    analytics data.
                  </p>
                </div>
              )}
              {/* GA Loading State */}
              {loading && !salesLoading && (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Loading website analytics...
                  </p>
                </div>
              )}

              {!loading && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard
                      icon={<Users className="w-5 h-5" />}
                      label="Total Users"
                      value={data.stats.totalUsers}
                      change={data.changes.users}
                    />
                    <StatCard
                      icon={<Eye className="w-5 h-5" />}
                      label="Page Views"
                      value={data.stats.pageViews}
                      change={data.changes.pageViews}
                    />
                    <StatCard
                      icon={<Activity className="w-5 h-5" />}
                      label="Sessions"
                      value={data.stats.sessions}
                      change={data.changes.sessions}
                    />
                    <StatCard
                      icon={<Clock className="w-5 h-5" />}
                      label="Avg Duration"
                      value={data.stats.avgSessionDuration}
                    />
                    <StatCard
                      icon={<MousePointer className="w-5 h-5" />}
                      label="Bounce Rate"
                      value={data.stats.bounceRate}
                    />
                    <StatCard
                      icon={<Target className="w-5 h-5" />}
                      label="Engagement"
                      value={data.stats.engagementRate}
                    />
                  </div>

                  {/* User Type + Engagement Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* New vs Returning Users */}
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        User Types
                      </h3>
                      <div className="flex items-center justify-center gap-8 mb-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <UserPlus className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-2xl font-bold text-foreground">
                            {data.userTypes.newPercentage}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            New Users
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {data.stats.newUsers}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <UserCheck className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-2xl font-bold text-foreground">
                            {data.userTypes.returningPercentage}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Returning
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {data.stats.returningUsers}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Metrics */}
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Engagement Metrics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Pages / Session
                          </span>
                          <span className="font-semibold">
                            {data.stats.pagesPerSession}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Engaged Sessions
                          </span>
                          <span className="font-semibold">
                            {data.stats.engagedSessions}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Avg Engagement
                          </span>
                          <span className="font-semibold">
                            {data.stats.avgEngagementTime}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Bounce Rate
                          </span>
                          <span className="font-semibold">
                            {data.stats.bounceRate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Device Breakdown */}
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-primary" />
                        Devices
                      </h3>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                {
                                  name: "Mobile",
                                  value: data.deviceBreakdown.mobile,
                                  fill: "#3b82f6",
                                },
                                {
                                  name: "Desktop",
                                  value: data.deviceBreakdown.desktop,
                                  fill: "#22c55e",
                                },
                                {
                                  name: "Tablet",
                                  value: data.deviceBreakdown.tablet,
                                  fill: "#a855f7",
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={70}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                              labelLine={false}
                            ></Pie>
                            <Tooltip
                              formatter={(value: number) => [`${value}%`, ""]}
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span className="text-sm text-muted-foreground">
                            Mobile
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary/60" />
                          <span className="text-sm text-muted-foreground">
                            Desktop
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary/30" />
                          <span className="text-sm text-muted-foreground">
                            Tablet
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Traffic by Hour */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Traffic by Hour
                      {peakHour >= 0 && (
                        <span className="text-sm text-muted-foreground font-normal ml-2">
                          Peak: {peakHour}:00
                        </span>
                      )}
                    </h3>
                    <div className="h-48 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.hourlyTraffic.map((value, hour) => ({
                            hour: `${hour}:00`,
                            users: value,
                            isPeak: hour === peakHour,
                          }))}
                          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="hsl(var(--border))"
                          />
                          <XAxis
                            dataKey="hour"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            interval={3}
                          />
                          <YAxis
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            width={30}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number) => [value, "Users"]}
                          />
                          <Bar
                            dataKey="users"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                            fillOpacity={0.8}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Pages */}
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Top Pages
                      </h3>
                      <div className="space-y-3">
                        {data.topPages.length > 0 ? (
                          data.topPages.map((page, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground truncate">
                                  {page.path}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Avg: {page.avgTime} • Bounce:{" "}
                                  {page.bounceRate}%
                                </p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="font-semibold text-foreground">
                                  {page.pageViews.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  views
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No data available
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Traffic Sources */}
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Traffic Sources
                      </h3>
                      <div className="space-y-3">
                        {data.trafficSources.length > 0 ? (
                          data.trafficSources.map((source, idx) => (
                            <div key={idx}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-foreground capitalize">
                                  {source.source}
                                </span>
                                <span className="text-muted-foreground">
                                  {source.percentage}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${source.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No data available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Countries */}
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Top Countries
                      </h3>
                      <div className="space-y-3">
                        {data.geographic.countries.length > 0 ? (
                          data.geographic.countries.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-foreground">
                                  {item.country}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-muted-foreground text-sm">
                                  {item.users.toLocaleString()} users
                                </span>
                                <span className="font-semibold w-12 text-right">
                                  {item.percentage}%
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No data available
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Cities */}
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Top Cities
                      </h3>
                      <div className="space-y-3">
                        {data.geographic.cities.length > 0 ? (
                          data.geographic.cities.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between"
                            >
                              <span className="text-foreground">
                                {item.city}
                              </span>
                              <span className="font-semibold">
                                {item.users.toLocaleString()} users
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No data available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Technology Data */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Browsers */}
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Chrome className="w-5 h-5 text-primary" />
                        Browsers
                      </h3>
                      <div className="space-y-3">
                        {data.technology.browsers.length > 0 ? (
                          data.technology.browsers.map((item, idx) => (
                            <div key={idx}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-foreground">
                                  {item.browser}
                                </span>
                                <span className="text-muted-foreground">
                                  {item.percentage}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No data available
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Operating Systems */}
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Laptop className="w-5 h-5 text-primary" />
                        Operating Systems
                      </h3>
                      <div className="space-y-3">
                        {data.technology.operatingSystems.length > 0 ? (
                          data.technology.operatingSystems.map((item, idx) => (
                            <div key={idx}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-foreground">
                                  {item.os}
                                </span>
                                <span className="text-muted-foreground">
                                  {item.percentage}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No data available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acquisition Channels */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Acquisition Channels
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-muted-foreground font-medium">
                              Channel
                            </th>
                            <th className="text-right py-2 text-muted-foreground font-medium">
                              Users
                            </th>
                            <th className="text-right py-2 text-muted-foreground font-medium">
                              Sessions
                            </th>
                            <th className="text-right py-2 text-muted-foreground font-medium">
                              Engaged
                            </th>
                            <th className="text-right py-2 text-muted-foreground font-medium">
                              %
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.acquisitionChannels.length > 0 ? (
                            data.acquisitionChannels.map((channel, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-border/50 last:border-0"
                              >
                                <td className="py-3 text-foreground">
                                  {channel.channel}
                                </td>
                                <td className="py-3 text-right">
                                  {channel.users.toLocaleString()}
                                </td>
                                <td className="py-3 text-right">
                                  {channel.sessions.toLocaleString()}
                                </td>
                                <td className="py-3 text-right">
                                  {channel.engagedSessions.toLocaleString()}
                                </td>
                                <td className="py-3 text-right font-semibold">
                                  {channel.percentage}%
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="py-4 text-center text-muted-foreground"
                              >
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Landing Pages */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Top Landing Pages
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-muted-foreground font-medium">
                              Page
                            </th>
                            <th className="text-right py-2 text-muted-foreground font-medium">
                              Sessions
                            </th>
                            <th className="text-right py-2 text-muted-foreground font-medium">
                              Bounce Rate
                            </th>
                            <th className="text-right py-2 text-muted-foreground font-medium">
                              Avg Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.landingPages.length > 0 ? (
                            data.landingPages.map((page, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-border/50 last:border-0"
                              >
                                <td className="py-3 text-foreground max-w-xs truncate">
                                  {page.page}
                                </td>
                                <td className="py-3 text-right">
                                  {page.sessions.toLocaleString()}
                                </td>
                                <td className="py-3 text-right">
                                  {page.bounceRate}%
                                </td>
                                <td className="py-3 text-right">
                                  {page.avgDuration}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="py-4 text-center text-muted-foreground"
                              >
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Sales Analytics Section */}
              <div className="col-span-2 mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Sales Analytics
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Product sales and order data from your store
                    </p>
                  </div>
                </div>

                {salesError && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-yellow-800">⚠️ {salesError}</p>
                  </div>
                )}

                {salesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-card border border-border rounded-xl p-4 animate-pulse"
                      >
                        <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Sales Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-primary" />
                          </div>
                          {salesData.summary.revenueChange !== 0 && (
                            <div
                              className={`flex items-center gap-1 text-xs ${salesData.summary.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {salesData.summary.revenueChange >= 0 ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {Math.abs(salesData.summary.revenueChange)}%
                            </div>
                          )}
                        </div>
                        <p className="text-xl font-semibold text-foreground">
                          KES {salesData.summary.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Revenue
                        </p>
                      </div>
                      <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4 text-primary" />
                          </div>
                          {salesData.summary.ordersChange !== 0 && (
                            <div
                              className={`flex items-center gap-1 text-xs ${salesData.summary.ordersChange >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {salesData.summary.ordersChange >= 0 ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {Math.abs(salesData.summary.ordersChange)}%
                            </div>
                          )}
                        </div>
                        <p className="text-xl font-semibold text-foreground">
                          {salesData.summary.totalOrders.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Orders
                        </p>
                      </div>
                      <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BarChart2 className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                        <p className="text-xl font-semibold text-foreground">
                          KES {salesData.summary.avgOrderValue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg Order Value
                        </p>
                      </div>
                      <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                        <p className="text-xl font-semibold text-foreground">
                          {salesData.summary.totalItemsSold.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Items Sold
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Top Products */}
                      <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" />
                          Top Selling Products
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-2 text-muted-foreground font-medium">
                                  Product
                                </th>
                                <th className="text-right py-2 text-muted-foreground font-medium">
                                  Qty
                                </th>
                                <th className="text-right py-2 text-muted-foreground font-medium">
                                  Revenue
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {salesData.topProducts.length > 0 ? (
                                salesData.topProducts
                                  .slice(0, 5)
                                  .map((product) => (
                                    <tr
                                      key={product.id}
                                      className="border-b border-border/50 last:border-0"
                                    >
                                      <td className="py-3 text-foreground max-w-xs truncate">
                                        {product.name}
                                      </td>
                                      <td className="py-3 text-right">
                                        {product.quantity}
                                      </td>
                                      <td className="py-3 text-right font-semibold">
                                        KES {product.revenue.toLocaleString()}
                                      </td>
                                    </tr>
                                  ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="py-4 text-center text-muted-foreground"
                                  >
                                    No sales data yet
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Sales by Category */}
                      <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <PieChartIcon className="w-5 h-5 text-primary" />
                          Sales by Routine Step
                        </h3>
                        {salesData.salesByCategory.length > 0 ? (
                          <>
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={salesData.salesByCategory.map(
                                      (cat, idx) => ({
                                        name: cat.category,
                                        value: cat.revenue,
                                        fill: [
                                          "#22c55e",
                                          "#3b82f6",
                                          "#a855f7",
                                          "#f59e0b",
                                          "#ef4444",
                                          "#06b6d4",
                                        ][idx % 6],
                                      }),
                                    )}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={65}
                                    paddingAngle={2}
                                    dataKey="value"
                                  />
                                  <Tooltip
                                    formatter={(value: number) => [
                                      `KES ${value.toLocaleString()}`,
                                      "",
                                    ]}
                                    contentStyle={{
                                      backgroundColor: "hsl(var(--card))",
                                      border: "1px solid hsl(var(--border))",
                                      borderRadius: "8px",
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {salesData.salesByCategory.map((cat, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{
                                      backgroundColor: [
                                        "#22c55e",
                                        "#3b82f6",
                                        "#a855f7",
                                        "#f59e0b",
                                        "#ef4444",
                                        "#06b6d4",
                                      ][idx % 6],
                                    }}
                                  />
                                  <span className="text-muted-foreground truncate">
                                    {cat.category}
                                  </span>
                                  <span className="text-foreground ml-auto">
                                    {cat.percentage}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No category data yet
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                      {/* Order Status */}
                      <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-primary" />
                          Order Status
                        </h3>
                        {salesData.ordersByStatus.length > 0 ? (
                          <>
                            <div className="h-32">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={salesData.ordersByStatus.map((s) => ({
                                      name: s.status,
                                      value: s.count,
                                      fill:
                                        s.status === "delivered"
                                          ? "#22c55e"
                                          : s.status === "shipped"
                                            ? "#3b82f6"
                                            : s.status === "processing"
                                              ? "#eab308"
                                              : s.status === "cancelled"
                                                ? "#ef4444"
                                                : "#6b7280",
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={25}
                                    outerRadius={45}
                                    paddingAngle={2}
                                    dataKey="value"
                                  />
                                  <Tooltip
                                    formatter={(
                                      value: number,
                                      name: string,
                                    ) => [value, name]}
                                    contentStyle={{
                                      backgroundColor: "hsl(var(--card))",
                                      border: "1px solid hsl(var(--border))",
                                      borderRadius: "8px",
                                      fontSize: "12px",
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="space-y-1 mt-2">
                              {salesData.ordersByStatus.map((status, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${status.status === "delivered"
                                        ? "bg-green-500"
                                        : status.status === "shipped"
                                          ? "bg-blue-500"
                                          : status.status === "processing"
                                            ? "bg-yellow-500"
                                            : status.status === "cancelled"
                                              ? "bg-red-500"
                                              : "bg-gray-500"
                                        }`}
                                    />
                                    <span className="text-foreground capitalize">
                                      {status.status}
                                    </span>
                                  </div>
                                  <span className="text-muted-foreground">
                                    {status.count}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No orders yet
                          </p>
                        )}
                      </div>

                      {/* Payment Status */}
                      <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-primary" />
                          Payment Status
                        </h3>
                        {salesData.ordersByPaymentStatus.length > 0 ? (
                          <>
                            <div className="h-32">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={salesData.ordersByPaymentStatus.map(
                                      (s) => ({
                                        name: s.status,
                                        value: s.count,
                                        fill:
                                          s.status === "paid"
                                            ? "#22c55e"
                                            : s.status === "pending"
                                              ? "#eab308"
                                              : s.status === "failed"
                                                ? "#ef4444"
                                                : "#6b7280",
                                      }),
                                    )}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={25}
                                    outerRadius={45}
                                    paddingAngle={2}
                                    dataKey="value"
                                  />
                                  <Tooltip
                                    formatter={(
                                      value: number,
                                      name: string,
                                    ) => [value, name]}
                                    contentStyle={{
                                      backgroundColor: "hsl(var(--card))",
                                      border: "1px solid hsl(var(--border))",
                                      borderRadius: "8px",
                                      fontSize: "12px",
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="space-y-1 mt-2">
                              {salesData.ordersByPaymentStatus.map(
                                (status, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-2 h-2 rounded-full ${status.status === "paid"
                                          ? "bg-green-500"
                                          : status.status === "pending"
                                            ? "bg-yellow-500"
                                            : status.status === "failed"
                                              ? "bg-red-500"
                                              : "bg-gray-500"
                                          }`}
                                      />
                                      <span className="text-foreground capitalize">
                                        {status.status}
                                      </span>
                                    </div>
                                    <span className="text-muted-foreground">
                                      {status.count}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No payment data yet
                          </p>
                        )}
                      </div>

                      {/* Repeat Customers */}
                      <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Repeat className="w-5 h-5 text-primary" />
                          Customer Loyalty
                        </h3>
                        <div className="space-y-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">
                              {salesData.repeatCustomers.total}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Repeat Customers
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <p className="text-lg font-semibold text-foreground">
                                {salesData.repeatCustomers.percentage}%
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Repeat Rate
                              </p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <p className="text-lg font-semibold text-foreground">
                                {salesData.repeatCustomers.avgOrdersPerCustomer.toFixed(
                                  1,
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Avg Orders/Customer
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Timeline */}
                    {salesData.revenueTimeline.length > 0 && (
                      <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Revenue Timeline
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={salesData.revenueTimeline}
                              margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="colorRevenue"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="hsl(var(--primary))"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="hsl(var(--primary))"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                                <linearGradient
                                  id="colorOrders"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#22c55e"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#22c55e"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="hsl(var(--border))"
                              />
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                  const date = new Date(value);
                                  return `${date.getDate()}/${date.getMonth() + 1}`;
                                }}
                              />
                              <YAxis
                                yAxisId="revenue"
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                width={60}
                                tickFormatter={(value) =>
                                  `${(value / 1000).toFixed(0)}K`
                                }
                              />
                              <YAxis
                                yAxisId="orders"
                                orientation="right"
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                width={30}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "8px",
                                }}
                                formatter={(value: number, name: string) => [
                                  name === "revenue"
                                    ? `KES ${value.toLocaleString()}`
                                    : value,
                                  name === "revenue" ? "Revenue" : "Orders",
                                ]}
                                labelFormatter={(label) => `Date: ${label}`}
                              />
                              <Legend />
                              <Area
                                yAxisId="revenue"
                                type="monotone"
                                dataKey="revenue"
                                stroke="hsl(var(--primary))"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                strokeWidth={2}
                                name="Revenue"
                              />
                              <Area
                                yAxisId="orders"
                                type="monotone"
                                dataKey="orders"
                                stroke="#22c55e"
                                fillOpacity={1}
                                fill="url(#colorOrders)"
                                strokeWidth={2}
                                name="Orders"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
}

function StatCard({ icon, label, value, change }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          {icon}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs ${change >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {change >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-lg sm:text-xl font-semibold text-foreground">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
