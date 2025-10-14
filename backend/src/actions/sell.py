from aiohttp.web import Request, WebSocketResponse
from pydantic import BaseModel

from src.connection_manager import GameEvent
from src.actions.item import handle_item_consumption
from src.gamestate import Gamestate
from src.database.item import create_item, update_item
from src.database.character import get_character_by_id, get_character_data_by_id, update_character
from src.models import Account, Character, Item


class SellPayload(BaseModel):
    item_id: str
    count: int = 1


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

    if owned_item.count is not None and owned_item.count < payload.count:
        return await ws.send_json({
            'type': 'error',
            'message': 'Not enough items to sell.'
        })

    total_sell_price = owned_item.value * payload.count

    character_data.gold += total_sell_price

    await handle_item_consumption(database, owned_item, count=payload.count, consume=True)

    update_character(database, character_data.to_character())

    await gamestate.publish_character(account, character_id=character.id)

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You sold {owned_item.name} x{payload.count} for {total_sell_price} gold"]
    )

    await ws.send_str(event.model_dump_json())
