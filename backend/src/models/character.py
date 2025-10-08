from typing import Dict

from src.models.item import Item
from src.models.entity import Entity


class Character(Entity):

    account_id: str
    type: str = "character"
    direction: str = "right"


class CharacterData(Character):

    items: Dict[str, Item] = {}
