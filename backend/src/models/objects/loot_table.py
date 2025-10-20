from typing import List, Optional
from pydantic import BaseModel
from random import random, randint
from src.generators.item import generate_item
from src.models.item import Item


class LootTableItem(BaseModel):
    item_id: str
    chance: float  # 0.0 to 1.0
    amount: int  # Always drop this amount
    random_amount: Optional[int] = 0  # Additionally drop up to this amount


class LootTable(BaseModel):
    items: List[LootTableItem]

    def roll_loot(self) -> List[Item]:
        dropped_items = []
        for item in self.items:
            roll = random()
            random_amount = randint(0, item.random_amount if item.random_amount else 0)
            if roll <= item.chance:
                total_amount = item.amount + randint(0, random_amount)
                item = generate_item(item_id=item.item_id, count=total_amount)
                dropped_items.append(item)

        return dropped_items


class Lootable(BaseModel):
    loot_table: LootTable

    def roll_loot(self) -> List[Item]:
        raise NotImplementedError("roll_loot must be implemented by subclasses")
