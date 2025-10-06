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
        self.render_objects[character.id] = character
        await self.publishGamestate()

    def getGamestate(self):
        return {
            "start_datetime": self.start_datetime.isoformat(),
            "server_datetime": datetime.datetime.now().isoformat(),
            "render_objects": {key: obj.to_dict() for key, obj in self.render_objects.items()}
        }
