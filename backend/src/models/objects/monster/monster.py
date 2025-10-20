
from src.models import Entity
from src.models.objects.loot_table import Lootable, LootTable, LootTableItem
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

    def roll_loot(self):
        return self.loot_table.roll_loot()


class KaratePanda(Monster):
    name: str = "Karate Panda"
    object_id: str = "karate_panda"
    texture: str = "monster/karate_panda"
    max_hp: int = 35
    current_hp: int = 35
    power: int = 7
    expDrop: int = 29
    loot_table: LootTable = LootTable(
        items=[
            LootTableItem(
                item_id="gold_ore",
                chance=1.0,
                amount=1,
                random_amount=2,
            )
        ]
    )
