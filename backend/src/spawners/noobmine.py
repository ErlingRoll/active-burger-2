from realtime import Literal
from src.spawners.spawner import SpawnTable, SpawnTableItem, Spawner


class NoobmineEntry(Spawner):
    start_x: int = 7
    start_y: int = -4
    end_x: int = 15
    end_y: int = 4
    safe_radius: int = 2
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="gold_ore", chance=0.5),
    ])


class NoobmineMonsters(Spawner):
    start_x: int = 4
    start_y: int = -13
    end_x: int = 13
    end_y: int = -10
    object_type: Literal["object", "monster"] = "monster"
    safe_radius: int = 2
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="karate_panda", chance=0.5),
    ])
