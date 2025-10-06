import datetime
import json
from pyventus.events import AsyncIOEventEmitter, EventEmitter, EventLinker
from supabase import Client

from src.models.render_object import RenderObject
from src.models.character import Character


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

    def fetch_objects(self):
        data = self.database.table("object").select("*").execute()
        if data and data.data:
            return {obj["id"]: RenderObject(**obj) for obj in data.data}
        return {}

    def fetch_characters(self):
        data = self.database.table("character").select("*").execute()
        if data and data.data:
            characters = {char["id"]: Character(**char) for char in data.data}
            return characters
        return {}

    async def publishGamestate(self):
        gamestate = self.getGamestate()
        event = {
            "event": "gamestate_update",
            "payload": gamestate
        }
        await self.connection_manager.broadcast(event)
        return gamestate

    async def addCharacter(self, character: Character):
        if character.id in self.characters:
            return await self.publishGamestate()

        self.characters[character.id] = character
        return await self.publishGamestate()

    def get_character(self, character_id: str) -> Character | None:
        obj = self.characters.get(character_id)
        if isinstance(obj, Character):
            return obj
        return None

    async def addObject(self, obj: RenderObject):
        if obj.id in self.objects:
            return await self.publishGamestate()

        self.objects[obj.id] = obj
        return await self.publishGamestate()

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

    def getGamestate(self):
        return {
            "start_datetime": self.start_datetime.isoformat(),
            "server_datetime": datetime.datetime.now().isoformat(),
            "render_objects": self.render_objects(dict=True),
            "position_objects": self.position_objects(dict=True)
        }
