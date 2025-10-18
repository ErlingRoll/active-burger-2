from asyncio import create_task
from aiohttp.web import WebSocketResponse
from pydantic import BaseModel

from src.connection_manager import GameEvent
from src.gamestate import Gamestate
from src.database import upsert_equipment

from src.models import Account, Character, CharacterData, Item, UseResult, Equipment


class UnequipItemPayload(BaseModel):
    slot: str


async def unequip_item(request, app, ws: WebSocketResponse, account: Account, character: Character, payload: dict):
    database = request.app["database"]
    gamestate: Gamestate = request.app["gamestate"]

    unequip_payload: UnequipItemPayload = UnequipItemPayload(**payload)

    equipment = Equipment(character_id=character.id, item_id=None, slot=unequip_payload.slot)

    await upsert_equipment(database, equipment)

    await gamestate.publish_character(account, character_id=character.id)

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You unequipped {unequip_payload.slot}"]
    )

    create_task(ws.send_json(event.model_dump()))


async def equip_item(request, app, ws: WebSocketResponse, account: Account, character: Character, item: Item):
    database = request.app["database"]
    gamestate: Gamestate = request.app["gamestate"]

    equipment = Equipment(character_id=character.id, item_id=item.id, slot=item.equip_slot)

    await upsert_equipment(database, equipment)

    await gamestate.publish_character(account, character_id=character.id)

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You equipped {item.name}"]
    )

    create_task(ws.send_json(event.model_dump()))
