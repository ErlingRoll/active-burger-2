from pydantic import BaseModel, ConfigDict
from typing import Dict, Optional
from src.models import Entity, Item


class Character(Entity):
    account_id: str
    type: str = "character"
    direction: str = "right"
    gold: int = 100
    name_visible: bool = True
    solid: bool = True

    model_config = ConfigDict(extra="allow")


class CharacterData(Character):
    items: Dict[str, Item] = {}
    equipment: Dict[str, Optional[Item]] = {}

    def to_character(self) -> Character:
        data = self.model_dump()
        data.pop("items", None)
        data.pop("equipment", None)
        return Character(**data)
