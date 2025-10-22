from typing import Optional
from pydantic import BaseModel


class Terrain(BaseModel):
    id: str
    created_at: str
    name: str
    game_id: str
    texture: str
    x: int
    y: int
    z: int = 0
    solid: bool = False
    opacity: float = 1.0
    rotation: int = 0

    def to_db_model(self) -> "Terrain":
        return Terrain.model_construct(**self.model_dump())

    def prep_db(self) -> dict:
        data = self.to_db_model().model_dump()
        remove_keys = ["id", "created_at"]
        for key in remove_keys:
            data.pop(key, None)
        return data


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


class Sandstone(Terrain):
    name: str = "Sandstone"
    game_id: str = "sandstone"
    texture: str = "terrain/sandstone"
    z: int = 0
    solid: bool = True
