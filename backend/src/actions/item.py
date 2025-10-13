from aiohttp.web import Request, WebSocketResponse
from pydantic import BaseModel

from src.database.character import get_character_data_by_id
from src.models.item import Item
from src.database.item import delete_item, get_item_by_id, update_item
from src.connection_manager import ConnectionManager, GameEvent
from src.gamestate import Gamestate
from src.models.character import Character
from src.models.account import Account
from src.models.item import UseResult


class UseItemPayload(BaseModel):
    id: str


async def handle_item_consumption(item, database):
    if not item.consumable:
        return

    if item.count == 1:
        delete_item(database, item.id)
        return

    if item.count and item.count > 1:
        item.count -= 1
        update_item(database, item)
        return

    return


async def use_item(app, ws: WebSocketResponse, account: Account, character: Character, payload: dict):
    database = app["database"]
    gamestate: Gamestate = app["gamestate"]

    payload = UseItemPayload(**payload)

    item: Item = get_item_by_id(database, payload.id)
    character_state = gamestate.get_character(character.id)

    result: UseResult = await item.use(character=character_state, gamestate=gamestate, database=database, ws=ws)

    event = GameEvent(event="log", payload={}, log=result.log)

    if not result.success:
        return await ws.send_str(event.model_dump())

    await handle_item_consumption(item, database)

    await gamestate.publish_character(account, character_id=character.id)

    await ws.send_str(event.model_dump_json())
