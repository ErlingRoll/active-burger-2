from asyncio import create_task
from pydantic import BaseModel
from aiohttp.web import Request, WebSocketResponse

from src.connection_manager import ConnectionManager
from src.models.account import Account
from src.models.character import CharacterData
from src.database.item import get_items_by_character_id
from src.database.character import get_character_by_id


class GetCharacterPayload(BaseModel):
    character_id: str


async def get_character(request: Request, app, ws: WebSocketResponse, account: Account, payload: GetCharacterPayload):
    database = request.app["database"]
    connection_manager: ConnectionManager = request.app["connection_manager"]

    payload = GetCharacterPayload(**payload)

    character = get_character_by_id(database, payload.character_id)
    character_data = CharacterData(**character.model_dump())
    items = get_items_by_character_id(database, payload.character_id)
    item_map = {item["id"]: item for item in items}

    character_data.items = item_map

    event = {
        "event": "update_character",
        "payload": character.model_dump()
    }

    create_task(connection_manager.send(account.id, event))
