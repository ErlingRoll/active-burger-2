from typing import List
from pydantic import BaseModel
from random import random, randint
from src.generators.item import generate_item
from src.models.item import Item


class LootTableItem(BaseModel):
    item_id: str
    chance: float  # 0.0 to 1.0
    amount: int  # Alyways drop this amount
    random_amount: int  # Additionally drop up to this amount


class LootTable(BaseModel):
    items: List[LootTableItem]

    def roll_loot(self) -> List[Item]:
        dropped_items = []
        for item in self.items:
            roll = random()
            if roll <= item.chance:
                total_amount = item.amount + randint(0, item.random_amount)
                item = generate_item(item_id=item.item_id, count=total_amount)
                dropped_items.append(item)

        return dropped_items
