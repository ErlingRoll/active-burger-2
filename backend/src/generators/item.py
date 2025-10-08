
from src.models.item import Item
from src.models.items.base.burger import Burger

item_map = {
    "burger": Burger
}


def generate_item(item_id) -> Item:
    item_class = item_map.get(item_id)
    if item_class:
        return item_class()
    else:
        raise ValueError(f"Unknown item_id: {item_id}")
