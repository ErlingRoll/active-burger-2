from .render_object import RenderObject


class HpObject(RenderObject):

    max_hp: int
    current_hp: int

    def __init__(self, id, created_at, name, name_visible, x, y, texture, height, width, solid, max_hp, current_hp, type="hp_object"):
        super().__init__(id, created_at, name, name_visible, x, y, texture, height, width, solid, type)
        self.max_hp = max_hp
        self.current_hp = current_hp
