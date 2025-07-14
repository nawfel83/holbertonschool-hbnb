-- Ajouter au début du fichier :
-- =================================
-- CRUD OPERATIONS TEST SCRIPT
-- =================================
SET @test_start = NOW();
SELECT 'Starting CRUD operations test...' as Status, @test_start as Timestamp;

-- Modifier l'insertion d'utilisateur :
INSERT INTO users (id, email, password, first_name, last_name, is_admin, created_at, updated_at)
VALUES ('test-user-001', 'test@example.com', 'hashed_password', 'Test', 'User', FALSE, NOW(), NOW());

-- Modifier l'insertion de lieu :
INSERT INTO places (id, title, description, price, latitude, longitude, owner_id, created_at, updated_at)
VALUES ('test-place-001', 'Test Apartment', 'A nice test apartment', 100.0, 40.7128, -74.0060, 'test-user-001', NOW(), NOW());

-- Modifier l'insertion d'avis :
INSERT INTO reviews (id, text, rating, user_id, place_id, created_at, updated_at)
VALUES ('test-review-001', 'Great place!', 5, 'test-user-001', 'test-place-001', NOW(), NOW());

-- Ajouter à la fin :
-- Vérification finale
SELECT 'CRUD test completed successfully!' as Status, 
       TIMEDIFF(NOW(), @test_start) as Duration;

SELECT 'Final record counts:' as Summary;
SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Places', COUNT(*) FROM places
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Amenities', COUNT(*) FROM amenities
UNION ALL
SELECT 'Place_Amenity', COUNT(*) FROM place_amenity;
