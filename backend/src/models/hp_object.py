from .render_object import RenderObject


class HpObject(RenderObject):

    max_hp: int
    current_hp: int

    def __init__(self, id, created_at, name, x, y, max_hp, current_hp):
        super().__init__(id, created_at, name, x, y)
        self.max_hp = max_hp
        self.current_hp = current_hp
