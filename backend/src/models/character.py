from .hp_object import HpObject


class Character(HpObject):

    account_id: str

    def __init__(self, id, account_id, created_at, name, name_visible=True, x=0, y=0, texture="", height=32, width=32, solid=False, max_hp=100, current_hp=100):
        super().__init__(id, created_at, name, name_visible, x, y, texture, height, width, solid, max_hp, current_hp)
        self.account_id = account_id
