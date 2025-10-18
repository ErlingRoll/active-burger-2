from enum import Enum
from typing import Optional
from pydantic import BaseModel

from src.models import Item


class EquipSlot(Enum):
    WEAPON = "weapon"
    ARMOR = "armor"
    PICKAXE = "pickaxe"


class Equipment(BaseModel):
    id: Optional[str] = None
    created_at: Optional[str] = None
    character_id: Optional[str] = None
    slot: Optional[str] = None

    item_id: Optional[str] = None
    item: Optional[Item] = None
