import { useEffect, useState } from 'react';
import { useI18nStore } from '@/stores/useI18nStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Activity, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

// Mock data
const mockKPIs = {
  todayEntries: 1247,
  todayRevenue: 15680.50,
  successRate: 94.2,
  unpaidEntries: 73,
  onlineDevices: 12,
  totalDevices: 15
};

const mockRevenueData = [
  { time: '00:00', revenue: 320 },
  { time: '04:00', revenue: 150 },
  { time: '08:00', revenue: 980 },
  { time: '12:00', revenue: 1240 },
  { time: '16:00', revenue: 1890 },
  { time: '20:00', revenue: 1650 },
  { time: '24:00', revenue: 720 }
];

const mockTrafficData = [
  { time: '00:00', entries: 45 },
  { time: '04:00', entries: 23 },
  { time: '08:00', entries: 156 },
  { time: '12:00', entries: 189 },
  { time: '16:00', entries: 234 },
  { time: '20:00', entries: 198 },
  { time: '24:00', entries: 87 }
];

const mockDevices = [
  { id: 1, name: 'Gate A1', location: { lat: 30.0444, lng: 31.2357 }, status: 'online' },
  { id: 2, name: 'Gate B2', location: { lat: 30.0555, lng: 31.2468 }, status: 'online' },
  { id: 3, name: 'Gate C3', location: { lat: 30.0333, lng: 31.2579 }, status: 'offline' },
  { id: 4, name: 'Gate D4', location: { lat: 30.0666, lng: 31.2690 }, status: 'maintenance' }
];

export function AdminDashboard() {
  const { t, isRTL } = useI18nStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <AdminLayout>
      <div className={cn("p-6 space-y-6", isRTL && "rtl")}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard_overview')}</h1>
            <p className="text-muted-foreground">{t('real_time_system_monitoring')}</p>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin", isRTL && "ml-2 mr-0")} />
            {t('refresh')}
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('today_entries')}</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockKPIs.todayEntries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0 text-green-500" />
                +12.5% {t('from_yesterday')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('today_revenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockKPIs.todayRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0 text-green-500" />
                +8.2% {t('from_yesterday')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('success_rate')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockKPIs.successRate}%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0 text-green-500" />
                +2.1% {t('from_yesterday')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('unpaid_entries')}</CardTitle>
              <XCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockKPIs.unpaidEntries}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingDown className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0 text-red-500" />
                -5.4% {t('from_yesterday')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('revenue_trend')}</CardTitle>
              <CardDescription>{t('hourly_revenue_breakdown')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockRevenueData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('traffic_volume')}</CardTitle>
              <CardDescription>{t('entries_per_hour')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockTrafficData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="entries" stroke="hsl(var(--secondary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Status and Map */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t('device_status')}
                <Badge variant="outline">{mockKPIs.onlineDevices}/{mockKPIs.totalDevices} {t('online')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      device.status === 'online' && "bg-green-500",
                      device.status === 'offline' && "bg-red-500",
                      device.status === 'maintenance' && "bg-yellow-500"
                    )} />
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{device.status}</p>
                    </div>
                  </div>
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('device_locations')}</CardTitle>
              <CardDescription>{t('real_time_device_map')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">{t('interactive_map_placeholder')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('maplibre_integration_required')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}