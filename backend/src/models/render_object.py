import json


class RenderObject:

    # Characters, Objects, NPCs, etc.

    id: str
    created_at: str
    name: str
    name_visible: bool = True
    x: int
    y: int
    texture: str
    height: int  # in pixels
    width: int  # in pixels
    solid: bool = False

    def __init__(self, id, created_at, name, name_visible, x, y, texture, height, width, solid):
        self.id = id
        self.created_at = created_at
        self.name = name
        self.name_visible = name_visible
        self.x = x
        self.y = y
        self.texture = texture
        self.height = height
        self.width = width
        self.solid = solid

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
