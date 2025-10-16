from aiohttp.web import Request, WebSocketResponse
from pydantic import BaseModel

from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character
from src.models.render_object import RenderObject
from src.database.object import create_object, db_delete_object
from src.models.account import Account
from src.models.character import Character
from src.generators.object import generate_object


class PlaceObjectPayload(BaseModel):
    object_id: str
    x: int
    y: int


async def place_object(request: Request, ws: WebSocketResponse, account: Account, character: Character, payload: PlaceObjectPayload):
    database = request.app["database"]
    gamestate: Gamestate = request.app["gamestate"]
    payload = PlaceObjectPayload(**payload)

    new_object = generate_object(payload.object_id, x=payload.x, y=payload.y)

    object = await create_object(database, new_object)

    if not object:
        await ws.send_str("Error: Failed to create object.")
        return

    await gamestate.add_object(object)


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

    deleted = await db_delete_object(database, object_id)

    if not deleted:
        await ws.send_str("Error: Failed to delete object from database.")
        return

    await gamestate.delete_object(object_id)
