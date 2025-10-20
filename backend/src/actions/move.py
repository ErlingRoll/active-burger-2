from asyncio import create_task
from pydantic import BaseModel

from src.database.character import update_character
from src.connection_manager import GameEvent
from src.actions.action import ActionRequest
from src.gamestate import Gamestate


class MovePayload(BaseModel):
    x: int
    y: int
    direction: str


async def move(action: ActionRequest):
    gamestate: Gamestate = action.request.app["gamestate"]
    payload = MovePayload(**action.payload)

    if not action.character.id:
        event = GameEvent(
            event="log",
            payload={"error": "Character ID not found for move action."}
        )
        return await action.ws.send_json(event.model_dump())

    character_state = gamestate.get_character(action.character.id)

    if character_state is None:
        event = GameEvent(
            event="log",
            payload={"error": "Character state not found for move action."}
        )
        return await action.ws.send_json(event.model_dump())

    # Get objects at target position
    pos_key = f"{payload.x}_{payload.y}"
    pos_objects = gamestate.position_objects()
    objects_at_pos = pos_objects.get(pos_key, [])

    character_state.direction = payload.direction

    # Check for collision with solid objects
    for obj in objects_at_pos:
        if obj.solid:
            return await gamestate.publish_gamestate()

    character_state.x = payload.x
    character_state.y = payload.y

    create_task(gamestate.publish_gamestate())
