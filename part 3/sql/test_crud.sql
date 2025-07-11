-- Script de test pour vérifier les opérations CRUD
-- Ce script teste l'insertion, la lecture, la mise à jour et la suppression

-- Test 1: Insertion d'un nouvel utilisateur
INSERT INTO users (id, email, password, first_name, last_name)
VALUES ('test-user-001', 'test@example.com', 'hashed_password', 'Test', 'User');

-- Test 2: Insertion d'un lieu
INSERT INTO places (id, title, description, price, latitude, longitude, owner_id)
VALUES ('test-place-001', 'Test Apartment', 'A nice test apartment', 100.0, 40.7128, -74.0060, 'test-user-001');

-- Test 3: Insertion d'un avis
INSERT INTO reviews (id, text, rating, user_id, place_id)
VALUES ('test-review-001', 'Great place!', 5, 'test-user-001', 'test-place-001');

-- Test 4: Association lieu-équipement
INSERT INTO place_amenity (place_id, amenity_id)
VALUES ('test-place-001', 'amenity-001');

-- Test 5: Lecture des données
SELECT * FROM users WHERE id = 'test-user-001';
SELECT * FROM places WHERE owner_id = 'test-user-001';
SELECT * FROM reviews WHERE place_id = 'test-place-001';

-- Test 6: Lecture avec jointures
SELECT p.title, u.first_name, u.last_name
FROM places p
JOIN users u ON p.owner_id = u.id
WHERE p.id = 'test-place-001';

-- Test 7: Mise à jour d'un lieu
UPDATE places 
SET price = 120.0, description = 'Updated description'
WHERE id = 'test-place-001';

-- Test 8: Vérification de la mise à jour
SELECT title, price, description FROM places WHERE id = 'test-place-001';

-- Test 9: Suppression de données (dans l'ordre pour respecter les contraintes)
DELETE FROM place_amenity WHERE place_id = 'test-place-001';
DELETE FROM reviews WHERE place_id = 'test-place-001';
DELETE FROM places WHERE id = 'test-place-001';
DELETE FROM users WHERE id = 'test-user-001';

-- Test 10: Vérification de la suppression
SELECT COUNT(*) as remaining_test_data 
FROM users 
WHERE id = 'test-user-001';
