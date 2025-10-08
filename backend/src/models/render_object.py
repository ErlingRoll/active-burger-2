import json
from typing import Optional
from pydantic import BaseModel


class RenderObject(BaseModel):

    # Characters, Objects, NPCs, etc.

    id: str
    type: str = "object"
    created_at: str
    name: str
    name_visible: bool = True
    x: int
    y: int
    texture: Optional[str] = None
    height: Optional[int] = None  # in pixels
    width: Optional[int] = None  # in pixels
    solid: bool = False

    def get_attributes(self):
        # Get all attributes that are not callable (i.e. not methods)
        return {
            k: v
            for k, v in self.__dict__.items()
            if not callable(v)
        }

    def to_dict(self):
        return self.get_attributes()

    def to_json_string(self):
        return json.dumps(self.to_dict())
