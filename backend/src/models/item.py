from pydantic import BaseModel


class UseResult(BaseModel):
    success: bool
    message: str | None = None


class Item(BaseModel):

    id: str | None = None
    item_id: str | None = None
    created_at: str | None = None
    name: str
    description: str | None = None
    texture: str
    value: int | None = None
    type: str = "item"
    stackable: bool | None = False
    count: int | None = 1

    def use(self) -> UseResult:  # Returns whether the item was used successfully
        return UseResult(success=False, message="This item cannot be used.")
