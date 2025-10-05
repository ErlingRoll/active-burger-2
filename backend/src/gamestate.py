import datetime
import json
from pyventus.events import AsyncIOEventEmitter, EventEmitter, EventLinker

from src.models.render_object import RenderObject
from src.models.character import Character


class Gamestate:

    start_datetime = None
    render_objects: dict[str, RenderObject] = {}

    def __init__(self):
        self.start_datetime = datetime.datetime.now()

    def publishGamestate(self):
        gamestate = self.getGamestate()
        emitter = AsyncIOEventEmitter()
        emitter.emit("gamestate_update", gamestate)
        return gamestate

    def addCharacter(self, character: Character):
        self.render_objects[character.id] = character
        self.publishGamestate()

    def getGamestate(self):
        return {
            "start_datetime": self.start_datetime.isoformat(),
            "server_datetime": datetime.datetime.now().isoformat(),
            "render_objects": {key: obj.to_dict() for key, obj in self.render_objects.items()}
        }
