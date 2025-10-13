from src.models.item import UseResult
from src.database.character import update_character
from src.models import Item
from src.models import Account, Character
from src.gamestate import Gamestate


class Burger(Item):
    item_id: str = "burger"
    name: str = "Burger"
    description: str = "Pretty decent BK burger. Greasy AF."
    texture: str = "burger"
    value: int = 5
    type: str = "food"
    stackable: bool = True
    count: int = 1
    consumable: bool = True

    async def use(self, character: Character = None, database=None, *args, **kwargs) -> UseResult:
        character.current_hp = min(character.max_hp, character.current_hp + 20)
        update_character(database, character)

        return UseResult(success=True, log=[f"The delicious burger restores 20 HP"])
