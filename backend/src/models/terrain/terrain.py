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
