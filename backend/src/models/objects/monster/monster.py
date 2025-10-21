from src.models import Entity
from src.models.objects.loot_table import Lootable
from src.models.damage_hit import DamageHit


class Monster(Entity, Lootable):
    type: str = "monster"
    solid: bool = True
    name_visible: bool = True

    def damage(self, damage_hit: DamageHit):
        total_damage = damage_hit.total_damage()
        self.current_hp -= total_damage
        if self.current_hp < 0:
            self.current_hp = 0

    def roll_loot(self, fortune: int = 0):
        return self.loot_table.roll_loot(fortune=fortune)
