from aiohttp.web import Request, WebSocketResponse

from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character
from src.models.character import Character
from src.models.render_object import RenderObject
from src.database.object import create_object, remove_object
from src.models.account import Account


async def place_object(request: Request, ws: WebSocketResponse, account: Account, payload: dict):
    database = request.app["database"]
    gamestate: Gamestate = request.app["gamestate"]

    object = create_object(database, payload)

    if not object:
        await ws.send_str("Error: Failed to create object.")
        return

    render_object = RenderObject(**object)

    await gamestate.addObject(render_object)


async def delete_object(request: Request, ws: WebSocketResponse, account: Account, payload: dict):
    database = request.app["database"]
    gamestate: Gamestate = request.app["gamestate"]

    object_id = payload.get("id")

    if not object_id:
        await ws.send_str("Error: 'id' field is required.")
        return

    obj = gamestate.objects.get(object_id)

    if not obj:
        await ws.send_str("Error: Object not found.")
        return

    deleted = remove_object(database, object_id)

    if not deleted:
        await ws.send_str("Error: Failed to delete object from database.")
        return

    await gamestate.deleteObject(object_id)
