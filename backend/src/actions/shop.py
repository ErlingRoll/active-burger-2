from aiohttp.web import Request, WebSocketResponse
from pydantic import BaseModel
from asyncio import create_task, gather

from src.models.character import CharacterData
from src.generators.item import generate_item
from src.connection_manager import GameEvent
from src.actions.item import add_or_stack_items, handle_item_consumption
from src.gamestate import Gamestate
from src.database.item import create_item, update_item
from src.database.character import get_character_by_id, get_character_data_by_id, update_character
from src.models import Account, Character, Item


class BuyPayload(BaseModel):
    item_id: str
    count: int = 1


class SellPayload(BaseModel):
    item_id: str
    count: int = 1


async def buy(request: Request, ws: WebSocketResponse, account: Account, character: Character, payload: dict):
    database = request.app['database']
    gamestate: Gamestate = request.app['gamestate']

    payload: SellPayload = SellPayload(**payload)

    character_data: CharacterData = await get_character_data_by_id(database, character.id)

    item: Item = generate_item(payload.item_id)

    if not item.value:
        return await ws.send_json({
            'type': 'error',
            'message': f'Item {item.name} has no value.'
        })

    total_price = item.value * payload.count

    if character_data.gold < total_price:
        event = GameEvent(
            event="log",
            payload={},
            log=[f"Not enough gold to buy {item.name} x{payload.count}. Ya poor!"]
        )
        return await ws.send_json(event.model_dump())

    character_data.gold -= total_price

    await add_or_stack_items(database, character_data, [item])
    await update_character(database, character_data.to_character())

    create_task(gamestate.publish_character(account, character_id=character.id))

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You bought {item.name} x{payload.count} for {total_price} gold"]
    )
    create_task(ws.send_json(event.model_dump()))


async def sell(request: Request, ws: WebSocketResponse, account: Account, character: Character, payload: dict):
    database = request.app['database']
    gamestate: Gamestate = request.app['gamestate']
    tasks = []

    payload: SellPayload = SellPayload(**payload)

    character_data = await get_character_data_by_id(database, character.id)

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

    task = handle_item_consumption(database, owned_item, count=payload.count, consume=True)
    tasks.append(task)

    task = update_character(database, character_data.to_character())
    tasks.append(task)

    await gather(*tasks)

    create_task(gamestate.publish_character(account, character_id=character.id))

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You sold {owned_item.name} x{payload.count} for {total_sell_price} gold"]
    )
    create_task(ws.send_json(event.model_dump()))
