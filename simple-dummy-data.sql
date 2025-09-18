-- Simple dummy data to populate the UI
-- Just run this in your Supabase SQL editor after creating a few auth users

-- First create a few dummy user profiles (replace these UUIDs with real ones from auth.users)
INSERT INTO public.users (id, name, email, phone, rating, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Alex Johnson', 'alex@example.com', '+1-555-0101', 4.8, NOW()),
('22222222-2222-2222-2222-222222222222', 'Sarah Kim', 'sarah@example.com', '+1-555-0102', 4.9, NOW()),
('33333333-3333-3333-3333-333333333333', 'Mike Davis', 'mike@example.com', '+1-555-0103', 4.7, NOW()),
('44444444-4444-4444-4444-444444444444', 'Emma Wilson', 'emma@example.com', '+1-555-0104', 4.6, NOW()),
('55555555-5555-5555-5555-555555555555', 'John Smith', 'john@example.com', '+1-555-0105', 4.9, NOW());

-- Random listings to populate the UI
INSERT INTO public.listings (owner_id, title, description, category, price, price_unit, location, available_from, available_to, created_at) VALUES
-- Electronics
('11111111-1111-1111-1111-111111111111', 'iPhone 15 Pro', 'Latest iPhone in great condition', 'electronics', 45.00, 'day', 'San Francisco, CA', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'MacBook Air M2', 'Perfect for work and school', 'electronics', 75.00, 'day', 'New York, NY', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW()),
('33333333-3333-3333-3333-333333333333', 'Sony PlayStation 5', 'Gaming console with controllers', 'electronics', 40.00, 'day', 'Los Angeles, CA', CURRENT_DATE, CURRENT_DATE + INTERVAL '20 days', NOW()),
('44444444-4444-4444-4444-444444444444', 'Canon DSLR Camera', 'Professional camera setup', 'electronics', 60.00, 'day', 'Chicago, IL', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW()),
('55555555-5555-5555-5555-555555555555', 'iPad Pro', 'Tablet with Apple Pencil', 'electronics', 35.00, 'day', 'Austin, TX', CURRENT_DATE, CURRENT_DATE + INTERVAL '25 days', NOW()),
('11111111-1111-1111-1111-111111111111', 'Gaming Laptop', 'High-end gaming laptop', 'electronics', 85.00, 'day', 'Seattle, WA', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'Drone 4K', 'Professional drone with camera', 'electronics', 55.00, 'day', 'Miami, FL', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW()),
('33333333-3333-3333-3333-333333333333', 'Smart TV 65"', 'Large smart TV for events', 'electronics', 50.00, 'day', 'Denver, CO', CURRENT_DATE, CURRENT_DATE + INTERVAL '50 days', NOW()),

-- Tools
('44444444-4444-4444-4444-444444444444', 'Power Drill Set', 'Complete drill kit with bits', 'tools', 25.00, 'day', 'Phoenix, AZ', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', NOW()),
('55555555-5555-5555-5555-555555555555', 'Chainsaw', 'Gas-powered chainsaw', 'tools', 45.00, 'day', 'Portland, OR', CURRENT_DATE, CURRENT_DATE + INTERVAL '15 days', NOW()),
('11111111-1111-1111-1111-111111111111', 'Table Saw', 'Professional woodworking saw', 'tools', 65.00, 'day', 'Boston, MA', CURRENT_DATE, CURRENT_DATE + INTERVAL '55 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'Pressure Washer', 'High-pressure cleaning', 'tools', 35.00, 'day', 'Nashville, TN', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW()),
('33333333-3333-3333-3333-333333333333', 'Tile Saw', 'Wet tile cutting saw', 'tools', 40.00, 'day', 'Las Vegas, NV', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW()),

-- Sports
('44444444-4444-4444-4444-444444444444', 'Mountain Bike', 'Trek mountain bike', 'sports', 30.00, 'day', 'Boulder, CO', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW()),
('55555555-5555-5555-5555-555555555555', 'Kayak', 'Single person kayak', 'sports', 40.00, 'day', 'San Diego, CA', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW()),
('11111111-1111-1111-1111-111111111111', 'Ski Equipment', 'Complete ski set', 'sports', 50.00, 'day', 'Salt Lake City, UT', CURRENT_DATE, CURRENT_DATE + INTERVAL '20 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'Surfboard', 'Longboard surfboard', 'sports', 35.00, 'day', 'Honolulu, HI', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', NOW()),
('33333333-3333-3333-3333-333333333333', 'Golf Clubs', 'Complete golf set', 'sports', 45.00, 'day', 'Orlando, FL', CURRENT_DATE, CURRENT_DATE + INTERVAL '25 days', NOW()),

-- Home
('44444444-4444-4444-4444-444444444444', 'Lawn Mower', 'Self-propelled mower', 'home', 30.00, 'day', 'Atlanta, GA', CURRENT_DATE, CURRENT_DATE + INTERVAL '50 days', NOW()),
('55555555-5555-5555-5555-555555555555', 'Leaf Blower', 'Gas leaf blower', 'home', 20.00, 'day', 'Charlotte, NC', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW()),
('11111111-1111-1111-1111-111111111111', 'Patio Heater', 'Outdoor propane heater', 'home', 25.00, 'day', 'Tampa, FL', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'Garden Tiller', 'Gas-powered tiller', 'home', 35.00, 'day', 'Memphis, TN', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW()),

-- Automotive
('33333333-3333-3333-3333-333333333333', 'Tesla Model 3', 'Electric car rental', 'automotive', 150.00, 'day', 'Palo Alto, CA', CURRENT_DATE, CURRENT_DATE + INTERVAL '20 days', NOW()),
('44444444-4444-4444-4444-444444444444', 'BMW X5', 'Luxury SUV', 'automotive', 200.00, 'day', 'Dallas, TX', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW()),
('55555555-5555-5555-5555-555555555555', 'Honda Civic', 'Reliable compact car', 'automotive', 85.00, 'day', 'Houston, TX', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW()),
('11111111-1111-1111-1111-111111111111', 'Jeep Wrangler', 'Off-road vehicle', 'automotive', 120.00, 'day', 'Phoenix, AZ', CURRENT_DATE, CURRENT_DATE + INTERVAL '25 days', NOW()),

-- Photography
('22222222-2222-2222-2222-222222222222', 'Studio Lights', 'Professional lighting kit', 'photography', 60.00, 'day', 'Minneapolis, MN', CURRENT_DATE, CURRENT_DATE + INTERVAL '55 days', NOW()),
('33333333-3333-3333-3333-333333333333', 'Camera Lens 85mm', 'Portrait photography lens', 'photography', 40.00, 'day', 'Detroit, MI', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW()),
('44444444-4444-4444-4444-444444444444', 'Video Tripod', 'Heavy-duty video tripod', 'photography', 25.00, 'day', 'Cleveland, OH', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW()),

-- Music
('55555555-5555-5555-5555-555555555555', 'Electric Guitar', 'Fender Stratocaster', 'music', 35.00, 'day', 'Nashville, TN', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW()),
('11111111-1111-1111-1111-111111111111', 'DJ Equipment', 'Complete DJ setup', 'music', 75.00, 'day', 'Las Vegas, NV', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'Keyboard Piano', '88-key digital piano', 'music', 45.00, 'day', 'Kansas City, MO', CURRENT_DATE, CURRENT_DATE + INTERVAL '50 days', NOW()),

-- Gaming
('33333333-3333-3333-3333-333333333333', 'Xbox Series X', 'Next-gen gaming console', 'gaming', 35.00, 'day', 'Milwaukee, WI', CURRENT_DATE, CURRENT_DATE + INTERVAL '25 days', NOW()),
('44444444-4444-4444-4444-444444444444', 'Nintendo Switch', 'Portable gaming system', 'gaming', 25.00, 'day', 'Louisville, KY', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW()),
('55555555-5555-5555-5555-555555555555', 'VR Headset', 'Virtual reality gaming', 'gaming', 40.00, 'day', 'Indianapolis, IN', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW()),
('11111111-1111-1111-1111-111111111111', 'Gaming Chair', 'Ergonomic gaming chair', 'gaming', 20.00, 'day', 'Columbus, OH', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', NOW()),

-- Appliances
('22222222-2222-2222-2222-222222222222', 'Air Fryer', 'Large capacity air fryer', 'appliances', 15.00, 'day', 'Richmond, VA', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW()),
('33333333-3333-3333-3333-333333333333', 'Espresso Machine', 'Semi-automatic espresso', 'appliances', 30.00, 'day', 'Norfolk, VA', CURRENT_DATE, CURRENT_DATE + INTERVAL '25 days', NOW()),
('44444444-4444-4444-4444-444444444444', 'Stand Mixer', 'KitchenAid stand mixer', 'appliances', 25.00, 'day', 'Virginia Beach, VA', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW()),
('55555555-5555-5555-5555-555555555555', 'Vacuum Cleaner', 'Dyson cordless vacuum', 'appliances', 20.00, 'day', 'Raleigh, NC', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW()),

-- Party/Event
('11111111-1111-1111-1111-111111111111', 'Sound System', 'PA system with microphones', 'party-event', 85.00, 'day', 'Charleston, SC', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'Party Tent', '10x20 event tent', 'party-event', 60.00, 'day', 'Savannah, GA', CURRENT_DATE, CURRENT_DATE + INTERVAL '50 days', NOW()),
('33333333-3333-3333-3333-333333333333', 'Tables & Chairs', 'Set of 8 tables and 64 chairs', 'party-event', 95.00, 'day', 'Jacksonville, FL', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW()),
('44444444-4444-4444-4444-444444444444', 'Photo Booth', 'DIY photo booth setup', 'party-event', 45.00, 'day', 'Birmingham, AL', CURRENT_DATE, CURRENT_DATE + INTERVAL '25 days', NOW()),

-- Clothing
('55555555-5555-5555-5555-555555555555', 'Wedding Dress', 'Size 8 designer wedding dress', 'clothing', 200.00, 'day', 'Mobile, AL', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', NOW()),
('11111111-1111-1111-1111-111111111111', 'Tuxedo', 'Black tie formal tuxedo', 'clothing', 75.00, 'day', 'Huntsville, AL', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'Ski Jacket', 'Waterproof ski jacket', 'clothing', 25.00, 'day', 'Aspen, CO', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW()),
('33333333-3333-3333-3333-333333333333', 'Designer Handbag', 'Louis Vuitton handbag', 'clothing', 50.00, 'day', 'Beverly Hills, CA', CURRENT_DATE, CURRENT_DATE + INTERVAL '20 days', NOW()),

-- Other random stuff
('44444444-4444-4444-4444-444444444444', 'Inflatable Kayak', 'Two-person inflatable kayak', 'other', 35.00, 'day', 'Lake Tahoe, CA', CURRENT_DATE, CURRENT_DATE + INTERVAL '55 days', NOW()),
('55555555-5555-5555-5555-555555555555', 'Camping Gear', 'Complete camping setup', 'other', 65.00, 'day', 'Yellowstone, WY', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW()),
('11111111-1111-1111-1111-111111111111', 'Projector', '4K home theater projector', 'other', 55.00, 'day', 'Provo, UT', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW()),
('22222222-2222-2222-2222-222222222222', 'Exercise Bike', 'Peloton exercise bike', 'other', 40.00, 'day', 'Boise, ID', CURRENT_DATE, CURRENT_DATE + INTERVAL '50 days', NOW());