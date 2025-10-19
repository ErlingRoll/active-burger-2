from aiohttp.web import Request, WebSocketResponse
from pydantic import BaseModel

from src.actions.action import ActionRequest
from src.gamestate import Gamestate
from src.models.character import Character
from src.models.account import Account


class MovePayload(BaseModel):
    x: int
    y: int
    direction: str


async def move(action: ActionRequest):
    gamestate: Gamestate = action.request.app["gamestate"]
    payload = MovePayload(**action.payload)

    character_state = gamestate.get_character(action.character.id)

    if character_state is None:
        await action.ws.send_str("Error: Character not found.")
        return

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

    await gamestate.publish_gamestate()
