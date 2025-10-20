from src.models.item import Item
from src.models.items import Burger, GoldOre, Pickaxe, Toothpick

item_map = {
    "burger": Burger,
    "gold_ore": GoldOre,
    "pickaxe": Pickaxe,
    "toothpick": Toothpick,
}


def generate_item(item_id, **kwargs) -> Item:
    item_class = item_map.get(item_id)
    if item_class:
        return item_class(**kwargs)
    else:
        raise ValueError(f"Unknown item_id: {item_id}")
