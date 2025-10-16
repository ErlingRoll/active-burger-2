
import random
from typing import Dict
from src.generators.object import generate_object
from src.database.object import create_object
from src.models.render_object import RenderObject
from src.spawners.spawner import SpawnTable, SpawnTableItem, Spawner


class SpawnMine(Spawner):

    start_x: int = 7
    start_y: int = -4
    end_x: int = 15
    end_y: int = 4
    spawn_table: SpawnTable = SpawnTable(items=[
        SpawnTableItem(object_id="gold_ore", chance=0.5),
    ])

    def random_position(self) -> tuple[int, int]:
        x = random.randint(self.start_x, self.end_x)
        y = random.randint(self.start_y, self.end_y)
        return x, y

    async def game_tick(self):
        random_position = self.random_position()
        neighboring_objects: Dict[str, RenderObject] = self.gamestate.get_render_object_window(
            x_start=random_position[0] - 1,
            y_start=random_position[1] - 1,
            x_end=random_position[0] + 1,
            y_end=random_position[1] + 1,
        )

        has_space = True
        for obj in neighboring_objects.values():
            if obj.solid or obj.type in ["character"]:
                has_space = False
                break

        if not has_space:
            return

        object_id = self.spawn_table.roll_spawn()
        if not object_id:
            return

        new_object = generate_object(object_id=object_id, x=random_position[0], y=random_position[1])

        created_object = await create_object(self.database, new_object)

        if created_object:
            await self.gamestate.add_object(created_object, skip_publish=True)
