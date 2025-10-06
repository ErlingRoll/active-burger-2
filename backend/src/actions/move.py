from aiohttp.web import Request, WebSocketResponse

from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character
from src.models.character import Character


async def move(request: Request, ws: WebSocketResponse, payload: dict):
    gamestate: Gamestate = request.app["gamestate"]

    character_id = payload.get("character_id")
    x = payload.get("x")
    y = payload.get("y")

    if not character_id or x is None or y is None:
        await ws.send_str("Error: 'character_id', 'x', and 'y' fields are required.")
        return

    character_state = gamestate.get_character(character_id)

    if character_state is None:
        await ws.send_str("Error: Character not found.")
        return

    character_state.x = x
    character_state.y = y

    await gamestate.publishGamestate()
