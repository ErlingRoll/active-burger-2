from typing import List, Optional
from pydantic import BaseModel
from random import randint
from src.generators.dice import roll, roll_chance
from src.generators.item import generate_item
from src.models.item import Item, Rarity


class LootTableItem(BaseModel):
    item_id: str
    chance: float  # 0.0 to 1.0
    amount: int  # Always drop this amount
    random_amount: Optional[int] = 0  # Additionally drop up to this amount


class LootTable(BaseModel):
    items: List[LootTableItem]

    def roll_loot(self, luck=0, fortune=0) -> List[Item]:
        dropped_items = []
        for item in self.items:
            loot_chance_roll = roll_chance(luck=luck)
            random_amount = randint(0, item.random_amount if item.random_amount else 0)
            if loot_chance_roll <= item.chance:
                base_amount = item.amount * (1 + fortune)
                total_amount = base_amount + roll(random_amount, min_value=0, luck=-1)
                item = generate_item(item_id=item.item_id, count=total_amount)
                if item.rarity in [Rarity.EPIC, Rarity.LEGENDARY, Rarity.ARTIFACT]:
                    item.count = 1  # Fortune does not apply to powerful items
                dropped_items.append(item)

        return dropped_items


class Lootable(BaseModel):
    loot_table: LootTable

    def roll_loot(self, luck=0, fortune=0) -> List[Item]:
        raise NotImplementedError("roll_loot must be implemented by subclasses")
