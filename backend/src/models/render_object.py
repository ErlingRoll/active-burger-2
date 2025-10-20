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

    db_type: str = "object"
    model_config = ConfigDict(extra="allow")

    def to_dict(self):
        return {**self.__dict__, **self.model_extra}

    def to_json_string(self):
        return json.dumps(self.to_dict())

    def to_render_object(self):
        # Remove all other fields except those needed for rendering
        return RenderObject(
            id=self.id,
            type=self.type,
            name=self.name,
            name_visible=self.name_visible,
            x=self.x,
            y=self.y,
            texture=self.texture,
            height=self.height,
            width=self.width,
            solid=self.solid,
            object_id=self.object_id,
        )

    def prep_db(self) -> dict:
        data = self.to_render_object().model_dump()
        del data["id"]
        del data["created_at"]
        del data["db_type"]
        return data
