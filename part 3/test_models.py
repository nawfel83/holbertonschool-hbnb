#!/usr/bin/env python3
"""
Test script for HBnB models
This script tests the SQLAlchemy models and their relationships
"""
import os
import sys

# Add the project root directory to Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app, db
from app.models.user import User
from app.models.amenity import Amenity
from app.models.place import Place
from app.models.review import Review

def test_models():
    """Test all models and their relationships"""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.drop_all()
        db.create_all()
        
        print("=== Testing HBnB Models ===\n")
        
        # Test User model
        print("1. Testing User Model...")
        user = User()
        user.email = "test@example.com"
        user.first_name = "Test"
        user.last_name = "User"
        user.hash_password("testpassword")
        user.is_admin = False
        user.save()
        
        print(f"   Created user: {user.first_name} {user.last_name} ({user.email})")
        print(f"   User ID: {user.id}")
        print(f"   Password verification: {user.verify_password('testpassword')}")
        
        # Test Amenity model
        print("\n2. Testing Amenity Model...")
        amenity1 = Amenity()
        amenity1.name = "WiFi"
        amenity1.save()
        
        amenity2 = Amenity()
        amenity2.name = "Pool"
        amenity2.save()
        
        print(f"   Created amenities: {amenity1.name}, {amenity2.name}")
        
        # Test Place model
        print("\n3. Testing Place Model...")
        place = Place()
        place.title = "Test Apartment"
        place.description = "A nice place for testing"
        place.price = 100.50
        place.latitude = 40.7128
        place.longitude = -74.0060
        place.owner_id = user.id
        
        # Add amenities to place
        place.amenities.append(amenity1)
        place.amenities.append(amenity2)
        place.save()
        
        print(f"   Created place: {place.title}")
        print(f"   Place ID: {place.id}")
        print(f"   Price: ${place.price}")
        print(f"   Owner: {place.owner.first_name} {place.owner.last_name}")
        print(f"   Amenities: {[a.name for a in place.amenities]}")
        
        # Test Review model
        print("\n4. Testing Review Model...")
        review = Review()
        review.text = "Great place to stay!"
        review.rating = 5
        review.user_id = user.id
        review.place_id = place.id
        review.save()
        
        print(f"   Created review: {review.text}")
        print(f"   Rating: {review.rating}/5")
        print(f"   Reviewer: {review.user.first_name} {review.user.last_name}")
        print(f"   Place: {review.place.title}")
        
        # Test relationships
        print("\n5. Testing Relationships...")
        
        # User -> Places
        user_places = user.places
        print(f"   User's places: {[p.title for p in user_places]}")
        
        # User -> Reviews
        user_reviews = user.reviews
        print(f"   User's reviews: {len(user_reviews)} review(s)")
        
        # Place -> Reviews
        place_reviews = place.reviews
        print(f"   Place reviews: {[r.text[:30] + '...' for r in place_reviews]}")
        
        # Place -> Amenities
        place_amenities = place.amenities
        print(f"   Place amenities: {[a.name for a in place_amenities]}")
        
        # Test model methods
        print("\n6. Testing Model Methods...")
        
        # Test to_dict method
        user_dict = user.to_dict()
        print(f"   User dict keys: {list(user_dict.keys())}")
        print(f"   Password in dict: {'password' in user_dict}")  # Should be False
        
        place_dict = place.to_dict()
        print(f"   Place dict has amenities: {'amenities' in place_dict}")
        print(f"   Place dict has reviews: {'reviews' in place_dict}")
        
        # Test update method
        print("\n7. Testing Update Methods...")
        original_name = user.first_name
        user.update({'first_name': 'Updated'})
        print(f"   User name changed from '{original_name}' to '{user.first_name}'")
        
        original_price = place.price
        place.update({'price': 150.00})
        print(f"   Place price changed from ${original_price} to ${place.price}")
        
        # Test validation
        print("\n8. Testing Validation...")
        
        try:
            invalid_place = Place()
            invalid_place.title = "Invalid Place"
            invalid_place.price = -50  # Invalid negative price
            invalid_place.latitude = 40.7128
            invalid_place.longitude = -74.0060
            invalid_place.owner_id = user.id
            invalid_place.save()
            print("   ERROR: Negative price was allowed!")
        except ValueError as e:
            print(f"   ✓ Price validation works: {e}")
        
        try:
            invalid_review = Review()
            invalid_review.text = "Invalid review"
            invalid_review.rating = 6  # Invalid rating > 5
            invalid_review.user_id = user.id
            invalid_review.place_id = place.id
            invalid_review.save()
            print("   ERROR: Invalid rating was allowed!")
        except ValueError as e:
            print(f"   ✓ Rating validation works: {e}")
        
        # Test queries
        print("\n9. Testing Database Queries...")
        
        all_users = User.query.all()
        print(f"   Total users in database: {len(all_users)}")
        
        all_places = Place.query.all()
        print(f"   Total places in database: {len(all_places)}")
        
        user_by_email = User.query.filter_by(email="test@example.com").first()
        print(f"   Found user by email: {user_by_email.first_name if user_by_email else 'None'}")
        
        high_rated_reviews = Review.query.filter(Review.rating >= 5).all()
        print(f"   High rated reviews (5 stars): {len(high_rated_reviews)}")
        
        print("\n=== All tests completed successfully! ===")

if __name__ == '__main__':
    test_models()
