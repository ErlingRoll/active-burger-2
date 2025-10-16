from pydantic import BaseModel
from aiohttp.web import Request, WebSocketResponse

from src.gamestate import Gamestate
from src.database.account import get_account_by_discord_id, create_account
from src.database.character import get_character_by_account_id, create_character, get_character_data_by_id
from src.models.character import Character
from src.models.account import Account
from src.generators.item import generate_item
from src.database.item import create_item


class GiveItemPayload(BaseModel):
    item_id: str


async def give_item(request: Request, ws: WebSocketResponse, account: Account, character: Character, payload: GiveItemPayload):
    gamestate: Gamestate = request.app["gamestate"]
    database = request.app["database"]
    payload = GiveItemPayload(**payload)

    new_item = generate_item(payload.item_id)
    new_item.character_id = character.id

    await create_item(database, new_item)
    await gamestate.publish_character(account, character_id=character.id)
