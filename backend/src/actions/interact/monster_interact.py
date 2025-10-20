from asyncio import gather
from typing import List
from aiohttp.web import Request, WebSocketResponse
from src.generators.monster import generate_monster
from src.models.damage_hit import DamageHit
from src.models.items.weapon import Weapon
from src.models.objects.monster.monster import Monster
from src.database.equipment import get_equipment_item
from src.database.object import db_delete_object
from src.actions.give_loot import GiveLootPayload, give_loot
from src.connection_manager import GameEvent
from src.gamestate import Gamestate
from src.models import Account, Character, RenderObject, Item, EquipSlot


async def monster_interact(request: Request, ws: WebSocketResponse, account: Account, character: Character, object: RenderObject):
    database = request.app['database']
    gamestate: Gamestate = request.app['gamestate']

    if character.id is None:
        event = GameEvent(
            event="log",
            payload={"error": "Missing character ID"},
        )
        return await ws.send_json(event.model_dump())

    weapon = await get_equipment_item(database, character.id, EquipSlot.WEAPON)  # type: ignore

    if weapon is None:
        event = GameEvent(
            event="log",
            log=["You need to equip a weapon to attack monsters"],
        )
        return await ws.send_json(event.model_dump())

    weapon: Weapon = Weapon(**weapon.model_dump())

    monster_defaults = object.to_dict()
    del monster_defaults['object_id']
    monster: Monster = generate_monster(object_id=object.object_id, **monster_defaults)  # type: ignore

    damage: DamageHit = weapon.roll_hit()
    monster.damage(damage)

    await gamestate.update_object(monster)

    if monster.is_alive():
        return

    if monster.id is None:
        raise ValueError("Monster must have an id to be deleted from the database and gamestate")

    gather(db_delete_object(database, monster.id), gamestate.delete_object(monster.id))

    loot: List[Item] = monster.roll_loot()
    log_message = f"You defeated {monster.name} and received: "
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
