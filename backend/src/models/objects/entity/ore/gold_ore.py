
from src.models.entity import Entity


class Ore(Entity):
    type: str = "entity"
    solid: bool = True
    name_visible: bool = False


class GoldOre(Ore):
    name: str = "Gold Ore"
    object_id: str = "gold_ore"
    texture: str = "terrain/ore/gold"
    max_hp: int = 70
    current_hp: int = 70
