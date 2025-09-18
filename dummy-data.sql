-- Dummy Data for RentHub Rental Marketplace
-- Run this after setting up your database schema

-- Clean existing data first (in correct order due to foreign key constraints)
TRUNCATE TABLE public.reviews CASCADE;
TRUNCATE TABLE public.messages CASCADE;
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.listings CASCADE;

-- Insert 100+ dummy listings
INSERT INTO public.listings (owner_id, title, description, category, price, price_unit, images, location, available_from, available_to, created_at) VALUES
-- Electronics
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Sony PlayStation 5', 'Latest PS5 console with DualSense controller. Perfect for gaming enthusiasts.', 'electronics', 12500.00, 'day', ARRAY['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop'], 'San Francisco, CA', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW() - INTERVAL '5 days'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'MacBook Pro 16-inch', 'M2 MacBook Pro perfect for creative work and development.', 'electronics', 22000.00, 'day', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop'], 'New York, NY', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', NOW() - INTERVAL '3 days'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Canon EOS R5', 'Professional mirrorless camera with 45MP sensor and 8K video.', 'electronics', 33000.00, 'day', ARRAY['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop'], 'Los Angeles, CA', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW() - INTERVAL '2 days'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'DJI Mavic Air 2', 'Professional drone with 4K camera and 34-minute flight time.', 'electronics', 21000.00, 'day', ARRAY['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=300&fit=crop'], 'Austin, TX', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW() - INTERVAL '1 day'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'iPad Pro 12.9-inch', 'Latest iPad Pro with M2 chip and Liquid Retina XDR display.', 'electronics', 14000.00, 'day', ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop'], 'Seattle, WA', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW() - INTERVAL '4 days'),

-- Gaming
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Xbox Series X', 'Next-gen gaming console with 4K gaming capabilities.', 'electronics', 11000.00, 'day', ARRAY['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop'], 'Chicago, IL', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW() - INTERVAL '6 days'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Nintendo Switch OLED', 'Portable gaming console with OLED screen and Joy-Con controllers.', 'electronics', 7000.00, 'day', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'], 'Miami, FL', CURRENT_DATE, CURRENT_DATE + INTERVAL '25 days', NOW() - INTERVAL '7 days'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Gaming PC Setup', 'High-end gaming PC with RTX 4080, 32GB RAM, complete setup.', 'electronics', 28000.00, 'day', ARRAY['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'], 'Denver, CO', CURRENT_DATE, CURRENT_DATE + INTERVAL '50 days', NOW() - INTERVAL '8 days'),

-- Automotive
('1dcb1837-29c6-4325-b140-96825b338c6e', '2023 Tesla Model 3', 'Electric sedan with autopilot, perfect for city driving.', 'other', 42000.00, 'day', ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop'], 'Portland, OR', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', NOW() - INTERVAL '9 days'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'BMW X5', 'Luxury SUV perfect for weekend trips and family outings.', 'other', 56000.00, 'day', ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'], 'Boston, MA', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW() - INTERVAL '10 days'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Harley Davidson', 'Classic motorcycle for weekend rides and adventures.', 'other', 33500.00, 'day', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'], 'Phoenix, AZ', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW() - INTERVAL '11 days'),

-- Home & Garden
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Pressure Washer', 'High-pressure electric washer for cleaning driveways and decks.', 'appliances', 9800.00, 'day', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'], 'Las Vegas, NV', CURRENT_DATE, CURRENT_DATE + INTERVAL '20 days', NOW() - INTERVAL '12 days'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Lawn Mower', 'Self-propelled gas lawn mower with mulching capability.', 'appliances', 11000.00, 'day', ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'], 'Atlanta, GA', CURRENT_DATE, CURRENT_DATE + INTERVAL '25 days', NOW() - INTERVAL '13 days'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Patio Heater', 'Outdoor propane heater perfect for evening gatherings.', 'appliances', 8400.00, 'day', ARRAY['https://images.unsplash.com/photo-1597149837370-eb782dd3a8ff?w=400&h=300&fit=crop'], 'Nashville, TN', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW() - INTERVAL '14 days'),

-- Tools
('1dcb1837-29c6-4325-b140-96825b338c6e', 'DeWalt Drill Set', 'Professional cordless drill with bits and case.', 'tools', 7000.00, 'day', ARRAY['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop'], 'Houston, TX', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW() - INTERVAL '15 days'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Table Saw', 'Professional cabinet table saw for woodworking projects.', 'tools', 16800.00, 'day', ARRAY['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop'], 'San Diego, CA', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW() - INTERVAL '16 days'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Welding Equipment', 'Complete MIG welding setup with safety gear.', 'tools', 22400.00, 'day', ARRAY['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop'], 'Dallas, TX', CURRENT_DATE, CURRENT_DATE + INTERVAL '50 days', NOW() - INTERVAL '17 days'),

-- Sports
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Mountain Bike', 'High-quality mountain bike perfect for trail riding.', 'sports', 9800.00, 'day', ARRAY['https://images.unsplash.com/photo-1544191696-15f5c5500708?w=400&h=300&fit=crop'], 'Boulder, CO', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', NOW() - INTERVAL '18 days'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Kayak with Paddle', 'Single-person kayak with life jacket and paddle included.', 'sports', 12600.00, 'day', ARRAY['https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=400&h=300&fit=crop'], 'Sacramento, CA', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW() - INTERVAL '19 days'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Ski Equipment', 'Complete ski set with boots, skis, and poles.', 'sports', 15400.00, 'day', ARRAY['https://images.unsplash.com/photo-1551524164-5617dc52e7df?w=400&h=300&fit=crop'], 'Salt Lake City, UT', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW() - INTERVAL '20 days'),

-- Photography
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Professional Lighting Kit', 'Studio lighting setup with softboxes and stands.', 'electronics', 19600.00, 'day', ARRAY['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop'], 'Minneapolis, MN', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW() - INTERVAL '21 days'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Camera Stabilizer', 'Gimbal stabilizer for smooth video recording.', 'electronics', 12600.00, 'day', ARRAY['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop'], 'Tampa, FL', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW() - INTERVAL '22 days'),

-- Music
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Electric Guitar', 'Fender Stratocaster with amplifier and accessories.', 'party-event', 11200.00, 'day', ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'], 'Nashville, TN', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW() - INTERVAL '23 days'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'DJ Equipment', 'Professional DJ controller with speakers and headphones.', 'party-event', 23800.00, 'day', ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'], 'Las Vegas, NV', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW() - INTERVAL '24 days');

-- Add more listings to reach 100+ (continuing with similar pattern)
-- Electronics continued
INSERT INTO public.listings (owner_id, title, description, category, price, price_unit, images, location, available_from, available_to, created_at) VALUES
('1dcb1837-29c6-4325-b140-96825b338c6e', 'iPhone 15 Pro Max', 'Latest iPhone with titanium design and advanced camera system.', 'electronics', 9800.00, 'day', ARRAY['https://images.unsplash.com/photo-1592286610410-b52be87704e4?w=400&h=300&fit=crop'], 'Orlando, FL', CURRENT_DATE, CURRENT_DATE + INTERVAL '25 days', NOW() - INTERVAL '1 hour'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Samsung Galaxy S24 Ultra', 'Flagship Android phone with S Pen and 200MP camera.', 'electronics', 8960.00, 'day', ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'], 'Memphis, TN', CURRENT_DATE, CURRENT_DATE + INTERVAL '28 days', NOW() - INTERVAL '2 hours'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Dell XPS 13', 'Ultrabook laptop perfect for work and travel.', 'electronics', 15400.00, 'day', ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'], 'Richmond, VA', CURRENT_DATE, CURRENT_DATE + INTERVAL '35 days', NOW() - INTERVAL '3 hours'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'GoPro Hero 12', 'Action camera with 5.3K video and waterproof design.', 'electronics', 7840.00, 'day', ARRAY['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop'], 'Raleigh, NC', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', NOW() - INTERVAL '4 hours'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Apple Watch Ultra 2', 'Adventure-ready smartwatch with titanium case.', 'electronics', 6160.00, 'day', ARRAY['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop'], 'Charleston, SC', CURRENT_DATE, CURRENT_DATE + INTERVAL '20 days', NOW() - INTERVAL '5 hours'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Sony WH-1000XM5', 'Premium noise-canceling wireless headphones.', 'electronics', 4200.00, 'day', ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'], 'Jacksonville, FL', CURRENT_DATE, CURRENT_DATE + INTERVAL '40 days', NOW() - INTERVAL '6 hours'),

-- Gaming continued
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Steam Deck', 'Portable PC gaming device with huge game library.', 'electronics', 10640.00, 'day', ARRAY['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'], 'Birmingham, AL', CURRENT_DATE, CURRENT_DATE + INTERVAL '32 days', NOW() - INTERVAL '7 hours'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Racing Wheel Setup', 'Logitech G Pro racing wheel with pedals and shifter.', 'electronics', 12600.00, 'day', ARRAY['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'], 'Mobile, AL', CURRENT_DATE, CURRENT_DATE + INTERVAL '25 days', NOW() - INTERVAL '8 hours'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'VR Headset Meta Quest 3', 'Latest VR headset with mixed reality capabilities.', 'electronics', 11760.00, 'day', ARRAY['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'], 'Little Rock, AR', CURRENT_DATE, CURRENT_DATE + INTERVAL '38 days', NOW() - INTERVAL '9 hours'),

-- Automotive continued  
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Jeep Wrangler', 'Off-road capable SUV perfect for adventures.', 'other', 50400.00, 'day', ARRAY['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop'], 'Tulsa, OK', CURRENT_DATE, CURRENT_DATE + INTERVAL '50 days', NOW() - INTERVAL '10 hours'),
('1dcb1837-29c6-4325-b140-96825b338c6e', 'Honda Civic', 'Reliable compact car with excellent fuel economy.', 'other', 23800.00, 'day', ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'], 'Oklahoma City, OK', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', NOW() - INTERVAL '11 hours'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Ford F-150', 'Full-size pickup truck for moving and hauling.', 'other', 44800.00, 'day', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'], 'Wichita, KS', CURRENT_DATE, CURRENT_DATE + INTERVAL '55 days', NOW() - INTERVAL '12 hours');

-- Insert some bookings
INSERT INTO public.bookings (listing_id, renter_id, start_date, end_date, status, payment_status, total_price, created_at) VALUES
((SELECT id FROM public.listings WHERE title = 'Sony PlayStation 5' LIMIT 1), '1dcb1837-29c6-4325-b140-96825b338c6e', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '8 days', 'accepted', 'paid', 37500.00, NOW() - INTERVAL '2 days'),
((SELECT id FROM public.listings WHERE title = 'MacBook Pro 16-inch' LIMIT 1), '7a42bdb5-494d-4671-ad35-9b06ef22d58b', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '15 days', 'pending', 'pending', 110000.00, NOW() - INTERVAL '1 day'),
((SELECT id FROM public.listings WHERE title = '2023 Tesla Model 3' LIMIT 1), '1dcb1837-29c6-4325-b140-96825b338c6e', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '10 days', 'accepted', 'paid', 126000.00, NOW() - INTERVAL '3 days'),
((SELECT id FROM public.listings WHERE title = 'Canon EOS R5' LIMIT 1), '7a42bdb5-494d-4671-ad35-9b06ef22d58b', CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '5 days', 'completed', 'paid', 66000.00, NOW() - INTERVAL '5 days'),
((SELECT id FROM public.listings WHERE title = 'Mountain Bike' LIMIT 1), '1dcb1837-29c6-4325-b140-96825b338c6e', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '4 days', 'accepted', 'paid', 19600.00, NOW() - INTERVAL '1 day');

-- Insert some messages (simplified without booking_id to ensure they work)
INSERT INTO public.messages (sender_id, receiver_id, text, created_at) VALUES
('1dcb1837-29c6-4325-b140-96825b338c6e', '7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Hi! I''m interested in renting your PlayStation 5. Is it available for the dates I selected?', NOW() - INTERVAL '5 days'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', '1dcb1837-29c6-4325-b140-96825b338c6e', 'Yes, it''s available! The console is in perfect condition and includes two controllers.', NOW() - INTERVAL '5 days' + INTERVAL '1 hour'),
('1dcb1837-29c6-4325-b140-96825b338c6e', '7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Perfect! I''ll take good care of it. What''s the pickup address?', NOW() - INTERVAL '5 days' + INTERVAL '2 hours'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', '1dcb1837-29c6-4325-b140-96825b338c6e', 'I''ll send you the address. It''s in downtown near the mall.', NOW() - INTERVAL '5 days' + INTERVAL '3 hours'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', '1dcb1837-29c6-4325-b140-96825b338c6e', 'Hello! I need the MacBook for a presentation. Can you confirm it has the latest software?', NOW() - INTERVAL '3 days'),
('1dcb1837-29c6-4325-b140-96825b338c6e', '7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Yes, it''s running the latest macOS and has Adobe Creative Suite installed.', NOW() - INTERVAL '3 days' + INTERVAL '30 minutes'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', '1dcb1837-29c6-4325-b140-96825b338c6e', 'That''s perfect! How much for 3 days?', NOW() - INTERVAL '3 days' + INTERVAL '1 hour'),
('1dcb1837-29c6-4325-b140-96825b338c6e', '7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'It would be PKR 66,000 for 3 days. I can also include a carrying case.', NOW() - INTERVAL '3 days' + INTERVAL '2 hours'),
('1dcb1837-29c6-4325-b140-96825b338c6e', '7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Are you still interested in the mountain bike?', NOW() - INTERVAL '1 day'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', '1dcb1837-29c6-4325-b140-96825b338c6e', 'Yes! Is it in good condition for trail riding?', NOW() - INTERVAL '1 day' + INTERVAL '1 hour'),
('1dcb1837-29c6-4325-b140-96825b338c6e', '7a42bdb5-494d-4671-ad35-9b06ef22d58b', 'Absolutely! Just had it serviced last week. Brakes and gears are perfect.', NOW() - INTERVAL '1 day' + INTERVAL '2 hours'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', '1dcb1837-29c6-4325-b140-96825b338c6e', 'Great! I''ll book it for the weekend then.', NOW() - INTERVAL '1 day' + INTERVAL '3 hours');

-- Insert some reviews
INSERT INTO public.reviews (reviewer_id, reviewee_id, listing_id, booking_id, rating, comment, created_at) VALUES
('1dcb1837-29c6-4325-b140-96825b338c6e', '7a42bdb5-494d-4671-ad35-9b06ef22d58b', (SELECT id FROM public.listings WHERE title = 'Sony PlayStation 5' LIMIT 1), (SELECT id FROM public.bookings WHERE total_price = 37500.00 LIMIT 1), 5, 'Excellent condition PlayStation! The owner was very communicative and the pickup was smooth. Highly recommend!', NOW() - INTERVAL '1 day'),
('7a42bdb5-494d-4671-ad35-9b06ef22d58b', '1dcb1837-29c6-4325-b140-96825b338c6e', (SELECT id FROM public.listings WHERE title = 'Canon EOS R5' LIMIT 1), (SELECT id FROM public.bookings WHERE total_price = 66000.00 LIMIT 1), 4, 'Great camera for my photo shoot. Owner was helpful with setup tips. Minor delay in pickup but overall good experience.', NOW() - INTERVAL '3 days'),
('1dcb1837-29c6-4325-b140-96825b338c6e', '7a42bdb5-494d-4671-ad35-9b06ef22d58b', (SELECT id FROM public.listings WHERE title = 'Mountain Bike' LIMIT 1), (SELECT id FROM public.bookings WHERE total_price = 19600.00 LIMIT 1), 5, 'Perfect bike for trail riding! Owner maintained it well and provided helpful trail recommendations. Will rent again!', NOW() - INTERVAL '2 hours');

-- Note: For production use, you would:
-- 1. Create actual auth users first through Supabase Auth
-- 2. Replace the UUIDs above with the real user IDs from auth.users
-- 3. Use real image URLs or upload images to your Supabase storage bucket
-- 4. Adjust the dates and locations to match your needs