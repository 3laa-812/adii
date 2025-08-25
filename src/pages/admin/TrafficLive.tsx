import { useState, useEffect } from 'react';
import { useI18nStore } from '@/stores/useI18nStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { 
  Search, 
  Filter, 
  Eye, 
  Flag, 
  CheckCircle, 
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Mock data for live traffic entries
const mockEntries = [
  {
    id: '1',
    timestamp: new Date(),
    deviceName: 'Gate A1',
    vehiclePlate: 'ABC-123',
    amount: 25.50,
    status: 'paid',
    paymentMethod: 'RFID',
    confidence: 0.95,
    imageUrl: '/placeholder.svg',
    isFlagged: false
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 30000),
    deviceName: 'Gate B2',
    vehiclePlate: 'XYZ-789',
    amount: 15.00,
    status: 'pending',
    paymentMethod: 'Camera',
    confidence: 0.87,
    imageUrl: '/placeholder.svg',
    isFlagged: true
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 60000),
    deviceName: 'Gate C3',
    vehiclePlate: 'DEF-456',
    amount: 35.00,
    status: 'failed',
    paymentMethod: 'RFID',
    confidence: 0.92,
    imageUrl: '/placeholder.svg',
    isFlagged: false
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 120000),
    deviceName: 'Gate A1',
    vehiclePlate: 'GHI-012',
    amount: 25.50,
    status: 'disputed',
    paymentMethod: 'Camera',
    confidence: 0.78,
    imageUrl: '/placeholder.svg',
    isFlagged: true
  }
];

export function TrafficLive() {
  const { t, isRTL } = useI18nStore();
  const [entries, setEntries] = useState(mockEntries);
  const [isLive, setIsLive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newEntry = {
        id: Math.random().toString(),
        timestamp: new Date(),
        deviceName: ['Gate A1', 'Gate B2', 'Gate C3'][Math.floor(Math.random() * 3)],
        vehiclePlate: `${String.fromCharCode(65 + Math.random() * 26)}${String.fromCharCode(65 + Math.random() * 26)}${String.fromCharCode(65 + Math.random() * 26)}-${Math.floor(100 + Math.random() * 900)}`,
        amount: Math.floor(15 + Math.random() * 30) + 0.5,
        status: ['paid', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
        paymentMethod: ['RFID', 'Camera'][Math.floor(Math.random() * 2)],
        confidence: 0.7 + Math.random() * 0.3,
        imageUrl: '/placeholder.svg',
        isFlagged: Math.random() > 0.8
      };

      setEntries(prev => [newEntry, ...prev.slice(0, 49)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.deviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesDevice = deviceFilter === 'all' || entry.deviceName === deviceFilter;
    
    return matchesSearch && matchesStatus && matchesDevice;
  });

  const handleAcknowledge = (entryId: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, acknowledged: true } : entry
    ));
  };

  const handleFlag = (entryId: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, isFlagged: !entry.isFlagged } : entry
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'default',
      pending: 'warning',
      failed: 'destructive',
      disputed: 'secondary'
    } as const;

    return <Badge variant={variants[status as keyof typeof variants]}>{t(status)}</Badge>;
  };

  return (
    <AdminLayout>
      <div className={cn("p-6 space-y-6", isRTL && "rtl")}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('traffic_live')}</h1>
            <p className="text-muted-foreground">{t('real_time_entry_monitoring')}</p>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant={isLive ? "default" : "outline"}
              onClick={() => setIsLive(!isLive)}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              {isLive ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              <span>{isLive ? t('pause') : t('resume')}</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('live_entries')}</p>
                  <p className="text-2xl font-bold">{filteredEntries.length}</p>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">{t('live')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('flagged_entries')}</p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredEntries.filter(e => e.isFlagged).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('success_rate')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((filteredEntries.filter(e => e.status === 'paid').length / filteredEntries.length) * 100)}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('avg_confidence')}</p>
                <p className="text-2xl font-bold">
                  {Math.round((filteredEntries.reduce((acc, e) => acc + e.confidence, 0) / filteredEntries.length) * 100)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Filter className="w-5 h-5" />
              <span>{t('filters')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className={cn("absolute top-3 w-4 h-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
                  <Input
                    placeholder={t('search_plate_or_device')}
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
                  <SelectItem value="paid">{t('paid')}</SelectItem>
                  <SelectItem value="pending">{t('pending')}</SelectItem>
                  <SelectItem value="failed">{t('failed')}</SelectItem>
                  <SelectItem value="disputed">{t('disputed')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('device')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all_devices')}</SelectItem>
                  <SelectItem value="Gate A1">Gate A1</SelectItem>
                  <SelectItem value="Gate B2">Gate B2</SelectItem>
                  <SelectItem value="Gate C3">Gate C3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('live_entries_stream')}</CardTitle>
            <CardDescription>{t('real_time_entry_feed')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('timestamp')}</TableHead>
                  <TableHead>{t('device')}</TableHead>
                  <TableHead>{t('vehicle_plate')}</TableHead>
                  <TableHead>{t('amount')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('method')}</TableHead>
                  <TableHead>{t('confidence')}</TableHead>
                  <TableHead>{t('image')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id} className={cn(entry.isFlagged && "bg-orange-50 dark:bg-orange-950/20")}>
                    <TableCell className="font-mono text-xs">
                      {format(entry.timestamp, 'HH:mm:ss')}
                    </TableCell>
                    <TableCell>{entry.deviceName}</TableCell>
                    <TableCell className="font-mono font-medium">{entry.vehiclePlate}</TableCell>
                    <TableCell>${entry.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          entry.confidence > 0.9 ? "bg-green-500" :
                          entry.confidence > 0.8 ? "bg-yellow-500" : "bg-red-500"
                        )} />
                        <span className="text-sm">{Math.round(entry.confidence * 100)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <img 
                              src={entry.imageUrl} 
                              alt="Vehicle" 
                              className="w-full h-40 object-cover rounded-md bg-muted"
                            />
                            <p className="text-sm text-muted-foreground">
                              {t('captured_at')} {format(entry.timestamp, 'HH:mm:ss')}
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcknowledge(entry.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlag(entry.id)}
                          className={cn(entry.isFlagged && "text-orange-600")}
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
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