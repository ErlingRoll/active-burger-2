from typing import List, Optional
from pydantic import BaseModel


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

    async def use(self, *args, **kwargs) -> UseResult:
        return UseResult(success=False, log=[f"Item [{self.name}] cannot be used."])
