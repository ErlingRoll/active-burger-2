from aiohttp.web import Request, WebSocketResponse

from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character
from src.models.character import Character
from src.models.render_object import RenderObject
from src.database.object import create_object


async def place_object(request: Request, ws: WebSocketResponse, payload: dict):
    database = request.app["database"]
    gamestate: Gamestate = request.app["gamestate"]

    object = create_object(database, payload)

    if not object:
        await ws.send_str("Error: Failed to create object.")
        return

    render_object = RenderObject(**object)

    await gamestate.addObject(render_object)
