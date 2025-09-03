-- Insert dummy test users into auth.users (simulated - this is for reference)
-- We'll create dummy data for existing user IDs that the frontend expects

-- Insert dummy wallets
INSERT INTO public.wallets (id, user_id, balance, auto_topup_enabled, auto_topup_threshold, auto_topup_amount, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 250.50, true, 50.00, 100.00, now(), now()),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 125.75, false, 30.00, 75.00, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert dummy vehicles
INSERT INTO public.vehicles (id, user_id, plate_number, rfid_tag, vehicle_type, is_default, created_at, updated_at)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'ABC 123', 'RFID001', 'car', true, now(), now()),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'XYZ 789', 'RFID002', 'motorcycle', false, now(), now()),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'DEF 456', 'RFID003', 'car', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert dummy transactions
INSERT INTO public.transactions (id, wallet_id, user_id, type, amount, status, description, payment_method, transaction_ref, created_at, processed_at, metadata)
VALUES 
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'topup', 100.00, 'completed', 'Wallet top-up', 'credit_card', 'TXN001', now() - interval '2 days', now() - interval '2 days', '{"payment_id": "pi_1234567890"}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'toll', -15.50, 'completed', 'Toll payment - ABC 123', 'wallet', 'TXN002', now() - interval '1 day', now() - interval '1 day', '{"vehicle_plate": "ABC 123", "location": "Gate A"}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'toll', -12.25, 'completed', 'Toll payment - XYZ 789', 'wallet', 'TXN003', now() - interval '12 hours', now() - interval '12 hours', '{"vehicle_plate": "XYZ 789", "location": "Gate B"}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'topup', 50.00, 'pending', 'Auto top-up', 'credit_card', 'TXN004', now() - interval '6 hours', null, '{"auto_topup": true}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'topup', 75.00, 'completed', 'Manual top-up', 'bank_transfer', 'TXN005', now() - interval '3 days', now() - interval '3 days', '{"bank_ref": "BT987654321"}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'toll', -8.75, 'completed', 'Toll payment - DEF 456', 'wallet', 'TXN006', now() - interval '4 hours', now() - interval '4 hours', '{"vehicle_plate": "DEF 456", "location": "Gate C"}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'refund', 15.50, 'completed', 'Toll refund - Incorrect charge', 'wallet', 'TXN007', now() - interval '2 hours', now() - interval '2 hours', '{"original_transaction": "770e8400-e29b-41d4-a716-446655440002"}'::jsonb)
ON CONFLICT (id) DO NOTHING;