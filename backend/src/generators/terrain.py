
from src.models.terrain.terrain import Terrain, Grass, Water, Sandstone

terrain_map = {
    "grass": Grass,
    "water": Water,
    "sandstone": Sandstone
}


def generate_terrain(game_id, **kwargs) -> Terrain:
    object_class = terrain_map.get(game_id)
    if object_class:
        return object_class.model_construct(**kwargs)
    else:
        raise ValueError(f"Unknown game_id: {game_id}")
