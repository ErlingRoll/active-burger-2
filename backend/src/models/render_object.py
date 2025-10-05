import json


class RenderObject:

    id: str
    created_at: str
    name: str
    x: int
    y: int

    def __init__(self, id, created_at, name, x, y):
        self.id = id
        self.created_at = created_at
        self.name = name
        self.x = x
        self.y = y

    def get_attributes(self):
        # Get all attributes that are not callable (i.e. not methods)
        return {
            k: v
            for k, v in self.__dict__.items()
            if not callable(v)
        }

    def to_dict(self):
        return self.get_attributes()

    def to_json_string(self):
        return json.dumps(self.to_dict())
