from pydantic import ConfigDict
from typing import Dict, Optional
from src.models import Entity, Item


class Character(Entity):
    account_id: str
    type: str = "character"
    direction: str = "right"

    model_config = ConfigDict(extra="allow")


class CharacterData(Character):
    items: Dict[str, Item] = {}
