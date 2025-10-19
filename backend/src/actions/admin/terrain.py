from asyncio import create_task
from pydantic import BaseModel

from src.actions.action import ActionRequest
from src.database.terrain import db_create_terrain, db_delete_terrain
from src.connection_manager import GameEvent
from src.generators.terrain import generate_terrain
from src.gamestate import Gamestate
from src.models import Terrain


class PlaceTerrainPayload(BaseModel):
    properties: dict = {}


class DeleteTerrainPayload(BaseModel):
    id: str


async def place_terrain(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]

    place_terrain_payload: PlaceTerrainPayload = PlaceTerrainPayload(**action.payload)
    new_terrain: Terrain = generate_terrain(**place_terrain_payload.properties)

    terrain = await db_create_terrain(database, new_terrain)

    if not terrain:
        event = GameEvent(
            event="log",
            payload={"error": "Failed to create terrain in database."}
        )
        await action.ws.send_json(event.model_dump())
        return

    create_task(gamestate.add_terrain(terrain))


async def delete_terrain(action: ActionRequest):
    database = action.request.app["database"]
    gamestate: Gamestate = action.request.app["gamestate"]

    terrain_id = DeleteTerrainPayload(**action.payload).id

    terrain = gamestate.terrain.get(terrain_id)

    if not terrain:
        event = GameEvent(
            event="log",
            payload={"error": "Terrain not found."}
        )
        return await action.ws.send_json(event.model_dump())

    deleted = await db_delete_terrain(database, terrain_id)

    if not deleted:
        event = GameEvent(
            event="log",
            payload={"error": "Failed to delete terrain from database."}
        )
        return await action.ws.send_json(event.model_dump())

    await gamestate.delete_terrain(terrain_id)
