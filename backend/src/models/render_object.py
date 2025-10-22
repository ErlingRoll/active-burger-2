import json
from typing import Optional
from pydantic import BaseModel, ConfigDict


class RenderObject(BaseModel):
    # Characters, Objects, NPCs, etc.

    id: Optional[str] = None
    created_at: Optional[str] = None
    type: Optional[str] = "object"
    name: str
    name_visible: bool = True
    x: int = 0
    y: int = 0
    texture: Optional[str] = None
    height: Optional[int] = None  # in pixels
    width: Optional[int] = None  # in pixels
    solid: bool = False
    object_id: Optional[str] = None
    model_config = ConfigDict(extra="allow")

    # Non-DB fields
    db_type: str = "object"

    def to_dict(self):
        return {**self.__dict__, **self.model_extra}

    def to_json_string(self):
        return json.dumps(self.to_dict())

    def to_db_model(self) -> "RenderObject":
        return RenderObject.model_construct(**self.model_dump(exclude={"db_type"}))

    def prep_db(self) -> dict:
        data = self.to_db_model().model_dump()
        remove_keys = ["id", "created_at", "db_type", "expDrop", "loot_table", "chance",
                       "amount",
                       "random_amount", "power"]
        for key in remove_keys:
            data.pop(key, None)
        return data
