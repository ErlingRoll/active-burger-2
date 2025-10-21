from enum import Enum
from typing import List, Optional
from pydantic import BaseModel


class Rarity(str, Enum):
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"
    ARTIFACT = "artifact"


class UseResult(BaseModel):
    success: bool
    log: List[str] | None = []


class Item(BaseModel):
    id: Optional[str] = None
    created_at: Optional[str] = None
    item_id: Optional[str] = None
    character_id: Optional[str] = None
    name: str
    description: Optional[str] = None
    texture: str
    value: Optional[int] = None
    type: str = "item"
    stackable: Optional[bool] = False
    count: Optional[int] = 1
    consumable: Optional[bool] = False
    base_mods: dict = {}
    mods: dict = {}
    equipable: Optional[bool] = False
    equip_slot: Optional[str] = None
    rarity: Rarity = Rarity.COMMON

    async def use(self, *args, **kwargs) -> UseResult:
        return UseResult(success=False, log=[f"Item [{self.name}] cannot be used."])

    def add_mod(self, mod_id: str, value: int):
        self.mods[mod_id] = value

    def to_item(self):
        # Only DB model fields
        return Item(
            id=self.id,
            item_id=self.item_id,
            character_id=self.character_id,
            name=self.name,
            description=self.description,
            texture=self.texture,
            value=self.value,
            type=self.type,
            stackable=self.stackable,
            count=self.count,
            consumable=self.consumable,
            base_mods=self.base_mods,
            mods=self.mods,
            equipable=self.equipable,
            equip_slot=self.equip_slot,
            rarity=self.rarity,
        )

    def prep_db(self) -> dict:
        data = self.to_item().model_dump()
        del data["id"]
        del data["created_at"]
        return data
