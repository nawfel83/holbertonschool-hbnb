class Place:
    def __init__(self, id, name, location, owner_id):
        self.id = id
        self.name = name
        self.location = location
        self.owner_id = owner_id

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
