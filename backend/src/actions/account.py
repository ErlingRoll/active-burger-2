from asyncio import create_task
from pydantic import BaseModel

from src.generators.world import Realm
from src.connection_manager import ConnectionManager, GameEvent
from src.actions.action import ActionRequest
from src.gamestate import Gamestate


class SetRealmPayload(BaseModel):
    realm: Realm


async def set_realm(action: ActionRequest):
    gamestate: Gamestate = action.request.app["gamestate"]
    connection_manager: ConnectionManager = action.request.app["connection_manager"]

    payload = SetRealmPayload(**action.payload)

    ws = connection_manager.connections_account_map.get(action.account.id)

    if not ws:
        event = GameEvent(
            event="log",
            payload={"error": "WebSocket connection not found."},
        )
        return create_task(action.ws.send_json(event.model_dump()))

    ws.realm = payload.realm

    create_task(gamestate.publish_gamestate(account=action.account))
    create_task(gamestate.publish_terrain(account=action.account))
