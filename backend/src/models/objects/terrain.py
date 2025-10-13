
from src.models.render_object import RenderObject


class Terrain(RenderObject):
    name_visible: bool = False
    solid: bool = True


class Rock(Terrain):
    name: str = "Rock"
    object_id: str = "rock"
    texture: str = "terrain/rock"


class Bush(Terrain):
    name: str = "Bush"
    object_id: str = "bush"
    texture: str = "terrain/bush"
