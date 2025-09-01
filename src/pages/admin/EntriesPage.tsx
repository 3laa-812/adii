import { useState, useEffect } from "react";
import { useI18nStore } from "@/stores/useI18nStore";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Download, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Entry {
  id: string;
  vehicle_plate: string;
  amount: number;
  status: string;
  entry_time: string;
  device_id: string;
  confidence_score: number;
  is_flagged: boolean;
  payment_method?: string;
}

export const EntriesPage = () => {
  const { t } = useI18nStore();
  const { toast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [delayedOnly, setDelayedOnly] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, searchQuery, statusFilter, deviceFilter, flaggedOnly, delayedOnly]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("entry_time", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast({
        title: "Error",
        description: "Failed to fetch entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = entries;

    if (searchQuery) {
      filtered = filtered.filter(entry => 
        entry.vehicle_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    if (deviceFilter !== "all") {
      filtered = filtered.filter(entry => entry.device_id === deviceFilter);
    }

    if (flaggedOnly) {
      filtered = filtered.filter(entry => entry.is_flagged);
    }

    if (delayedOnly) {
      const now = new Date();
      filtered = filtered.filter(entry => {
        const entryTime = new Date(entry.entry_time);
        return (now.getTime() - entryTime.getTime()) > (30 * 60 * 1000); // 30 minutes
      });
    }

    setFilteredEntries(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ["ID", "Vehicle Plate", "Amount", "Status", "Entry Time", "Device ID", "Confidence", "Flagged"],
      ...filteredEntries.map(entry => [
        entry.id,
        entry.vehicle_plate,
        entry.amount,
        entry.status,
        entry.entry_time,
        entry.device_id,
        entry.confidence_score,
        entry.is_flagged ? "Yes" : "No"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `entries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    toast({
      title: "Export Successful",
      description: "Entries exported to CSV file",
    });
  };

  const handleBulkResolve = async () => {
    if (selectedEntries.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select entries to resolve",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("entries")
        .update({ status: "resolved" })
        .in("id", selectedEntries);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${selectedEntries.length} entries resolved`,
      });

      setSelectedEntries([]);
      fetchEntries();
    } catch (error) {
      console.error("Error resolving entries:", error);
      toast({
        title: "Error",
        description: "Failed to resolve entries",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      completed: "default",
      failed: "destructive",
      resolved: "outline"
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
          <div className="text-muted-foreground">Loading entries...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Entries Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage toll road entries with advanced filtering and bulk operations
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search by plate or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Devices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="device-1">Device 1</SelectItem>
                  <SelectItem value="device-2">Device 2</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flagged"
                    checked={flaggedOnly}
                    onCheckedChange={(checked) => setFlaggedOnly(checked === true)}
                  />
                  <label htmlFor="flagged" className="text-sm">Flagged Only</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="delayed"
                    checked={delayedOnly}
                    onCheckedChange={(checked) => setDelayedOnly(checked === true)}
                  />
                <label htmlFor="delayed" className="text-sm">Delayed Only</label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {selectedEntries.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedEntries.length} entries selected
                </span>
                <Button onClick={handleBulkResolve} size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Bulk Resolve
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Entries ({filteredEntries.length})</CardTitle>
            <CardDescription>
              Recent toll road entries with filtering and management options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedEntries.length === filteredEntries.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEntries(filteredEntries.map(e => e.id));
                        } else {
                          setSelectedEntries([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Entry Time</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEntries.includes(entry.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEntries([...selectedEntries, entry.id]);
                          } else {
                            setSelectedEntries(selectedEntries.filter(id => id !== entry.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{entry.vehicle_plate}</TableCell>
                    <TableCell>{entry.amount} EGP</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell>{new Date(entry.entry_time).toLocaleString()}</TableCell>
                    <TableCell>{entry.device_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{(entry.confidence_score * 100).toFixed(1)}%</span>
                        {entry.confidence_score < 0.8 && (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {entry.is_flagged && (
                          <Badge variant="destructive" className="text-xs">
                            Flagged
                          </Badge>
                        )}
                        {(() => {
                          const entryTime = new Date(entry.entry_time);
                          const now = new Date();
                          const isDelayed = (now.getTime() - entryTime.getTime()) > (30 * 60 * 1000);
                          return isDelayed && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Delayed
                            </Badge>
                          );
                        })()}
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
};