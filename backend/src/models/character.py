from .hp_object import HpObject


class Character(HpObject):

    account_id: str

    def __init__(self, id, created_at, name, x, y, max_hp, current_hp, account_id):
        super().__init__(id, created_at, name, x, y, max_hp, current_hp)
        self.account_id = account_id
