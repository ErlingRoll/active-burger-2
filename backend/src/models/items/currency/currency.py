from src.models.equipment import Equipment
from src.models.item import Item


class Currency(Item):
    type: str = "currency"
    stackable: bool = True
    count: int = 1

    def apply_to(self, equipment: Equipment) -> Equipment:
        raise NotImplementedError("This method should be overridden by subclasses")
