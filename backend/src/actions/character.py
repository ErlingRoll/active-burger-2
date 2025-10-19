from asyncio import create_task
from pydantic import BaseModel

from src.gamestate import Gamestate
from src.actions.action import ActionRequest
from src.connection_manager import ConnectionManager, GameEvent
from src.models.character import CharacterData
from src.database.item import get_items_by_character_id
from src.database.character import get_character_by_id


class GetCharacterPayload(BaseModel):
    character_id: str


async def get_character(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]
    connection_manager: ConnectionManager = action.request.app["connection_manager"]

    payload = GetCharacterPayload(**action.payload)

    character = get_character_by_id(database, payload.character_id)
    character_data = CharacterData(**character.model_dump())
    items = get_items_by_character_id(database, payload.character_id)
    item_map = {item["id"]: item for item in items}

    character_data.items = item_map

    event: GameEvent = GameEvent(
        event="update_character",
        payload=character.model_dump()
    )

    create_task(connection_manager.send(action.account.id, event))
