
from src.models.render_object import RenderObject
from src.models.objects.entity.ore.gold_ore import GoldOre
from src.models.terrain import DirtTile

object_map = {
    "gold_ore": GoldOre,
    "dirt_tile": DirtTile
}


def generate_object(object_id, **kwargs) -> RenderObject:
    object_class = object_map.get(object_id)
    if object_class:
        return object_class(**kwargs)
    else:
        raise ValueError(f"Unknown object_id: {object_id}")
