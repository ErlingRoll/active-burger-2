
from src.models.terrain.terrain import Bush, Color, Rock, Terrain, Grass, Water, Sandstone, WaterWave, WoodPost, RockFloor, Woodplank,Dirt
terrain_map = {
    "color": Color,
    "wood_post": WoodPost,
    "grass": Grass,
    "water": Water,
    "water_wave": WaterWave,
    "sandstone": Sandstone,
    "rock": Rock,
    "rock_floor": RockFloor,
    "bush": Bush,
    "woodplank":Woodplank,
    "dirt":Dirt,
    
}


def generate_terrain(game_id, **kwargs) -> Terrain:
    object_class = terrain_map.get(game_id)
    if object_class:
        return object_class.model_construct(**kwargs)
    else:
        raise ValueError(f"Unknown game_id: {game_id}")
