from .render_object import RenderObject


class Entity(RenderObject):
    type: str = "entity"
    max_hp: int
    current_hp: int
