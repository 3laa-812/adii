import { useState } from 'react';
import { useI18nStore } from '@/stores/useI18nStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  RefreshCw, 
  Power, 
  MessageSquare,
  Download,
  Settings,
  MapPin,
  Wifi,
  Battery,
  Cpu,
  Thermometer,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Mock device data
const mockDevices = [
  {
    id: '1',
    name: 'Gate A1 - Main Entrance',
    deviceId: 'GATE_A1_001',
    location: { lat: 30.0444, lng: 31.2357, address: 'Cairo Main Highway, Gate A1' },
    status: 'online',
    firmwareVersion: '2.1.4',
    lastSeen: new Date(Date.now() - 1000 * 60 * 2),
    batteryLevel: 85,
    signalStrength: 92,
    cpuUsage: 45.2,
    memoryUsage: 68.7,
    temperature: 42.5,
    totalEntries: 1247,
    todayRevenue: 15680.50
  },
  {
    id: '2',
    name: 'Gate B2 - Service Road',
    deviceId: 'GATE_B2_002',
    location: { lat: 30.0555, lng: 31.2468, address: 'Service Road Exit, Gate B2' },
    status: 'online',
    firmwareVersion: '2.1.4',
    lastSeen: new Date(Date.now() - 1000 * 60 * 5),
    batteryLevel: 92,
    signalStrength: 87,
    cpuUsage: 32.1,
    memoryUsage: 54.3,
    temperature: 38.2,
    totalEntries: 892,
    todayRevenue: 11240.75
  },
  {
    id: '3',
    name: 'Gate C3 - Emergency Exit',
    deviceId: 'GATE_C3_003',
    location: { lat: 30.0333, lng: 31.2579, address: 'Emergency Route, Gate C3' },
    status: 'offline',
    firmwareVersion: '2.1.2',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
    batteryLevel: 23,
    signalStrength: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    temperature: null,
    totalEntries: 145,
    todayRevenue: 1825.00
  },
  {
    id: '4',
    name: 'Gate D4 - Truck Route',
    deviceId: 'GATE_D4_004',
    location: { lat: 30.0666, lng: 31.2690, address: 'Heavy Vehicle Lane, Gate D4' },
    status: 'maintenance',
    firmwareVersion: '2.0.8',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    batteryLevel: 78,
    signalStrength: 95,
    cpuUsage: 15.7,
    memoryUsage: 42.1,
    temperature: 35.8,
    totalEntries: 2156,
    todayRevenue: 32480.25
  }
];

export function DevicesPage() {
  const { t, isRTL } = useI18nStore();
  const navigate = useNavigate();
  const [devices, setDevices] = useState(mockDevices);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSelectAll = () => {
    setSelectedDevices(
      selectedDevices.length === filteredDevices.length 
        ? [] 
        : filteredDevices.map(d => d.id)
    );
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedDevices.length === 0) return;

    // Simulate API call
    console.log(`Performing ${bulkAction} on devices:`, selectedDevices);
    if (bulkMessage) {
      console.log('Message:', bulkMessage);
    }

    // Reset selections
    setSelectedDevices([]);
    setBulkAction('');
    setBulkMessage('');
  };

  const handleDeviceAction = async (deviceId: string, action: string) => {
    console.log(`Performing ${action} on device:`, deviceId);
    
    if (action === 'reboot') {
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, status: 'rebooting' as any } : d
      ));
      
      // Simulate reboot process
      setTimeout(() => {
        setDevices(prev => prev.map(d => 
          d.id === deviceId ? { ...d, status: 'online', lastSeen: new Date() } : d
        ));
      }, 5000);
    }
  };

  const exportToCSV = () => {
    const csvData = filteredDevices.map(device => ({
      name: device.name,
      deviceId: device.deviceId,
      status: device.status,
      firmwareVersion: device.firmwareVersion,
      lastSeen: device.lastSeen.toISOString(),
      batteryLevel: device.batteryLevel,
      signalStrength: device.signalStrength,
      location: device.location.address,
      totalEntries: device.totalEntries,
      todayRevenue: device.todayRevenue
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devices_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: 'default',
      offline: 'destructive',
      maintenance: 'warning',
      rebooting: 'secondary'
    } as const;

    return <Badge variant={variants[status as keyof typeof variants]}>{t(status)}</Badge>;
  };

  const getSignalIcon = (strength: number) => {
    if (strength === 0) return <Wifi className="w-4 h-4 text-red-500" />;
    if (strength < 30) return <Wifi className="w-4 h-4 text-orange-500" />;
    if (strength < 70) return <Wifi className="w-4 h-4 text-yellow-500" />;
    return <Wifi className="w-4 h-4 text-green-500" />;
  };

  const getBatteryColor = (level: number) => {
    if (level < 20) return 'text-red-500';
    if (level < 50) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <AdminLayout>
      <div className={cn("p-6 space-y-6", isRTL && "rtl")}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('devices')}</h1>
            <p className="text-muted-foreground">{t('manage_toll_gate_devices')}</p>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
              {t('export_csv')}
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  {t('add_device')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('create_new_device')}</DialogTitle>
                  <DialogDescription>{t('provision_new_toll_gate_device')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deviceName">{t('device_name')}</Label>
                    <Input id="deviceName" placeholder={t('enter_device_name')} />
                  </div>
                  <div>
                    <Label htmlFor="location">{t('location')}</Label>
                    <Input id="location" placeholder={t('enter_location_address')} />
                  </div>
                  <div>
                    <Label htmlFor="provisioningSecret">{t('provisioning_secret')}</Label>
                    <Input 
                      id="provisioningSecret" 
                      placeholder={t('auto_generated')}
                      value={`PROV_${Math.random().toString(36).substr(2, 12).toUpperCase()}`}
                      readOnly
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={() => setShowCreateDialog(false)}>
                    {t('create_device')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('total_devices')}</p>
                  <p className="text-2xl font-bold">{devices.length}</p>
                </div>
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('online_devices')}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {devices.filter(d => d.status === 'online').length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('offline_devices')}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {devices.filter(d => d.status === 'offline').length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('maintenance')}</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {devices.filter(d => d.status === 'maintenance').length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Bulk Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Filter className="w-5 h-5" />
              <span>{t('filters_and_actions')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className={cn("absolute top-3 w-4 h-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
                  <Input
                    placeholder={t('search_devices')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(isRTL ? "pr-10" : "pl-10")}
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all_statuses')}</SelectItem>
                  <SelectItem value="online">{t('online')}</SelectItem>
                  <SelectItem value="offline">{t('offline')}</SelectItem>
                  <SelectItem value="maintenance">{t('maintenance')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedDevices.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedDevices.length} {t('devices_selected')}
                </span>
                
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('bulk_action')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reboot">{t('reboot')}</SelectItem>
                    <SelectItem value="maintenance">{t('maintenance_mode')}</SelectItem>
                    <SelectItem value="message">{t('send_message')}</SelectItem>
                    <SelectItem value="update">{t('firmware_update')}</SelectItem>
                  </SelectContent>
                </Select>

                {bulkAction === 'message' && (
                  <Input
                    placeholder={t('enter_message')}
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                    className="flex-1"
                  />
                )}

                <Button onClick={handleBulkAction} disabled={!bulkAction}>
                  {t('execute')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Devices Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('device_list')}</CardTitle>
            <CardDescription>{t('monitor_and_manage_devices')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedDevices.length === filteredDevices.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>{t('device')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('location')}</TableHead>
                  <TableHead>{t('last_seen')}</TableHead>
                  <TableHead>{t('firmware')}</TableHead>
                  <TableHead>{t('battery')}</TableHead>
                  <TableHead>{t('signal')}</TableHead>
                  <TableHead>{t('performance')}</TableHead>
                  <TableHead>{t('revenue')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDevices.includes(device.id)}
                        onCheckedChange={() => handleSelectDevice(device.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{device.deviceId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(device.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{device.location.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {format(device.lastSeen, 'MMM dd, HH:mm')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{device.firmwareVersion}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Battery className={cn("w-4 h-4", getBatteryColor(device.batteryLevel))} />
                        <span className="text-sm">{device.batteryLevel}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {getSignalIcon(device.signalStrength)}
                        <span className="text-sm">{device.signalStrength}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs">
                          <Cpu className="w-3 h-3" />
                          <span>CPU: {device.cpuUsage}%</span>
                        </div>
                        {device.temperature && (
                          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs">
                            <Thermometer className="w-3 h-3" />
                            <span>{device.temperature}°C</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">${device.todayRevenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{device.totalEntries} {t('entries')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/devices/${device.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeviceAction(device.id, 'reboot')}
                          disabled={device.status === 'offline'}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}