from typing import Optional
from pydantic import BaseModel, ConfigDict

from src.generators.world import Realm


class Terrain(BaseModel):
    id: str
    created_at: str
    name: str
    game_id: str
    texture: str
    x: int
    y: int
    z: int = 0
    realm: Realm
    solid: bool = False
    opacity: float = 1.0
    rotation: int = 0
    ext: Optional[str] = None
    model_config = ConfigDict(use_enum_values=True)

    def to_db_model(self) -> "Terrain":
        return Terrain.model_construct(**self.model_dump())

    def prep_db(self) -> dict:
        data = self.to_db_model().model_dump()
        remove_keys = ["id", "created_at"]
        for key in remove_keys:
            data.pop(key, None)
        return data


class Color(Terrain):
    name: str = "Color"
    game_id: str = "color"
    texture: str = "terrain/color"
    z: int = 0
    solid: bool = False


class Grass(Terrain):
    name: str = "Grass"
    game_id: str = "grass"
    texture: str = "terrain/grass"
    z: int = 0
    solid: bool = False


class Water(Terrain):
    name: str = "Water"
    game_id: str = "water"
    texture: str = "terrain/water"
    z: int = 0
    solid: bool = True


class WaterWave(Terrain):
    name: str = "Water Wave"
    game_id: str = "water_wave"
    texture: str = "terrain/water_wave"
    z: int = 0
    solid: bool = True
    ext: str = "gif"


class Rock(Terrain):
    name: str = "Rock"
    game_id: str = "rock"
    texture: str = "terrain/rock"
    z: int = 0
    solid: bool = True


class Bush(Terrain):
    name: str = "Bush"
    game_id: str = "bush"
    texture: str = "terrain/bush"
    z: int = 0
    solid: bool = True


class Sandstone(Terrain):
    name: str = "Sandstone"
    game_id: str = "sandstone"
    texture: str = "terrain/sandstone"
    z: int = 0
    solid: bool = True
