from asyncio import create_task
from pydantic import BaseModel

from src.models.objects.misc.teleporter import Teleporter
from src.models.objects.steppable import Steppable
from src.connection_manager import GameEvent
from src.actions.action import ActionRequest
from src.gamestate import Gamestate


class MovePayload(BaseModel):
    x: int
    y: int
    direction: str


async def move(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]
    payload = MovePayload(**action.payload)

    if not action.character.id:
        event = GameEvent(
            event="log",
            payload={"error": "Character ID not found for move action."}
        )
        return await action.ws.send_json(event.model_dump())

    character_state = gamestate.get_character_state(action.character.id)

    if character_state is None:
        event = GameEvent(
            event="log",
            payload={"error": "Character state not found for move action."}
        )
        return await action.ws.send_json(event.model_dump())

    pos_key = f"{payload.x}_{payload.y}"

    # Get terrain at target position
    pos_terrain = gamestate.position_terrain(realm=character_state.realm)
    terrain_at_pos = pos_terrain.get(pos_key, [])
    for terrain in terrain_at_pos:
        if terrain.solid:
            return await gamestate.publish_gamestate()

    # Get objects at target position
    pos_objects = gamestate.position_objects(realm=character_state.realm)
    objects_at_pos = pos_objects.get(pos_key, [])

    character_state.direction = payload.direction

    # Check for collision with solid objects
    for obj in objects_at_pos:
        if obj.solid:
            return await gamestate.publish_gamestate()

    character_state.x = payload.x
    character_state.y = payload.y

    await gamestate.publish_gamestate()

    for obj in objects_at_pos:
        if isinstance(obj, Steppable):
            create_task(obj.on_step(database, gamestate, action.account, action.character))
