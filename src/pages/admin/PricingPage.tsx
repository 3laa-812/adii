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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Calculator, Clock, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FeeRule {
  id: string;
  name: string;
  rule_type: 'flat' | 'time_of_day' | 'vehicle_type';
  base_amount: number;
  vehicle_type?: string;
  time_conditions?: any;
  is_active: boolean;
  priority: number;
  valid_from: string;
  valid_until?: string;
}

interface SimulationResult {
  vehicle_type: string;
  plate_number: string;
  entry_time: string;
  calculated_fee: number;
  applied_rules: string[];
}

export const PricingPage = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<FeeRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<FeeRule | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    rule_type: "flat" as 'flat' | 'time_of_day' | 'vehicle_type',
    base_amount: "",
    vehicle_type: "",
    time_conditions: "",
    is_active: true,
    priority: "0",
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: ""
  });

  // Simulation states
  const [simVehicleType, setSimVehicleType] = useState("car");
  const [simPlateNumber, setSimPlateNumber] = useState("ABC 123");
  const [simEntryTime, setSimEntryTime] = useState(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    fetchFeeRules();
  }, []);

  const fetchFeeRules = async () => {
    try {
      const { data, error } = await supabase
        .from("fee_rules")
        .select("*")
        .order("priority", { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error("Error fetching fee rules:", error);
      toast({
        title: "Error",
        description: "Failed to fetch fee rules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const ruleData = {
      name: formData.name,
      rule_type: formData.rule_type,
      base_amount: parseFloat(formData.base_amount),
      vehicle_type: formData.vehicle_type || null,
      time_conditions: formData.time_conditions ? JSON.parse(formData.time_conditions) : null,
      is_active: formData.is_active,
      priority: parseInt(formData.priority),
      valid_from: formData.valid_from,
      valid_until: formData.valid_until || null
    };

    try {
      if (editingRule) {
        const { error } = await supabase
          .from("fee_rules")
          .update(ruleData)
          .eq("id", editingRule.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Fee rule updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("fee_rules")
          .insert([ruleData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Fee rule created successfully",
        });
      }

      resetForm();
      fetchFeeRules();
    } catch (error) {
      console.error("Error saving fee rule:", error);
      toast({
        title: "Error",
        description: "Failed to save fee rule",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("fee_rules")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fee rule deleted successfully",
      });

      fetchFeeRules();
    } catch (error) {
      console.error("Error deleting fee rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete fee rule",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      rule_type: "flat",
      base_amount: "",
      vehicle_type: "",
      time_conditions: "",
      is_active: true,
      priority: "0",
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: ""
    });
    setEditingRule(null);
    setIsCreateOpen(false);
  };

  const handleEdit = (rule: FeeRule) => {
    setFormData({
      name: rule.name,
      rule_type: rule.rule_type,
      base_amount: rule.base_amount.toString(),
      vehicle_type: rule.vehicle_type || "",
      time_conditions: rule.time_conditions ? JSON.stringify(rule.time_conditions, null, 2) : "",
      is_active: rule.is_active,
      priority: rule.priority.toString(),
      valid_from: rule.valid_from.split('T')[0],
      valid_until: rule.valid_until ? rule.valid_until.split('T')[0] : ""
    });
    setEditingRule(rule);
    setIsCreateOpen(true);
  };

  const runSimulation = () => {
    // Mock simulation logic
    const entryDate = new Date(simEntryTime);
    const hour = entryDate.getHours();
    
    let calculatedFee = 10; // Base fee
    const appliedRules: string[] = [];

    // Apply rules based on type
    const activeRules = rules.filter(r => r.is_active);
    
    for (const rule of activeRules) {
      if (rule.rule_type === 'flat') {
        calculatedFee = rule.base_amount;
        appliedRules.push(rule.name);
      } else if (rule.rule_type === 'vehicle_type' && rule.vehicle_type === simVehicleType) {
        calculatedFee = rule.base_amount;
        appliedRules.push(rule.name);
      } else if (rule.rule_type === 'time_of_day') {
        // Simplified time-based pricing
        if (hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19) {
          calculatedFee = rule.base_amount;
          appliedRules.push(rule.name);
        }
      }
    }

    const result: SimulationResult = {
      vehicle_type: simVehicleType,
      plate_number: simPlateNumber,
      entry_time: simEntryTime,
      calculated_fee: calculatedFee,
      applied_rules: appliedRules
    };

    setSimulationResults([result, ...simulationResults.slice(0, 9)]);

    toast({
      title: "Simulation Complete",
      description: `Calculated fee: ${calculatedFee} EGP`,
    });
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'time_of_day':
        return <Clock className="h-4 w-4" />;
      case 'vehicle_type':
        return <Car className="h-4 w-4" />;
      default:
        return <Calculator className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading pricing rules...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pricing Management</h1>
            <p className="text-muted-foreground">
              Configure fee rules and test pricing scenarios
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingRule ? 'Edit' : 'Create'} Fee Rule</DialogTitle>
                <DialogDescription>
                  Configure pricing rules based on various conditions
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Rule Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rule_type">Rule Type</Label>
                    <Select value={formData.rule_type} onValueChange={(value: any) => setFormData({...formData, rule_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat Rate</SelectItem>
                        <SelectItem value="time_of_day">Time of Day</SelectItem>
                        <SelectItem value="vehicle_type">Vehicle Type</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="base_amount">Base Amount (EGP)</Label>
                    <Input
                      id="base_amount"
                      type="number"
                      step="0.01"
                      value={formData.base_amount}
                      onChange={(e) => setFormData({...formData, base_amount: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    />
                  </div>
                </div>

                {formData.rule_type === 'vehicle_type' && (
                  <div>
                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                    <Select value={formData.vehicle_type} onValueChange={(value) => setFormData({...formData, vehicle_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.rule_type === 'time_of_day' && (
                  <div>
                    <Label htmlFor="time_conditions">Time Conditions (JSON)</Label>
                    <Textarea
                      id="time_conditions"
                      placeholder='{"peak_hours": [{"start": "07:00", "end": "09:00"}, {"start": "17:00", "end": "19:00"}]}'
                      value={formData.time_conditions}
                      onChange={(e) => setFormData({...formData, time_conditions: e.target.value})}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valid_from">Valid From</Label>
                    <Input
                      id="valid_from"
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="valid_until">Valid Until (Optional)</Label>
                    <Input
                      id="valid_until"
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingRule ? 'Update' : 'Create'} Rule
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fee Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Rules ({rules.length})</CardTitle>
              <CardDescription>
                Active pricing rules and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRuleTypeIcon(rule.rule_type)}
                          <span className="capitalize">{rule.rule_type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>{rule.base_amount} EGP</TableCell>
                      <TableCell>
                        <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(rule)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(rule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pricing Simulator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Pricing Simulator
              </CardTitle>
              <CardDescription>
                Test pricing scenarios with current rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sim_vehicle_type">Vehicle Type</Label>
                  <Select value={simVehicleType} onValueChange={setSimVehicleType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sim_plate">Plate Number</Label>
                  <Input
                    id="sim_plate"
                    value={simPlateNumber}
                    onChange={(e) => setSimPlateNumber(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sim_time">Entry Time</Label>
                <Input
                  id="sim_time"
                  type="datetime-local"
                  value={simEntryTime}
                  onChange={(e) => setSimEntryTime(e.target.value)}
                />
              </div>

              <Button onClick={runSimulation} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Run Simulation
              </Button>

              {simulationResults.length > 0 && (
                <div className="space-y-2">
                  <Label>Recent Simulations</Label>
                  {simulationResults.map((result, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{result.plate_number}</span>
                        <Badge variant="default">{result.calculated_fee} EGP</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>{result.vehicle_type} • {new Date(result.entry_time).toLocaleString()}</div>
                        <div>Rules: {result.applied_rules.join(', ') || 'Default'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};