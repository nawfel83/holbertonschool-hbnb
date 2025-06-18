class User:
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
