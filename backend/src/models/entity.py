from .render_object import RenderObject


class Entity(RenderObject):
    type: str = "entity"
    max_hp: int
    current_hp: int

    def damage(self, amount: int):
        self.current_hp -= amount
        if self.current_hp < 0:
            self.current_hp = 0

    def heal(self, amount: int):
        self.current_hp += amount
        if self.current_hp > self.max_hp:
            self.current_hp = self.max_hp

    def is_alive(self) -> bool:
        return self.current_hp > 0

    def roll_damage(self) -> int:
        raise NotImplementedError("roll_damage must be implemented by subclasses")
