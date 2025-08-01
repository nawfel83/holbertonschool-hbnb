from app.models.user import User
from app.models.amenity import Amenity
from app.models.place import Place
from app.models.review import Review
from app import db


class HBnBFacade:
    """Facade class for HBnB application using SQLAlchemy ORM"""

    # USER METHODS
    def create_user(self, data):
        """Create a new user"""
        user = User()
        user.email = data['email']
        user.first_name = data.get('first_name', '')
        user.last_name = data.get('last_name', '')
        user.hash_password(data['password'])
        user.is_admin = data.get('is_admin', False)
        
        db.session.add(user)
        db.session.commit()
        return user

    def get_user(self, user_id):
        """Get a user by ID"""
        return User.query.get(user_id)

    def get_user_by_email(self, email):
        """Get a user by email"""
        return User.query.filter_by(email=email).first()

    def get_all_users(self):
        """Get all users"""
        return User.query.all()

    def update_user(self, user_id, data):
        """Update a user"""
        user = self.get_user(user_id)
        if user:
            user.update(data)
        return user

    def delete_user(self, user_id):
        """Delete a user"""
        user = self.get_user(user_id)
        if user:
            user.delete()
            return True
        return False

    # AMENITY METHODS
    def create_amenity(self, data):
        """Create a new amenity"""
        amenity = Amenity()
        amenity.name = data['name']
        
        db.session.add(amenity)
        db.session.commit()
        return amenity

    def get_amenity(self, amenity_id):
        """Get an amenity by ID"""
        return Amenity.query.get(amenity_id)

    def get_all_amenities(self):
        """Get all amenities"""
        return Amenity.query.all()

    def update_amenity(self, amenity_id, data):
        """Update an amenity"""
        amenity = self.get_amenity(amenity_id)
        if amenity:
            amenity.update(data)
        return amenity

    def delete_amenity(self, amenity_id):
        """Delete an amenity"""
        amenity = self.get_amenity(amenity_id)
        if amenity:
            amenity.delete()
            return True
        return False

    # PLACE METHODS
    def create_place(self, data):
        """Create a new place"""
        # Validate owner exists
        owner = self.get_user(data['owner_id'])
        if not owner:
            raise ValueError("Owner not found")
            
        place = Place()
        place.title = data['title']
        place.description = data.get('description', '')
        place.price = data['price']
        place.latitude = data['latitude']
        place.longitude = data['longitude']
        place.owner_id = data['owner_id']
        
        # Handle amenities
        if 'amenities' in data:
            for amenity_id in data['amenities']:
                amenity = self.get_amenity(amenity_id)
                if amenity:
                    place.amenities.append(amenity)
        
        db.session.add(place)
        db.session.commit()
        return place

    def get_place(self, place_id):
        """Get a place by ID"""
        return Place.query.get(place_id)

    def get_all_places(self):
        """Get all places"""
        return Place.query.all()

    def update_place(self, place_id, data):
        """Update a place"""
        place = self.get_place(place_id)
        if not place:
            return None
            
        # Handle amenities separately
        if 'amenities' in data:
            place.amenities.clear()
            for amenity_id in data['amenities']:
                amenity = self.get_amenity(amenity_id)
                if amenity:
                    place.amenities.append(amenity)
            del data['amenities']
        
        place.update(data)
        return place

    def delete_place(self, place_id):
        """Delete a place"""
        place = self.get_place(place_id)
        if place:
            place.delete()
            return True
        return False

    # REVIEW METHODS
    def create_review(self, data):
        """Create a new review"""
        # Validate user and place exist
        user = self.get_user(data['user_id'])
        place = self.get_place(data['place_id'])
        if not user:
            raise ValueError("User not found")
        if not place:
            raise ValueError("Place not found")
            
        review = Review()
        review.text = data['text']
        review.rating = data['rating']
        review.user_id = data['user_id']
        review.place_id = data['place_id']
        
        db.session.add(review)
        db.session.commit()
        return review

    def get_review(self, review_id):
        """Get a review by ID"""
        return Review.query.get(review_id)

    def get_all_reviews(self):
        """Get all reviews"""
        return Review.query.all()

    def get_reviews_by_place(self, place_id):
        """Get all reviews for a specific place"""
        return Review.query.filter_by(place_id=place_id).all()

    def update_review(self, review_id, data):
        """Update a review"""
        review = self.get_review(review_id)
        if review:
            review.update(data)
        return review

    def delete_review(self, review_id):
        """Delete a review"""
        review = self.get_review(review_id)
        if review:
            review.delete()
            return True
        return False
        if not review:
            return None
        self.review_repo.update(review_id, data)
        return self.get_review(review_id)

    def delete_review(self, review_id):
        review = self.review_repo.get(review_id)
        if not review:
            return False
        self.review_repo.delete(review_id)
        return True

    def get_user_by_email(self, email):
        return self.user_repo.get_by_attribute('email', email)
