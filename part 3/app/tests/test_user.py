import unittest
import uuid
from app import create_app, db
from app.models.user import User
from app.services.facade import HBnBFacade

class TestUser(unittest.TestCase):
    """Test cases for User model"""

    def setUp(self):
        """Set up test fixtures before each test method"""
        # Créer l'application Flask avec contexte
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        
        # Créer les tables
        db.create_all()
        
        self.user_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'securepassword123'
        }
        
        self.user = User(
            id=str(uuid.uuid4()),
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name'],
            email=self.user_data['email'],
            password=self.user_data['password']
        )

    def tearDown(self):
        """Tear down test fixtures after each test method"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_user_creation(self):
        """Test user creation with valid data"""
        self.assertEqual(self.user.first_name, 'John')
        self.assertEqual(self.user.last_name, 'Doe')
        self.assertEqual(self.user.email, 'john.doe@example.com')
        self.assertIsNotNone(self.user.id)

    def test_user_attributes(self):
        """Test user attributes are correctly set"""
        self.assertEqual(self.user.first_name, 'John')
        self.assertEqual(self.user.last_name, 'Doe')
        self.assertEqual(self.user.email, 'john.doe@example.com')
        self.assertIsInstance(self.user.id, str)

    def test_password_hashing(self):
        """Test password is hashed and can be verified"""
        self.assertTrue(self.user.check_password('securepassword123'))
        self.assertFalse(self.user.check_password('wrongpassword'))

    def test_email_validation(self):
        """Test email validation"""
        with self.assertRaises(ValueError):
            User(
                id=str(uuid.uuid4()),
                first_name='John',
                last_name='Doe',
                email='invalid-email',
                password='password123'
            )

    def test_user_update(self):
        """Test user update method"""
        update_data = {
            'first_name': 'Jane',
            'last_name': 'Smith'
        }
        self.user.update(update_data)
        
        self.assertEqual(self.user.first_name, 'Jane')
        self.assertEqual(self.user.last_name, 'Smith')

    def test_user_id_unique(self):
        """Test that user IDs are unique"""
        user1 = User(
            first_name='User1',
            last_name='Test',
            email='user1@test.com',
            password='password123'
        )
        user2 = User(
            first_name='User2',
            last_name='Test',
            email='user2@test.com',
            password='password123'
        )
        self.assertNotEqual(user1.id, user2.id)


class TestUserFacade(unittest.TestCase):
    """Test cases for User operations through facade"""

    def setUp(self):
        """Set up test fixtures before each test method"""
        # Créer l'application Flask avec contexte
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        
        # Créer les tables
        db.create_all()
        
        self.facade = HBnBFacade()
        self.user_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'securepassword123'
        }

    def tearDown(self):
        """Tear down test fixtures after each test method"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_create_user_facade(self):
        """Test user creation through facade"""
        user = self.facade.create_user(self.user_data)
        self.assertIsNotNone(user)
        self.assertEqual(user.email, 'john.doe@example.com')
        self.assertEqual(user.first_name, 'John')

    def test_get_user_facade(self):
        """Test getting user by ID through facade"""
        created_user = self.facade.create_user(self.user_data)
        retrieved_user = self.facade.get_user(created_user.id)
        
        self.assertIsNotNone(retrieved_user)
        self.assertEqual(retrieved_user.id, created_user.id)
        self.assertEqual(retrieved_user.email, created_user.email)

    def test_get_all_users_facade(self):
        """Test getting all users through facade"""
        user1 = self.facade.create_user(self.user_data)
        user2_data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane.smith@example.com',
            'password': 'anothersecurepassword'
        }
        user2 = self.facade.create_user(user2_data)
        
        all_users = self.facade.get_all_users()
        self.assertEqual(len(all_users), 2)
        self.assertIn(user1, all_users)
        self.assertIn(user2, all_users)

    def test_update_user_facade(self):
        """Test updating user through facade"""
        created_user = self.facade.create_user(self.user_data)
        update_data = {
            'first_name': 'Updated John',
            'last_name': 'Updated Doe'
        }
        
        updated_user = self.facade.update_user(created_user.id, update_data)
        
        self.assertIsNotNone(updated_user)
        self.assertEqual(updated_user.first_name, 'Updated John')
        self.assertEqual(updated_user.last_name, 'Updated Doe')

    def test_get_nonexistent_user(self):
        """Test getting a user that doesn't exist"""
        fake_id = str(uuid.uuid4())
        user = self.facade.get_user(fake_id)
        self.assertIsNone(user)

    def test_update_nonexistent_user(self):
        """Test updating a user that doesn't exist"""
        fake_id = str(uuid.uuid4())
        update_data = {'first_name': 'Updated Name'}
        result = self.facade.update_user(fake_id, update_data)
        self.assertIsNone(result)


if __name__ == '__main__':
    unittest.main()
