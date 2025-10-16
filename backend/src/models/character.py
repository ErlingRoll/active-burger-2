from pydantic import ConfigDict
from typing import Dict, Optional
from src.models import Entity, Item


class Character(Entity):
    account_id: str
    type: str = "character"
    direction: str = "right"
    gold: int = 0
    name_visible: bool = True

    model_config = ConfigDict(extra="allow")


class CharacterData(Character):
    items: Dict[str, Item] = {}

    def to_character(self) -> Character:
        data = self.model_dump()
        data.pop("items", None)
        return Character(**data)
