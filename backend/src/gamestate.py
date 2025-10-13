import datetime
from typing import Dict
from supabase import Client

from src.models.account import Account
from src.database.character import get_character_data_by_id
from src.database.object import get_objects
from src.models.render_object import RenderObject
from src.models.character import Character, CharacterData


class Gamestate:
    start_datetime = None
    characters: dict[str, Character] = {}
    objects: dict[str, RenderObject] = {}
    database: Client
    connection_manager = None

    def __init__(self, client, connection_manager):
        self.start_datetime = datetime.datetime.now()
        self.database = client
        self.connection_manager = connection_manager
        self.fetch_gamestate()

    def fetch_gamestate(self):
        self.objects = self.fetch_objects()
        self.characters = self.fetch_characters()

    def fetch_objects(self) -> Dict[str, RenderObject]:
        return get_objects(self.database, dict=True)

    def fetch_characters(self):
        data = self.database.table("character").select("*").execute()
        if data and data.data:
            characters = {char["id"]: Character(**char) for char in data.data}
            return characters
        return {}

    async def publish_character(self, account: Account, character_id: str = None, character_data: CharacterData = None):
        if not character_id and not character_data:
            raise ValueError("Either character_id or character_data must be provided")

        _character_data = character_data
        if character_id and not character_data:
            _character_data = get_character_data_by_id(self.database, character_id)

        event = {
            "event": "character_update",
            "payload": _character_data.model_dump()
        }

        await self.connection_manager.send(account.id, event)

    async def publish_gamestate(self):
        gamestate = self.get_gamestate()
        event = {
            "event": "gamestate_update",
            "payload": gamestate
        }
        await self.connection_manager.broadcast(event)
        return gamestate

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

    async def add_object(self, obj: RenderObject):
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

    async def delete_object(self, object_id: str):
        if object_id not in self.objects:
            return await self.publish_gamestate()

        del self.objects[object_id]
        return await self.publish_gamestate()

    def get_render_object(self, object_id: str) -> RenderObject | None:
        return self.render_objects().get(object_id, None)

    def render_objects(self, dict=False):
        render_objects = {**self.characters, **self.objects}

        if dict:
            return {key: obj.to_dict() for key, obj in render_objects.items()}

        return render_objects

    def position_objects(self, dict=False):
        position_objects = {}
        render_objects = self.render_objects()
        for obj in render_objects.values():
            pos_key = f"{obj.x}_{obj.y}"
            if pos_key not in position_objects:
                position_objects[pos_key] = []
            position_objects[pos_key].append(obj.to_dict() if dict else obj)
        return position_objects

    def get_gamestate(self):
        return {
            "start_datetime": self.start_datetime.isoformat(),
            "server_datetime": datetime.datetime.now().isoformat(),
            "render_objects": self.render_objects(dict=True),
            "position_objects": self.position_objects(dict=True)
        }
