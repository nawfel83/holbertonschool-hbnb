-- Insert initial data for HBnB application
-- This script populates the database with sample data

-- Insert admin user
INSERT OR IGNORE INTO users (id, email, first_name, last_name, password, is_admin, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@hbnb.io',
    'Admin',
    'User',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewthJON8xwdq8yvW', -- admin123
    TRUE,
    datetime('now'),
    datetime('now')
);

-- Insert regular user
INSERT OR IGNORE INTO users (id, email, first_name, last_name, password, is_admin, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'user@example.com',
    'John',
    'Doe',
    '$2b$12$GRLdnjyJ0yEtC3xvvNM7.O6X8mxLtRAqmq8Y6Q6Y6Q6Y6Q6Y6Q6Y6', -- password123
    FALSE,
    datetime('now'),
    datetime('now')
);

-- Insert another user
INSERT OR IGNORE INTO users (id, email, first_name, last_name, password, is_admin, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'jane@example.com',
    'Jane',
    'Smith',
    '$2b$12$GRLdnjyJ0yEtC3xvvNM7.O6X8mxLtRAqmq8Y6Q6Y6Q6Y6Q6Y6Q6Y6', -- password123
    FALSE,
    datetime('now'),
    datetime('now')
);

-- Insert amenities
INSERT OR IGNORE INTO amenities (id, name, created_at, updated_at)
VALUES 
    ('amenity-001', 'WiFi', datetime('now'), datetime('now')),
    ('amenity-002', 'Swimming Pool', datetime('now'), datetime('now')),
    ('amenity-003', 'Parking', datetime('now'), datetime('now')),
    ('amenity-004', 'Air Conditioning', datetime('now'), datetime('now')),
    ('amenity-005', 'Kitchen', datetime('now'), datetime('now')),
    ('amenity-006', 'Balcony', datetime('now'), datetime('now')),
    ('amenity-007', 'Gym', datetime('now'), datetime('now')),
    ('amenity-008', 'Laundry', datetime('now'), datetime('now'));

-- Insert places
INSERT OR IGNORE INTO places (id, title, description, price, latitude, longitude, owner_id, created_at, updated_at)
VALUES 
    (
        'place-001',
        'Beautiful Apartment in City Center',
        'A lovely 2-bedroom apartment with modern amenities in the heart of the city.',
        100.00,
        40.7128,
        -74.0060,
        '550e8400-e29b-41d4-a716-446655440000',
        datetime('now'),
        datetime('now')
    ),
    (
        'place-002',
        'Cozy Studio Near Beach',
        'Perfect studio apartment just 5 minutes walk from the beach.',
        75.50,
        25.7617,
        -80.1918,
        '550e8400-e29b-41d4-a716-446655440000',
        datetime('now'),
        datetime('now')
    ),
    (
        'place-003',
        'Luxury Villa with Pool',
        'Spacious villa with private pool and garden. Perfect for families.',
        250.00,
        34.0522,
        -118.2437,
        '550e8400-e29b-41d4-a716-446655440001',
        datetime('now'),
        datetime('now')
    );

-- Associate places with amenities
INSERT OR IGNORE INTO place_amenity (place_id, amenity_id)
VALUES 
    ('place-001', 'amenity-001'), -- Beautiful Apartment - WiFi
    ('place-001', 'amenity-003'), -- Beautiful Apartment - Parking
    ('place-001', 'amenity-004'), -- Beautiful Apartment - Air Conditioning
    ('place-001', 'amenity-005'), -- Beautiful Apartment - Kitchen
    
    ('place-002', 'amenity-001'), -- Cozy Studio - WiFi
    ('place-002', 'amenity-004'), -- Cozy Studio - Air Conditioning
    ('place-002', 'amenity-006'), -- Cozy Studio - Balcony
    
    ('place-003', 'amenity-001'), -- Luxury Villa - WiFi
    ('place-003', 'amenity-002'), -- Luxury Villa - Swimming Pool
    ('place-003', 'amenity-003'), -- Luxury Villa - Parking
    ('place-003', 'amenity-004'), -- Luxury Villa - Air Conditioning
    ('place-003', 'amenity-005'), -- Luxury Villa - Kitchen
    ('place-003', 'amenity-007'); -- Luxury Villa - Gym

-- Insert reviews
INSERT OR IGNORE INTO reviews (id, text, rating, user_id, place_id, created_at, updated_at)
VALUES 
    (
        'review-001',
        'Amazing place! Very clean and comfortable. The location is perfect.',
        5,
        '550e8400-e29b-41d4-a716-446655440001',
        'place-001',
        datetime('now'),
        datetime('now')
    ),
    (
        'review-002',
        'Great studio, exactly as described. Beach is really close!',
        4,
        '550e8400-e29b-41d4-a716-446655440002',
        'place-002',
        datetime('now'),
        datetime('now')
    ),
    (
        'review-003',
        'Wonderful villa! Kids loved the pool. Highly recommended.',
        5,
        '550e8400-e29b-41d4-a716-446655440002',
        'place-003',
        datetime('now'),
        datetime('now')
    ),
    (
        'review-004',
        'Good value for money. Some minor issues but overall satisfied.',
        3,
        '550e8400-e29b-41d4-a716-446655440001',
        'place-002',
        datetime('now'),
        datetime('now')
    );
