# Classe de base pour stocker des objets en mémoire (simule une base de données)

class InMemoryRepository:
    def __init__(self):
        self.objects = {}

    def add(self, obj):
        self.objects[obj.id] = obj
        return obj

    def get(self, obj_id):
        return self.objects.get(obj_id)

    def get_all(self):
        return list(self.objects.values())

    def update(self, obj_id, data):
        obj = self.get(obj_id)
        if obj:
            for key, value in data.items():
                setattr(obj, key, value)
            return obj
        return None
