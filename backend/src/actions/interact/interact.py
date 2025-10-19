from asyncio import gather
from typing import List
from pydantic import BaseModel
from aiohttp.web import Request, WebSocketResponse
from src.actions.action import ActionRequest
from src.models.items.tools import Tool
from src.database.equipment import get_equipment_item
from src.database.object import db_delete_object
from src.generators.object import generate_object
from src.actions.give_loot import GiveLootPayload, give_loot
from src.connection_manager import GameEvent
from src.gamestate import Gamestate
from src.models.objects.entity.ore.gold_ore import Ore
from src.models import Account, Character, RenderObject, Item, EquipSlot


class InteractPayload(BaseModel):
    object_id: str | None


async def mine_interact(request: Request, ws: WebSocketResponse, account: Account, character: Character, object: RenderObject):
    database = request.app['database']
    gamestate: Gamestate = request.app['gamestate']

    pickaxe = await get_equipment_item(database, character.id, EquipSlot.PICKAXE)

    if pickaxe is None:
        event = GameEvent(
            event="log",
            log=["You need to equip a pickaxe to mine ore"],
        )
        return await ws.send_json(event.model_dump())

    pickaxe: Tool = Tool(**pickaxe.model_dump())

    _ore_defaults = object.to_dict()
    del _ore_defaults['object_id']
    ore: Ore = generate_object(object_id=object.object_id, **_ore_defaults)

    damage = pickaxe.get_efficiency()
    ore.damage(damage)

    await gamestate.update_object(ore)

    if ore.is_alive():
        return

    # Ore is mined
    gather(db_delete_object(database, ore.id), gamestate.delete_object(ore.id))

    loot: List[Item] = ore.roll_loot()
    log_message = f"You mined {ore.name} and received: "
    for item in loot:
        log_message += f"{item.name} x{item.count}, "
    log_message = log_message.rstrip(", ")

    loot_payload = GiveLootPayload(items=loot, log=[log_message])

    await give_loot(request, ws, account, character, loot_payload.model_dump())

    event = GameEvent(
        event="log",
        payload={},
        log=[log_message]
    )
    await ws.send_str(event.model_dump_json())


async def type_interact(request: Request, ws: WebSocketResponse, account: Account, character: Character, object: RenderObject):
    if not object or not object.object_id:
        return

    if "ore" in object.object_id:
        await mine_interact(request, ws, account, character, object)


async def interact(action: ActionRequest):
    gamestate: Gamestate = action.request.app['gamestate']

    payload: InteractPayload = InteractPayload(**action.payload)

    if not payload.object_id:
        event = GameEvent(event="error", payload={"message": "No object_id provided in interact payload"})
        return await action.ws.send_json(event.model_dump())

    object: RenderObject | None = gamestate.get_render_object(payload.object_id)
    if not object:
        event = GameEvent(event="error", payload={"message": f"Object with id {payload.object_id} not found"})
        await action.ws.send_json(event.model_dump())
        return

    await type_interact(action.request, action.ws, action.account, action.character, object)
