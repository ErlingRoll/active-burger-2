from asyncio import create_task, gather
from pydantic import BaseModel

from src.generators.item import generate_item
from src.actions.action import ActionRequest
from src.connection_manager import GameEvent
from src.database.item import delete_item, get_item_by_id, update_item

from src.models import Currency, Equipment


class ApplyCurrencyPayload(BaseModel):
    currency_id: str
    equipment_id: str


async def handle_item_consumption(database, item, count=1, consume=False):
    if not item.consumable and not consume:
        return

    if item.count == count:
        return await delete_item(database, item.id)

    if item.count and item.count > count:
        item.count -= count
        return await update_item(database, item)


async def apply_currency(action: ActionRequest):
    database = action.request.app['database']

    payload = ApplyCurrencyPayload(**action.payload)

    currency_req = get_item_by_id(database, payload.currency_id)
    equipment_req = get_item_by_id(database, payload.equipment_id)

    currency_res, equipment_res = await gather(currency_req, equipment_req)

    if currency_res is None or equipment_res is None:
        event = GameEvent(
            event="log",
            log=["Failed to apply currency: Item or currency not found"],
        )
        return await action.ws.send_json(event.model_dump())

    currency: Currency = generate_item(**currency_res.model_dump())
    equipment: Equipment = generate_item(**equipment_res.model_dump())

    modified_equipment = currency.apply_to(equipment)
