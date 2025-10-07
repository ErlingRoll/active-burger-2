from .hp_object import HpObject


class Character(HpObject):

    account_id: str
    type: str = "character"
    direction: str = "right"

    def __init__(self, id, account_id, created_at, name, name_visible=True, x=0, y=0, texture="", height=32, width=32, solid=False, max_hp=100, current_hp=100, type="character", direction="right"):
        super().__init__(id, created_at, name, name_visible, x, y, texture, height, width, solid, max_hp, current_hp, type)
        self.account_id = account_id
        self.direction = direction
