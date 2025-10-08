from .render_object import RenderObject


class Entity(RenderObject):
    max_hp: int
    current_hp: int
