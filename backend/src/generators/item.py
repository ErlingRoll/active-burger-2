from src.models.item import Item
from src.models.items import Burger, GoldOre, Pickaxe
from src.models.items.weapon import Toothpick, FryingPan, PoolNoodle

food_map = {
    "burger": Burger,
}

weapon_map = {
    "toothpick": Toothpick,
    "pool_noodle": PoolNoodle,
    "frying_pan": FryingPan,
}

resource_map = {
    "gold_ore": GoldOre,
}

tool_map = {
    "pickaxe": Pickaxe,
}

item_map = {**food_map, **weapon_map, **resource_map, **tool_map}


def generate_item(item_id, **kwargs) -> Item:
    item_class = item_map.get(item_id)
    if item_class:
        return item_class(**kwargs)
    else:
        raise ValueError(f"Unknown item_id: {item_id}")
