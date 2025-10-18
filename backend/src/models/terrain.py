

from typing import Optional
from pydantic import BaseModel


class Terrain(BaseModel):
    id: Optional[str] = None
    created_at: Optional[str] = None
    name: str
    game_id: str
    texture: str
    z_index: int = 0
    solid: bool = False
    opacity: float = 1.0
    rotation: int = 0
