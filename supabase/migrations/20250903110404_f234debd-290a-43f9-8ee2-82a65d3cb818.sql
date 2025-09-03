-- Add some sample transactions for new users (via trigger)
CREATE OR REPLACE FUNCTION public.create_sample_data_for_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert sample vehicle
  INSERT INTO public.vehicles (user_id, plate_number, rfid_tag, vehicle_type, is_default)
  VALUES (NEW.user_id, 'ABC 123', 'RFID001', 'car', true);
  
  -- Insert some sample transactions after a short delay to ensure wallet exists
  INSERT INTO public.transactions (wallet_id, user_id, type, amount, status, description, payment_method, created_at, processed_at)
  SELECT 
    w.id,
    NEW.user_id,
    'topup',
    100.00,
    'completed',
    'Welcome bonus',
    'system',
    now() - interval '1 day',
    now() - interval '1 day'
  FROM public.wallets w 
  WHERE w.user_id = NEW.user_id;
  
  INSERT INTO public.transactions (wallet_id, user_id, type, amount, status, description, payment_method, created_at, processed_at)
  SELECT 
    w.id,
    NEW.user_id,
    'toll',
    -15.50,
    'completed',
    'Sample toll payment',
    'wallet',
    now() - interval '12 hours',
    now() - interval '12 hours'
  FROM public.wallets w 
  WHERE w.user_id = NEW.user_id;
  
  -- Update wallet balance 
  UPDATE public.wallets 
  SET balance = 84.50 
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to add sample data after wallet is created
CREATE OR REPLACE TRIGGER create_sample_data_after_wallet
  AFTER INSERT ON public.wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.create_sample_data_for_new_user();