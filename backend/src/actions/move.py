from aiohttp.web import Request, WebSocketResponse

from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character
from src.models.character import Character
from src.models.account import Account


async def move(request: Request, ws: WebSocketResponse, account: Account, payload: dict):
    gamestate: Gamestate = request.app["gamestate"]

    character_id = payload.get("character_id")
    x = payload.get("x")
    y = payload.get("y")
    direction = payload.get("direction")

    if None in (character_id, x, y, direction):
        await ws.send_str("Error: Missing move parameters.")
        return

    character_state = gamestate.get_character(character_id)

    if character_state is None:
        await ws.send_str("Error: Character not found.")
        return

    # Get objects at target position
    pos_key = f"{x}_{y}"
    pos_objects = gamestate.position_objects()
    objects_at_pos = pos_objects.get(pos_key, [])

    character_state.direction = direction

    # Check for collision with solid objects
    for obj in objects_at_pos:
        if obj.solid:
            return await gamestate.publishGamestate()

    character_state.x = x
    character_state.y = y

    await gamestate.publishGamestate()
