-- Test CRUD operations for HBnB database
-- This script demonstrates basic CRUD operations

-- ===================
-- READ OPERATIONS
-- ===================

-- Get all users
SELECT 'All Users:' as operation;
SELECT id, email, first_name, last_name, is_admin, created_at FROM users;

-- Get all amenities
SELECT 'All Amenities:' as operation;
SELECT * FROM amenities;

-- Get all places with owner information
SELECT 'All Places with Owner Info:' as operation;
SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.latitude,
    p.longitude,
    u.first_name || ' ' || u.last_name as owner_name,
    u.email as owner_email
FROM places p
JOIN users u ON p.owner_id = u.id;

-- Get places with their amenities
SELECT 'Places with Amenities:' as operation;
SELECT 
    p.title as place_title,
    a.name as amenity_name
FROM places p
JOIN place_amenity pa ON p.id = pa.place_id
JOIN amenities a ON pa.amenity_id = a.id
ORDER BY p.title, a.name;

-- Get reviews with user and place information
SELECT 'Reviews with Details:' as operation;
SELECT 
    r.text,
    r.rating,
    u.first_name || ' ' || u.last_name as reviewer_name,
    p.title as place_title,
    r.created_at
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN places p ON r.place_id = p.id
ORDER BY r.created_at DESC;

-- ===================
-- CREATE OPERATIONS
-- ===================

-- Create a new user
INSERT INTO users (id, email, first_name, last_name, password, is_admin, created_at, updated_at)
VALUES (
    'test-user-001',
    'test@example.com',
    'Test',
    'User',
    '$2b$12$GRLdnjyJ0yEtC3xvvNM7.O6X8mxLtRAqmq8Y6Q6Y6Q6Y6Q6Y6Q6Y6',
    FALSE,
    datetime('now'),
    datetime('now')
);

-- Create a new amenity
INSERT INTO amenities (id, name, created_at, updated_at)
VALUES ('test-amenity-001', 'Hot Tub', datetime('now'), datetime('now'));

-- Create a new place
INSERT INTO places (id, title, description, price, latitude, longitude, owner_id, created_at, updated_at)
VALUES (
    'test-place-001',
    'Test Mountain Cabin',
    'A cozy cabin in the mountains for testing purposes.',
    120.00,
    39.7392,
    -104.9903,
    'test-user-001',
    datetime('now'),
    datetime('now')
);

-- Associate the new place with an amenity
INSERT INTO place_amenity (place_id, amenity_id)
VALUES ('test-place-001', 'test-amenity-001');

-- Create a new review
INSERT INTO reviews (id, text, rating, user_id, place_id, created_at, updated_at)
VALUES (
    'test-review-001',
    'This is a test review for the mountain cabin.',
    4,
    '550e8400-e29b-41d4-a716-446655440001',
    'test-place-001',
    datetime('now'),
    datetime('now')
);

-- ===================
-- UPDATE OPERATIONS
-- ===================

-- Update user information
UPDATE users 
SET first_name = 'Updated Test', updated_at = datetime('now')
WHERE id = 'test-user-001';

-- Update place price
UPDATE places 
SET price = 130.00, updated_at = datetime('now')
WHERE id = 'test-place-001';

-- Update review rating
UPDATE reviews 
SET rating = 5, text = 'Updated review: Excellent mountain cabin!', updated_at = datetime('now')
WHERE id = 'test-review-001';

-- ===================
-- VERIFICATION QUERIES
-- ===================

-- Verify updates
SELECT 'Updated Test User:' as operation;
SELECT id, email, first_name, last_name FROM users WHERE id = 'test-user-001';

SELECT 'Updated Test Place:' as operation;
SELECT id, title, price FROM places WHERE id = 'test-place-001';

SELECT 'Updated Test Review:' as operation;
SELECT id, text, rating FROM reviews WHERE id = 'test-review-001';

-- ===================
-- DELETE OPERATIONS
-- ===================

-- Delete the test review
DELETE FROM reviews WHERE id = 'test-review-001';

-- Delete the place-amenity association
DELETE FROM place_amenity WHERE place_id = 'test-place-001';

-- Delete the test place
DELETE FROM places WHERE id = 'test-place-001';

-- Delete the test amenity
DELETE FROM amenities WHERE id = 'test-amenity-001';

-- Delete the test user
DELETE FROM users WHERE id = 'test-user-001';

-- ===================
-- FINAL VERIFICATION
-- ===================

-- Verify deletions
SELECT 'Test data should be gone:' as operation;
SELECT COUNT(*) as remaining_test_users FROM users WHERE id = 'test-user-001';
SELECT COUNT(*) as remaining_test_places FROM places WHERE id = 'test-place-001';
SELECT COUNT(*) as remaining_test_reviews FROM reviews WHERE id = 'test-review-001';
SELECT COUNT(*) as remaining_test_amenities FROM amenities WHERE id = 'test-amenity-001';

-- Show final state
SELECT 'Final Database State:' as operation;
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Places:', COUNT(*) FROM places
UNION ALL
SELECT 'Reviews:', COUNT(*) FROM reviews
UNION ALL
SELECT 'Amenities:', COUNT(*) FROM amenities;
