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
    x: int
    y: int
    texture: Optional[str] = None
    height: Optional[int] = None  # in pixels
    width: Optional[int] = None  # in pixels
    solid: bool = False
    object_id: Optional[str] = None

    model_config = ConfigDict(extra="allow")

    def to_dict(self):
        return {**self.__dict__, **self.model_extra}

    def to_json_string(self):
        return json.dumps(self.to_dict())
