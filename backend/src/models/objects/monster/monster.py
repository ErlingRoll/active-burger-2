
from src.models import Entity
from src.models.objects.drop_table import Lootable, LootTable, LootTableItem


class Monster(Entity, Lootable):
    solid: bool = True
    name_visible: bool = True


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
