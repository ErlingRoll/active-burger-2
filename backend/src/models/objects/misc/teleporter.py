
from asyncio import create_task, gather

from pydantic import BaseModel
from src.database.character import update_character
from src.models.render_object import RenderObject
from src.models.objects.steppable import Steppable
from src.generators.world import Realm


class TeleporterProps(BaseModel):
    target_x: int
    target_y: int
    target_realm: Realm


class Teleporter(Steppable):
    object_id: str = "teleporter"
    name_visible: bool = True
    props: TeleporterProps

    async def on_step(self, database, gamestate, account, character):
        character_state = gamestate.get_character_state(character.id)
        if not character_state:
            return

        character_state.x = self.props.target_x
        character_state.y = self.props.target_y
        character_state.realm = self.props.target_realm

        await update_character(database, character_state.to_character())

        gamestate.set_realm(character.id, self.props.target_realm)
        await gather(
            gamestate.publish_gamestate(),
            gamestate.publish_terrain(),
        )
        return await gamestate.publish_character(account, character_id=character.id)

    def to_db_model(self) -> RenderObject:
        return RenderObject.model_construct(**self.model_dump(exclude={"db_type"}))
