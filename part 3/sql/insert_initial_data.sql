-- Script SQL pour insérer les données initiales
-- Ce script ajoute un utilisateur administrateur et des équipements de base

-- Insertion d'un utilisateur administrateur
INSERT INTO users (id, email, password, first_name, last_name)
VALUES (
    'admin-001', 
    'admin@hbnb.com', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiKy8YrsVr9W', -- "admin123" hashed
    'Admin',
    'User'
) ON CONFLICT (email) DO NOTHING;

-- Insertion des équipements de base
INSERT INTO amenities (id, name) VALUES
    ('amenity-001', 'WiFi'),
    ('amenity-002', 'Parking'),
    ('amenity-003', 'Air Conditioning'),
    ('amenity-004', 'Kitchen'),
    ('amenity-005', 'Washing Machine'),
    ('amenity-006', 'TV'),
    ('amenity-007', 'Pool'),
    ('amenity-008', 'Gym'),
    ('amenity-009', 'Pet Friendly'),
    ('amenity-010', 'Balcony')
ON CONFLICT (name) DO NOTHING;
