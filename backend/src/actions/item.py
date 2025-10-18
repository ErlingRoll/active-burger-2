from asyncio import create_task
from aiohttp.web import WebSocketResponse
from pydantic import BaseModel

from src.connection_manager import GameEvent
from src.actions.equip import equip_item
from src.gamestate import Gamestate
from src.database.item import create_item, delete_item, get_item_by_id, update_item

from src.models import Account, Character, CharacterData, Item, UseResult


class UseItemPayload(BaseModel):
    id: str


async def add_or_stack_items(database, character_data: CharacterData, items: list[Item]):
    stackable_item_map: dict[str, Item] = {item.item_id: item for item in character_data.items.values() if item.stackable}

    for item in items:
        if item.stackable and item.item_id in stackable_item_map:
            existing_item = stackable_item_map[item.item_id]
            existing_item.count += item.count
            await update_item(database, existing_item)
            continue

        item.character_id = character_data.id
        await create_item(database, item)


async def handle_item_consumption(database, item, count=1, consume=False):
    if not item.consumable and not consume:
        return

    if item.count == count:
        return await delete_item(database, item.id)

    if item.count and item.count > count:
        item.count -= count
        return await update_item(database, item)


async def use_item(request, app, ws: WebSocketResponse, account: Account, character: Character, payload: dict):
    database = app["database"]
    gamestate: Gamestate = app["gamestate"]

    item_payload: UseItemPayload = UseItemPayload(**payload)

    item: Item = await get_item_by_id(database, item_payload.id)

    if item.equipable:
        return create_task(equip_item(request, app, ws, account, character, item))

    character_state = gamestate.get_character(character.id)

    result: UseResult = await item.use(character=character_state, gamestate=gamestate, database=database, ws=ws)

    event = GameEvent(event="log", payload={}, log=result.log)

    if not result.success:
        return await ws.send_str(event.model_dump_json())

    await handle_item_consumption(database, item)

    await gamestate.publish_character(account, character_id=character.id)

    return create_task(ws.send_str(event.model_dump_json()))
