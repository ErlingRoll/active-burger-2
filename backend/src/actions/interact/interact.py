from pydantic import BaseModel
from aiohttp.web import Request, WebSocketResponse
from src.actions.interact import mine_interact, monster_interact
from src.actions.action import ActionRequest
from src.connection_manager import GameEvent
from src.gamestate import Gamestate
from src.models import Account, Character, RenderObject


class InteractPayload(BaseModel):
    object_id: str | None


async def type_interact(request: Request, ws: WebSocketResponse, account: Account, character: Character, object: RenderObject):

    object_type = object.type

    if object_type == "ore":
        await mine_interact(request, ws, account, character, object)
    elif object_type == "monster":
        await monster_interact(request, ws, account, character, object)


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
