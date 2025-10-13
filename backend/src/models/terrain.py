from .render_object import RenderObject


class Terrain(RenderObject):
    name_visible: bool = False

class DirtTile(Terrain):
    name: str = "Dirt tile"
    object_id: str = "dirt_tile"
    texture: str = "tiles/dirt"