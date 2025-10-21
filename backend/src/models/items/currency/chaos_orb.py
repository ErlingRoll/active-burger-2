from __future__ import annotations
from typing import TYPE_CHECKING

from src.models.item import Rarity
from .currency import Currency

if TYPE_CHECKING:
    from src.models import Equipment


class ChaosOrb(Currency):
    item_id: str = "chaos_orb"
    name: str = "Chaos Orb"
    description: str = "Use at crafting bench to re-roll mods of equipment"
    texture: str = "item/currency/chaos_orb"
    value: int = 20
    rarity: Rarity = Rarity.RARE

    def apply_to(self, equipment: Equipment) -> Equipment:

        return equipment
