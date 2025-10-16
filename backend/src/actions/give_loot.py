from typing import List
from aiohttp.web import Request, WebSocketResponse
from pydantic import BaseModel
from asyncio import gather

from src.gamestate import Gamestate
from src.database.item import create_item, update_item
from src.database.character import get_character_by_id, get_character_data_by_id
from src.models import Account, Character, Item


class GiveLootPayload(BaseModel):
    items: List[Item]
    log: List[str]


async def give_loot(request: Request, ws: WebSocketResponse, account: Account, character: Character, payload: dict):
    database = request.app['database']
    gamestate: Gamestate = request.app['gamestate']

    payload: GiveLootPayload = GiveLootPayload(**payload)
    items = payload.items

    character_data = await get_character_data_by_id(database, character.id)
    stackable_item_map = {item.item_id: item for item in character_data.items.values() if item.stackable}

    for item in items:
        if item.stackable and item.item_id in stackable_item_map:
            existing_item = stackable_item_map[item.item_id]
            existing_item.count += item.count
            await update_item(database, existing_item)
            continue

        item.character_id = character.id
        await create_item(database, item)

    await gamestate.publish_character(account, character_id=character.id)
