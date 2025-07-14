-- Ajouter après l'insertion de l'admin :
INSERT INTO users (id, email, password, first_name, last_name, is_admin, created_at, updated_at)
VALUES (
    'admin-001', 
    'admin@hbnb.com', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiKy8YrsVr9W',
    'Admin',
    'User',
    TRUE,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE email = email;

-- Ajouter après les amenities :
-- Insertion d'utilisateurs de test
INSERT INTO users (id, email, password, first_name, last_name, is_admin, created_at, updated_at) VALUES
('user-001', 'john.doe@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiKy8YrsVr9W', 'John', 'Doe', FALSE, NOW(), NOW()),
('user-002', 'jane.smith@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiKy8YrsVr9W', 'Jane', 'Smith', FALSE, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = email;

-- Insertion de lieux de test
INSERT INTO places (id, title, description, price, latitude, longitude, owner_id, created_at, updated_at) VALUES
('place-001', 'Cozy Apartment', 'Beautiful downtown apartment', 150.00, 40.7128, -74.0060, 'user-001', NOW(), NOW()),
('place-002', 'Beach House', 'Relaxing beach house with ocean view', 300.00, 25.7617, -80.1918, 'user-002', NOW(), NOW())
ON DUPLICATE KEY UPDATE title = title;

-- Association lieux-équipements
INSERT INTO place_amenity (place_id, amenity_id) VALUES
('place-001', 'amenity-001'),  -- WiFi
('place-001', 'amenity-004'),  -- Kitchen
('place-002', 'amenity-001'),  -- WiFi
('place-002', 'amenity-007'),  -- Pool
('place-002', 'amenity-002')   -- Parking
ON DUPLICATE KEY UPDATE place_id = place_id;

-- Insertion d'avis de test
INSERT INTO reviews (id, text, rating, user_id, place_id, created_at, updated_at) VALUES
('review-001', 'Amazing place! Highly recommended.', 5, 'user-002', 'place-001', NOW(), NOW()),
('review-002', 'Great location and beautiful view.', 4, 'user-001', 'place-002', NOW(), NOW())
ON DUPLICATE KEY UPDATE text = text;
