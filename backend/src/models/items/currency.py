from src.models.equipment import Equipment
from src.models.item import Item


class Currency(Item):
    type: str = "currency"
    stackable: bool = True
    count: int = 1

    def apply(self, item: Equipment) -> Equipment:
        raise NotImplementedError("This method should be overridden by subclasses")


class ChaosOrb(Currency):
    item_id: str = "chaos_orb"
    name: str = "Chaos Orb"
    description: str = "Use at crafting bench to re-roll mods of equipment"
    texture: str = "item/currency/chaos_orb"
    value: int = 10
