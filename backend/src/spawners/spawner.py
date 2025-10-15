from random import random
from pydantic import BaseModel, ConfigDict
from supabase import Client
from typing import List
from pydantic import BaseModel
from src.models.render_object import RenderObject
from src.connection_manager import ConnectionManager
from src.interfaces.game_ticker import GameTickerInterface
from src.gamestate import Gamestate


class SpawnTableItem(BaseModel):
    object_id: str
    chance: float  # 0.0 to 1.0


class SpawnTable(BaseModel):
    items: List[SpawnTableItem]

    def roll_spawn(self) -> str | None:
        for item in self.items:
            roll = random()
            if roll <= item.chance:
                return item.object_id

    def roll_spawn_multiple(self) -> List[RenderObject]:
        spawn_items = []
        for item in self.items:
            roll = random()
            if roll <= item.chance:
                spawn_items.append(item)

        return spawn_items


class Spawner(BaseModel, GameTickerInterface):
    database: Client
    connection_manager: ConnectionManager
    gamestate: Gamestate

    model_config = ConfigDict(arbitrary_types_allowed=True)
