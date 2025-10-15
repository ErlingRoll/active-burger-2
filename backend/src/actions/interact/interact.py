from typing import List
from pydantic import BaseModel
from aiohttp.web import Request, WebSocketResponse
from src.database.object import delete_object
from src.models.objects.entity.ore.gold_ore import Ore
from src.generators.object import generate_object
from src.actions.give_loot import GiveLootPayload, give_loot
from src.connection_manager import GameEvent
from src.gamestate import Gamestate
from src.models import Account, Character, RenderObject, Item


class InteractPayload(BaseModel):
    object_id: str | None


async def mine_interact(request: Request, ws: WebSocketResponse, account: Account, character, object: RenderObject):
    database = request.app['database']
    gamestate: Gamestate = request.app['gamestate']
    _ore_defaults = object.to_dict()
    del _ore_defaults['object_id']
    ore: Ore = generate_object(object_id=object.object_id, **_ore_defaults)

    damage = 100
    ore.damage(damage)

    await gamestate.update_object(ore)

    if ore.is_alive():
        return

    # Ore is mined
    delete_object(database, ore.id)
    await gamestate.delete_object(ore.id)

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


async def type_interact(request: Request, ws: WebSocketResponse, account: Account, character, object: RenderObject):
    if not object or not object.object_id:
        return

    if "ore" in object.object_id:
        await mine_interact(request, ws, account, character, object)


async def interact(request: Request, ws: WebSocketResponse, account: Account, character, payload: dict):
    gamestate: Gamestate = request.app['gamestate']

    payload: InteractPayload = InteractPayload(**payload)

    object: RenderObject | None = gamestate.get_render_object(payload.object_id)
    if not object:
        event = GameEvent(event="error", payload={"message": f"Object with id {payload.object_id} not found"})
        await ws.send_str(event.model_dump_json())
        return

    await type_interact(request, ws, account, character, object)
