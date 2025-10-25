from asyncio import gather
from collections import deque
from datetime import datetime
from typing import Deque, Dict, List
from pydantic import BaseModel, ConfigDict, Field
from supabase import AsyncClient

from src.database.terrain import db_get_terrain
from src.connection_manager import ConnectionManager, GameEvent
from src.database.character import get_character_data_by_id, get_characters
from src.database.object import get_objects
from src.models import Account, Character, CharacterData, RenderObject, Terrain


class ChatMessage(BaseModel):
    account_id: str
    account_name: str
    character_id: str
    character_name: str
    message: str
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class Gamestate(BaseModel):
    start_datetime: datetime = datetime.now()
    database: AsyncClient
    connection_manager: ConnectionManager
    model_config = ConfigDict(extra="allow", arbitrary_types_allowed=True)

    characters: dict[str, Character] = {}
    objects: dict[str, RenderObject] = {}
    terrain: dict[str, Terrain] = {}

    chat: Deque[ChatMessage] = deque(maxlen=50)

    async def fetch_gamestate(self):
        object_res = get_objects(self.database)
        character_res = get_characters(self.database)
        terrain_res = db_get_terrain(self.database)
        self.objects, self.characters, self.terrain = await gather(object_res, character_res, terrain_res)

    def send_chat_message(self, message: ChatMessage):
        self.chat.appendleft(message)

    async def publish_chat(self):
        event = GameEvent(
            event="chat_update",
            payload={
                "server_datetime": datetime.now().isoformat(),
                "messages": [msg.model_dump() for msg in list(self.chat)]
            }
        )
        await self.connection_manager.broadcast(event)

    async def publish_character(self, account: Account, character_id: str | None = None, character_data: CharacterData | None = None):
        if not character_id and not character_data:
            raise ValueError("Either character_id or character_data must be provided")

        _character_data = character_data
        if character_id and not character_data:
            _character_data = await get_character_data_by_id(self.database, character_id)

        if not _character_data:
            raise ValueError("Character data could not be found")

        event: GameEvent = GameEvent(
            event="character_update",
            payload=_character_data.model_dump(),
        )

        await self.connection_manager.send(account.id, event)

    def position_terrain(self, realm) -> Dict[str, List[Terrain]]:
        position_terrain = {}
        for terrain in self.terrain.values():
            if terrain.realm != realm:
                continue
            pos_key = f"{terrain.x}_{terrain.y}"
            if pos_key not in position_terrain:
                position_terrain[pos_key] = []
            position_terrain[pos_key].append(terrain.model_dump())
        return position_terrain

    async def publish_terrain(self, account: Account | None = None):
        # Send full terrain data. Data is grouped by position key (x_y)

        if account:
            ws = self.connection_manager.connections_account_map.get(account.id)
            if not ws:
                print(f"No active WebSocket for account {account.id}")
                return
            data = self.position_terrain(ws.realm)
            event = GameEvent(
                event="terrain_update",
                payload=data
            )
            return await self.connection_manager.send(account.id, event)

        for _connection_id, ws in self.connection_manager.connections.items():
            data = self.position_terrain(ws.realm)
            event = GameEvent(
                event="gamestate_update",
                payload=data
            )
            return await self.connection_manager.send(ws.account_id, event)

    async def publish_gamestate(self, account: Account | None = None):
        if account:
            ws = self.connection_manager.connections_account_map.get(account.id)
            if not ws:
                print(f"No active WebSocket for account {account.id}")
                return
            gamestate = self.get_gamestate(realm=ws.realm)
            event = GameEvent(
                event="gamestate_update",
                payload=gamestate
            )
            return await self.connection_manager.send(account.id, event)

        for _connection_id, ws in self.connection_manager.connections.items():
            gamestate = self.get_gamestate(realm=ws.realm)
            event = GameEvent(
                event="gamestate_update",
                payload=gamestate
            )
            return await self.connection_manager.send(ws.account_id, event)

    async def add_terrain(self, terrain: Terrain):
        self.terrain[terrain.id] = terrain
        return await self.publish_terrain()

    async def add_character(self, character: Character):
        if character.id in self.characters:
            return await self.publish_gamestate()

        self.characters[character.id] = character
        return await self.publish_gamestate()

    def get_character(self, character_id: str) -> Character | None:
        obj = self.characters.get(character_id)
        if isinstance(obj, Character):
            return obj
        return None

    async def add_object(self, obj: RenderObject, skip_publish=False):
        if obj.id in self.objects:
            return await self.publish_gamestate()

        self.objects[obj.id] = obj
        return await self.publish_gamestate()

    async def get_object(self, object_id: str) -> RenderObject | None:
        return self.objects.get(object_id, None)

    async def update_object(self, object: RenderObject):
        if object.id not in self.objects:
            return await self.publish_gamestate()

        self.objects[object.id] = object
        return await self.publish_gamestate()

    async def delete_terrain(self, terrain_id: str):
        if terrain_id not in self.terrain:
            return await self.publish_terrain()

        del self.terrain[terrain_id]
        return await self.publish_terrain()

    async def delete_object(self, object_id: str):
        if object_id not in self.objects:
            return await self.publish_gamestate()

        del self.objects[object_id]
        return await self.publish_gamestate()

    def get_render_object_window(self, x_start: int, y_start: int, x_end: int, y_end: int, dict=False):
        position_obs = self.position_objects()
        window_objects = {}
        for x in range(x_start, x_end + 1):
            for y in range(y_start, y_end + 1):
                pos_key = f"{x}_{y}"
                if pos_key in position_obs:
                    for obj in position_obs[pos_key]:
                        window_objects[obj.id] = obj.to_dict() if dict else obj
        return window_objects

    def get_render_object(self, object_id: str) -> RenderObject | None:
        return self.render_objects().get(object_id, None)

    def render_objects(self, realm=None, dict=False):
        render_objects = {**self.characters, **self.objects}

        if realm:
            render_objects = {key: obj for key, obj in render_objects.items() if obj.realm == realm}

        if dict:
            return {key: obj.to_dict() for key, obj in render_objects.items()}

        return render_objects

    def position_objects(self, realm=None, dict=False):
        position_objects = {}
        render_objects = self.render_objects(realm=realm)
        for obj in render_objects.values():
            pos_key = f"{obj.x}_{obj.y}"
            if pos_key not in position_objects:
                position_objects[pos_key] = []
            position_objects[pos_key].append(obj.to_dict() if dict else obj)
        return position_objects

    def get_gamestate(self, realm=None) -> dict:
        if not realm:
            print("Warning: Getting gamestate without realm filtering")
        return {
            "start_datetime": self.start_datetime.isoformat(),
            "server_datetime": datetime.now().isoformat(),
            "render_objects": self.render_objects(realm=realm, dict=True),
            "position_objects": self.position_objects(realm=realm, dict=True)
        }
