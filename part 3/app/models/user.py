from app import bcrypt

class User:
    def __init__(self, id, email, password, first_name, last_name):
        self.id = id
        self.email = email
        self.password = None
        self.hash_password(password)
        self.first_name = first_name
        self.last_name = last_name

    def hash_password(self, password):
        """Hashes the password before storing it."""
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verifies if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password, password)

    def update(self, data):
        for key, value in data.items():
            # Never allow direct password update here
            if key not in ['password']:
                setattr(self, key, value)
