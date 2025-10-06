import datetime
import json
from pyventus.events import AsyncIOEventEmitter, EventEmitter, EventLinker

from src.models.render_object import RenderObject
from src.models.character import Character


class Gamestate:

    start_datetime = None
    render_objects: dict[str, RenderObject] = {}
    connection_manager = None

    def __init__(self, connection_manager):
        self.start_datetime = datetime.datetime.now()
        self.connection_manager = connection_manager

    async def publishGamestate(self):
        gamestate = self.getGamestate()
        event = {
            "event": "gamestate_update",
            "payload": gamestate
        }
        await self.connection_manager.broadcast(event)
        return gamestate

    async def addCharacter(self, character: Character):
        if character.id in self.render_objects:
            return await self.publishGamestate()

        self.render_objects[character.id] = character
        return await self.publishGamestate()

    def get_character(self, character_id: str) -> Character | None:
        obj = self.render_objects.get(character_id)
        if isinstance(obj, Character):
            return obj
        return None

    def create_pos_objects(self):
        pos_objects = {}
        for obj in self.render_objects.values():
            pos_key = f"{obj.x}_{obj.y}"
            if pos_key not in pos_objects:
                pos_objects[pos_key] = []
            pos_objects[pos_key].append(obj.to_dict())
        return pos_objects

    def getGamestate(self):
        return {
            "start_datetime": self.start_datetime.isoformat(),
            "server_datetime": datetime.datetime.now().isoformat(),
            "render_objects": {key: obj.to_dict() for key, obj in self.render_objects.items()},
            "position_objects": self.create_pos_objects()
        }
