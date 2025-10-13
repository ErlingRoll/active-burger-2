
from typing import ClassVar
from src.models import Entity
from src.models.objects.drop_table import LootTable


class Ore(Entity):
    type: str = "entity"
    solid: bool = True
    name_visible: bool = False

    def roll_loot(self):
        raise NotImplementedError("roll_loot must be implemented by subclasses")


class GoldOre(Ore):
    name: str = "Gold Ore"
    object_id: str = "gold_ore"
    texture: str = "terrain/ore/gold"
    max_hp: int = 70
    current_hp: int = 70

    loot_table: ClassVar[LootTable] = LootTable(
        items=[
            {
                "item_id": "gold_ore",
                "chance": 1.0,
                "amount": 1,
                "random_amount": 2,
            }
        ]
    )

    def roll_loot(self):
        return self.loot_table.roll_loot()
