import { useState, useEffect } from 'react';
import { Car, Plus, Edit, Trash2, Radio, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Header } from '@/components/Header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { RFIDScanDialog } from '@/components/vehicles/RFIDScanDialog';

const vehicleSchema = z.object({
  plate_number: z
    .string()
    .min(1, 'Plate number is required')
    .regex(/^[A-Z0-9]{3}\s[0-9]{3}$/, 'Plate format must be ABC 123 (3 letters/numbers, space, 3 numbers)'),
  vehicle_type: z.string().min(1, 'Vehicle type is required'),
  is_default: z.boolean(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface Vehicle {
  id: string;
  plate_number: string;
  vehicle_type: string;
  rfid_tag?: string;
  is_default: boolean;
  created_at: string;
}

export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isRFIDDialogOpen, setIsRFIDDialogOpen] = useState(false);
  const [selectedVehicleForRFID, setSelectedVehicleForRFID] = useState<Vehicle | null>(null);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plate_number: '',
      vehicle_type: 'car',
      is_default: false,
    },
  });

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  const fetchVehicles = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch vehicles',
        variant: 'destructive',
      });
    } else {
      setVehicles(data || []);
    }
  };

  const onSubmit = async (data: VehicleFormData) => {
    if (!user) return;

    try {
      if (editingVehicle) {
        const { error } = await supabase
          .from('vehicles')
          .update({
            plate_number: data.plate_number.toUpperCase(),
            vehicle_type: data.vehicle_type,
            is_default: data.is_default,
          })
          .eq('id', editingVehicle.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Vehicle updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('vehicles')
          .insert({
            user_id: user.id,
            plate_number: data.plate_number.toUpperCase(),
            vehicle_type: data.vehicle_type,
            is_default: data.is_default,
          });

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Vehicle added successfully',
        });
      }

      setIsDialogOpen(false);
      setEditingVehicle(null);
      form.reset();
      fetchVehicles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save vehicle',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    form.reset({
      plate_number: vehicle.plate_number,
      vehicle_type: vehicle.vehicle_type,
      is_default: vehicle.is_default,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (vehicleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Vehicle deleted successfully',
      });

      fetchVehicles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete vehicle',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (vehicleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_default: true })
        .eq('id', vehicleId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Default vehicle updated',
      });

      fetchVehicles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update default vehicle',
        variant: 'destructive',
      });
    }
  };

  const handleRFIDLink = (vehicle: Vehicle) => {
    setSelectedVehicleForRFID(vehicle);
    setIsRFIDDialogOpen(true);
  };

  const handleRFIDUpdate = async (rfidTag: string | null) => {
    if (!selectedVehicleForRFID || !user) return;

    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ rfid_tag: rfidTag })
        .eq('id', selectedVehicleForRFID.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: rfidTag ? 'RFID tag linked successfully' : 'RFID tag unlinked successfully',
      });

      setIsRFIDDialogOpen(false);
      setSelectedVehicleForRFID(null);
      fetchVehicles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update RFID tag',
        variant: 'destructive',
      });
    }
  };

  const openAddDialog = () => {
    setEditingVehicle(null);
    form.reset({
      plate_number: '',
      vehicle_type: 'car',
      is_default: false,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              My Vehicles
            </h1>
            <p className="text-muted-foreground">
              Manage your registered vehicles and RFID tags
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="plate_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plate Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ABC 123" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="vehicle_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="bus">Bus</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Set as Default Vehicle</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Use this as your primary vehicle for toll payments
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      {editingVehicle ? 'Update' : 'Add'} Vehicle
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    <span>{vehicle.plate_number}</span>
                  </div>
                  {vehicle.is_default && (
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="secondary" className="capitalize">
                    {vehicle.vehicle_type}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">RFID Tag:</span>
                  <div className="flex items-center gap-2">
                    {vehicle.rfid_tag ? (
                      <Badge variant="outline" className="font-mono text-xs">
                        {vehicle.rfid_tag}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not linked</span>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRFIDLink(vehicle)}
                    >
                      <Radio className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  {!vehicle.is_default && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(vehicle.id)}
                      className="flex-1"
                    >
                      <StarOff className="h-3 w-3 mr-1" />
                      Set Default
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(vehicle)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {vehicles.length === 0 && (
            <Card className="col-span-full bg-gradient-card shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Car className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No vehicles registered</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add your first vehicle to start using toll collection services
                </p>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Vehicle
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <RFIDScanDialog
        isOpen={isRFIDDialogOpen}
        onClose={() => setIsRFIDDialogOpen(false)}
        vehicle={selectedVehicleForRFID}
        onUpdate={handleRFIDUpdate}
      />
    </div>
  );
};