from typing import Optional
from pydantic import BaseModel


class UseResult(BaseModel):
    success: bool
    message: str | None = None


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

    def use(self) -> UseResult:  # Returns whether the item was used successfully
        return UseResult(success=False, message="This item cannot be used.")
