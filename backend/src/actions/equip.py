from asyncio import create_task
from aiohttp.web import WebSocketResponse
from pydantic import BaseModel

from src.actions.action import ActionRequest
from src.connection_manager import GameEvent
from src.gamestate import Gamestate
from src.database import upsert_equipment

from src.models import Account, Character, CharacterData, Item, UseResult, EquipmentSlot


class UnequipItemPayload(BaseModel):
    slot: str


class EquipItemPayload(BaseModel):
    item: Item


async def unequip_item(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]

    unequip_payload: UnequipItemPayload = UnequipItemPayload(**action.payload)

    equipment = EquipmentSlot(character_id=action.character.id, item_id=None, slot=unequip_payload.slot)

    await upsert_equipment(database, equipment)

    await gamestate.publish_character(action.account.id, character_id=action.character.id)

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You unequipped {unequip_payload.slot}"]
    )

    create_task(action.ws.send_json(event.model_dump()))


async def equip_item(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]

    item = EquipItemPayload(**action.payload).item

    equipment = EquipmentSlot(character_id=action.character.id, item_id=item.id, slot=item.equip_slot)

    await upsert_equipment(database, equipment)

    await gamestate.publish_character(action.account.id, character_id=action.character.id)

    event = GameEvent(
        event="log",
        payload={},
        log=[f"You equipped {item.name}"]
    )

    create_task(action.ws.send_json(event.model_dump()))
