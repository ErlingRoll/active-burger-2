from asyncio import create_task
from pydantic import BaseModel

from src.database.character import update_character, update_character_pos
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

    character_state.direction = payload.direction

    blocked = gamestate.is_pos_blocked(x=payload.x, y=payload.y, realm=character_state.realm)
    if blocked:
        return await gamestate.publish_gamestate()

    character_state.x = payload.x
    character_state.y = payload.y

    create_task(update_character_pos(database, character_state.id, character_state.x, character_state.y))

    await gamestate.publish_gamestate()

    objects_at_pos = gamestate.position_objects(realm=character_state.realm).get(f"{payload.x}_{payload.y}", [])
    for obj in objects_at_pos:
        if isinstance(obj, Steppable):
            create_task(obj.on_step(database, gamestate, action.account, action.character))
