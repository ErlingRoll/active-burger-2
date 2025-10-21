from pydantic import BaseModel, ConfigDict
from typing import Dict, Optional
from src.models import Entity, Item


class Character(Entity):
    account_id: str
    type: str = "character"
    direction: str = "right"
    gold: int = 100
    name_visible: bool = True
    solid: bool = False

    model_config = ConfigDict(extra="allow")

    def to_character(self):
        # Only DB model fields
        return Character(
            id=self.id,
            created_at=self.created_at,
            account_id=self.account_id,
            name=self.name,
            x=self.x,
            y=self.y,
            max_hp=self.max_hp,
            current_hp=self.current_hp,
            direction=self.direction,
            name_visible=self.name_visible,
            solid=self.solid,
            texture=self.texture,
            type=self.type,
            object_id=self.object_id,
            gold=self.gold
        )

    def db_prep(self) -> dict:
        data = self.to_character().model_dump()
        del data["id"]
        del data["created_at"]
        del data["height"]
        del data["width"]
        del data["db_type"]
        return data


class CharacterData(Character):
    items: Dict[str, Item] = {}
    equipment: Dict[str, Optional[Item]] = {}

    def to_character(self) -> Character:
        data = self.model_dump()
        data.pop("items", None)
        data.pop("equipment", None)
        return Character(**data)
