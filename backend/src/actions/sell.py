from typing import List
from aiohttp.web import Request, WebSocketResponse
from pydantic import BaseModel
from asyncio import gather

from src.gamestate import Gamestate
from src.database.item import create_item, update_item
from src.database.character import get_character_by_id, get_character_data_by_id
from src.models import Account, Character, Item


class SellPayload(BaseModel):
    item_id: str
    amount: int = 1


async def sell(request: Request, ws: WebSocketResponse, account: Account, character: Character, payload: dict):
    database = request.app['database']
    gamestate: Gamestate = request.app['gamestate']

    payload: SellPayload = SellPayload(**payload)

    character_data = get_character_data_by_id(database, character.id)

    owned_item: Item = character_data.items.get(payload.item_id)
    if not owned_item:
        return await ws.send_json({
            'type': 'error',
            'message': 'Item not found in inventory.'
        })

    if owned_item.count is not None and owned_item.count >= payload.amount:
        return await ws.send_json({
            'type': 'error',
            'message': 'Not enough items to sell.'
        })
