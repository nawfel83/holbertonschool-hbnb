class Review:
    def __init__(self, id, user_id, place_id, text):
        self.id = id
        self.user_id = user_id
        self.place_id = place_id
        self.text = text

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
