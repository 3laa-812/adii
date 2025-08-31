import { useState, useEffect } from 'react';
import { Radio, Unlink, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface RFIDScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    id: string;
    plate_number: string;
    rfid_tag?: string;
  } | null;
  onUpdate: (rfidTag: string | null) => void;
}

export const RFIDScanDialog = ({ isOpen, onClose, vehicle, onUpdate }: RFIDScanDialogProps) => {
  const [rfidTag, setRfidTag] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (vehicle?.rfid_tag) {
      setRfidTag(vehicle.rfid_tag);
    } else {
      setRfidTag('');
    }
  }, [vehicle]);

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate RFID scan - in real implementation, this would interface with RFID reader
    toast({
      title: 'Scanning for RFID tag...',
      description: 'Please hold your RFID tag near the reader',
    });

    // Simulate scan completion after 3 seconds
    setTimeout(() => {
      const mockRFIDTag = `RFID${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      setRfidTag(mockRFIDTag);
      setIsScanning(false);
      toast({
        title: 'RFID tag detected!',
        description: `Tag ${mockRFIDTag} found`,
      });
    }, 3000);
  };

  const handleSave = () => {
    onUpdate(rfidTag || null);
  };

  const handleUnlink = () => {
    setRfidTag('');
    onUpdate(null);
  };

  const handleClose = () => {
    setIsScanning(false);
    onClose();
  };

  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            RFID Tag Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Info */}
          <div className="rounded-lg border p-4 bg-accent/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vehicle:</span>
              <Badge variant="outline">{vehicle.plate_number}</Badge>
            </div>
          </div>

          {/* Current RFID Tag */}
          {vehicle.rfid_tag && (
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current RFID Tag:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUnlink}
                  className="text-destructive hover:text-destructive"
                >
                  <Unlink className="h-3 w-3 mr-1" />
                  Unlink
                </Button>
              </div>
              <Badge variant="default" className="font-mono">
                {vehicle.rfid_tag}
              </Badge>
            </div>
          )}

          <Separator />

          {/* RFID Scanner Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                {vehicle.rfid_tag ? 'Update RFID Tag' : 'Link RFID Tag'}
              </Label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleStartScan}
                disabled={isScanning}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                {isScanning ? 'Scanning...' : 'Scan Tag'}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rfid-input">RFID Tag ID</Label>
              <Input
                id="rfid-input"
                value={rfidTag}
                onChange={(e) => setRfidTag(e.target.value.toUpperCase())}
                placeholder="Enter or scan RFID tag"
                disabled={isScanning}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                You can manually enter the RFID tag ID or use the scanner
              </p>
            </div>

            {isScanning && (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-pulse">
                    <Radio className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Scanning for RFID tag...<br />
                    Please hold your tag near the reader
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isScanning}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isScanning || (!rfidTag && !vehicle.rfid_tag)}
              className="flex-1"
            >
              {vehicle.rfid_tag ? 'Update' : 'Link'} Tag
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};