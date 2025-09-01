import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, Calendar, Clock, Send, Settings, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportSchedule {
  id: string;
  name: string;
  type: 'summary' | 'transactions' | 'revenue' | 'devices';
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  enabled: boolean;
  last_generated?: string;
  recipients: string[];
  parameters: any;
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generated_at: string;
  file_size: string;
  download_url: string;
  status: 'generating' | 'ready' | 'failed';
}

export const ReportsPage = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ReportSchedule[]>([]);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    type: "summary" as const,
    frequency: "daily" as const,
    time: "09:00",
    enabled: true,
    recipients: "",
    parameters: "{}"
  });

  // Manual generation states
  const [manualType, setManualType] = useState("summary");
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mock data since these tables don't exist yet
      const mockSchedules: ReportSchedule[] = [
        {
          id: "1",
          name: "Daily Revenue Summary",
          type: "summary",
          frequency: "daily",
          time: "09:00",
          enabled: true,
          last_generated: "2024-01-20T09:00:00Z",
          recipients: ["admin@example.com", "finance@example.com"],
          parameters: { include_devices: true }
        },
        {
          id: "2",
          name: "Weekly Transaction Report",
          type: "transactions",
          frequency: "weekly",
          time: "08:00",
          enabled: true,
          last_generated: "2024-01-15T08:00:00Z",
          recipients: ["admin@example.com"],
          parameters: { detailed: true }
        },
        {
          id: "3",
          name: "Monthly Device Status",
          type: "devices",
          frequency: "monthly",
          time: "07:00",
          enabled: false,
          recipients: ["tech@example.com"],
          parameters: { include_logs: false }
        }
      ];

      const mockReports: GeneratedReport[] = [
        {
          id: "r1",
          name: "Daily Summary - 2024-01-20",
          type: "summary",
          generated_at: "2024-01-20T09:00:00Z",
          file_size: "1.2 MB",
          download_url: "#",
          status: "ready"
        },
        {
          id: "r2",
          name: "Transaction Report - Week 3",
          type: "transactions",
          generated_at: "2024-01-15T08:00:00Z",
          file_size: "856 KB",
          download_url: "#",
          status: "ready"
        },
        {
          id: "r3",
          name: "Revenue Analysis - January",
          type: "revenue",
          generated_at: "2024-01-19T14:30:00Z",
          file_size: "2.1 MB",
          download_url: "#",
          status: "generating"
        }
      ];

      setSchedules(mockSchedules);
      setReports(mockReports);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reports data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const scheduleData: Omit<ReportSchedule, 'id'> = {
      name: formData.name,
      type: formData.type,
      frequency: formData.frequency,
      time: formData.time,
      enabled: formData.enabled,
      recipients: formData.recipients.split(',').map(email => email.trim()),
      parameters: JSON.parse(formData.parameters || '{}')
    };

    try {
      // Mock creation
      const newSchedule: ReportSchedule = {
        id: Date.now().toString(),
        ...scheduleData
      };

      setSchedules([...schedules, newSchedule]);

      toast({
        title: "Success",
        description: "Report schedule created successfully",
      });

      resetForm();
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast({
        title: "Error",
        description: "Failed to create report schedule",
        variant: "destructive",
      });
    }
  };

  const handleToggleSchedule = async (id: string, enabled: boolean) => {
    try {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === id ? { ...schedule, enabled } : schedule
      ));

      toast({
        title: "Success",
        description: `Report schedule ${enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error("Error toggling schedule:", error);
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive",
      });
    }
  };

  const handleGenerateManual = async () => {
    try {
      const reportName = `${manualType} Report - ${dateFrom} to ${dateTo}`;
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        name: reportName,
        type: manualType,
        generated_at: new Date().toISOString(),
        file_size: "Generating...",
        download_url: "#",
        status: "generating"
      };

      setReports([newReport, ...reports]);

      // Simulate generation
      setTimeout(() => {
        setReports(prev => prev.map(report => 
          report.id === newReport.id 
            ? { ...report, status: "ready" as const, file_size: "1.5 MB" }
            : report
        ));
        
        toast({
          title: "Report Generated",
          description: `${reportName} is ready for download`,
        });
      }, 3000);

      toast({
        title: "Generation Started",
        description: "Report is being generated...",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (report: GeneratedReport) => {
    // Mock download
    toast({
      title: "Download Started",
      description: `Downloading ${report.name}`,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "summary",
      frequency: "daily",
      time: "09:00",
      enabled: true,
      recipients: "",
      parameters: "{}"
    });
    setIsCreateOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'summary':
        return <BarChart3 className="h-4 w-4" />;
      case 'transactions':
        return <FileText className="h-4 w-4" />;
      case 'revenue':
        return <BarChart3 className="h-4 w-4" />;
      case 'devices':
        return <Settings className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      generating: "secondary",
      ready: "default",
      failed: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading reports...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Schedule automated reports and generate custom analytics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Manual Report Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate Report
              </CardTitle>
              <CardDescription>
                Generate custom reports on demand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="manual_type">Report Type</Label>
                <Select value={manualType} onValueChange={setManualType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Daily Summary</SelectItem>
                    <SelectItem value="transactions">Transactions</SelectItem>
                    <SelectItem value="revenue">Revenue Analysis</SelectItem>
                    <SelectItem value="devices">Device Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date_from">From</Label>
                  <Input
                    id="date_from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="date_to">To</Label>
                  <Input
                    id="date_to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleGenerateManual} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Scheduled Reports */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Scheduled Reports
                  </CardTitle>
                  <CardDescription>
                    Automated report generation schedules
                  </CardDescription>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Report</DialogTitle>
                      <DialogDescription>
                        Create automated report generation schedule
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSchedule} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Report Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select 
                            value={formData.type} 
                            onValueChange={(value: any) => setFormData({...formData, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="summary">Summary</SelectItem>
                              <SelectItem value="transactions">Transactions</SelectItem>
                              <SelectItem value="revenue">Revenue</SelectItem>
                              <SelectItem value="devices">Devices</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="frequency">Frequency</Label>
                          <Select 
                            value={formData.frequency} 
                            onValueChange={(value: any) => setFormData({...formData, frequency: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="time">Generation Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="recipients">Email Recipients (comma-separated)</Label>
                        <Input
                          id="recipients"
                          placeholder="admin@example.com, finance@example.com"
                          value={formData.recipients}
                          onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enabled"
                          checked={formData.enabled}
                          onCheckedChange={(checked) => setFormData({...formData, enabled: checked})}
                        />
                        <Label htmlFor="enabled">Enabled</Label>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button type="submit">Create Schedule</Button>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Generated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(schedule.type)}
                          <span className="capitalize">{schedule.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{schedule.frequency}</TableCell>
                      <TableCell>{schedule.time}</TableCell>
                      <TableCell>
                        <Badge variant={schedule.enabled ? 'default' : 'secondary'}>
                          {schedule.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {schedule.last_generated ? 
                          new Date(schedule.last_generated).toLocaleString() : 
                          'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={schedule.enabled}
                          onCheckedChange={(checked) => handleToggleSchedule(schedule.id, checked)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Download Center */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Center
            </CardTitle>
            <CardDescription>
              Recently generated reports ready for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(report.type)}
                        <span className="capitalize">{report.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(report.generated_at).toLocaleString()}</TableCell>
                    <TableCell>{report.file_size}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={report.status !== 'ready'}
                        onClick={() => handleDownload(report)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
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
};