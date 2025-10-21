from __future__ import annotations
from typing import TYPE_CHECKING

from src.models.item import Rarity
from .currency import Currency

if TYPE_CHECKING:
    from src.models import Equipment


class AlchemyOrb(Currency):
    item_id: str = "alchemy_orb"
    name: str = "Alchemy Orb"
    description: str = "Use at crafting bench to upgrade a normal item to a rare item"
    texture: str = "item/currency/alchemy_orb"
    value: int = 10
    rarity: Rarity = Rarity.UNCOMMON

    def apply_to(self, equipment: Equipment) -> Equipment:

        return equipment
