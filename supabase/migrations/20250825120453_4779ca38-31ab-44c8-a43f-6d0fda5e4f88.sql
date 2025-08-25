-- Create admin dashboard tables

-- Devices table for toll gate hardware
CREATE TABLE public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  device_id TEXT UNIQUE NOT NULL,
  location JSONB NOT NULL, -- {lat, lng, address}
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'maintenance', 'error')),
  firmware_version TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  signal_strength INTEGER DEFAULT 0 CHECK (signal_strength >= 0 AND signal_strength <= 100),
  cpu_usage DECIMAL(5,2) DEFAULT 0.0,
  memory_usage DECIMAL(5,2) DEFAULT 0.0,
  temperature DECIMAL(5,2),
  provisioning_secret TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Entries table for toll crossings
CREATE TABLE public.entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
  vehicle_plate TEXT NOT NULL,
  rfid_tag TEXT,
  entry_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'disputed', 'resolved')),
  payment_method TEXT,
  transaction_id TEXT,
  image_url TEXT,
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  is_flagged BOOLEAN DEFAULT false,
  notes TEXT,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fee rules for pricing
CREATE TABLE public.fee_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('flat', 'time_based', 'vehicle_type')),
  vehicle_type TEXT, -- 'car', 'truck', 'motorcycle', etc.
  base_amount DECIMAL(10,2) NOT NULL,
  time_conditions JSONB, -- {start_time, end_time, days_of_week}
  device_ids UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reconciliation files for financial reconciliation
CREATE TABLE public.reconciliation_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  provider TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_amount DECIMAL(12,2),
  transaction_count INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  discrepancies_count INTEGER DEFAULT 0,
  discrepancies JSONB DEFAULT '[]',
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- API keys for external integrations
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Webhooks for external notifications
CREATE TABLE public.webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}',
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 3,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  last_response_status INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Device logs for monitoring
CREATE TABLE public.device_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
  log_level TEXT NOT NULL CHECK (log_level IN ('debug', 'info', 'warn', 'error')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System alerts
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('device_offline', 'payment_failed', 'high_error_rate', 'low_battery', 'custom')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  device_id UUID REFERENCES public.devices(id),
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliation_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (adjust based on your auth requirements)
CREATE POLICY "Admin full access to devices" ON public.devices FOR ALL USING (true);
CREATE POLICY "Admin full access to entries" ON public.entries FOR ALL USING (true);
CREATE POLICY "Admin full access to fee_rules" ON public.fee_rules FOR ALL USING (true);
CREATE POLICY "Admin full access to reconciliation_files" ON public.reconciliation_files FOR ALL USING (true);
CREATE POLICY "Admin full access to api_keys" ON public.api_keys FOR ALL USING (true);
CREATE POLICY "Admin full access to webhooks" ON public.webhooks FOR ALL USING (true);
CREATE POLICY "Admin full access to device_logs" ON public.device_logs FOR ALL USING (true);
CREATE POLICY "Admin full access to alerts" ON public.alerts FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_devices_status ON public.devices(status);
CREATE INDEX idx_devices_last_seen ON public.devices(last_seen);
CREATE INDEX idx_entries_device_id ON public.entries(device_id);
CREATE INDEX idx_entries_entry_time ON public.entries(entry_time);
CREATE INDEX idx_entries_status ON public.entries(status);
CREATE INDEX idx_entries_vehicle_plate ON public.entries(vehicle_plate);
CREATE INDEX idx_device_logs_device_id ON public.device_logs(device_id);
CREATE INDEX idx_device_logs_timestamp ON public.device_logs(timestamp);
CREATE INDEX idx_alerts_type ON public.alerts(type);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at);

-- Create functions for timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON public.devices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_rules_updated_at
  BEFORE UPDATE ON public.fee_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at
  BEFORE UPDATE ON public.webhooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.device_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;