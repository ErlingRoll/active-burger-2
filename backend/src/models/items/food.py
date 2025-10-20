from src.models import Character, Item, UseResult


class Burger(Item):
    item_id: str = "burger"
    name: str = "Burger"
    description: str = "Pretty decent BK burger. Greasy AF."
    texture: str = "item/food/burger"
    value: int = 5
    type: str = "food"
    stackable: bool = True
    count: int = 1
    consumable: bool = True

    async def use(self, character: Character | None = None, database=None, *args, **kwargs) -> UseResult:
        from src.database.character import update_character

        if not character or not database:
            return UseResult(success=False, log=["Failed to eat burger: Server error"])

        character.current_hp = min(character.max_hp, character.current_hp + 20)

        await update_character(database, character)
        # Thread(target=lambda: run(update_character(database, character))).start()

        return UseResult(success=True, log=[f"The delicious burger restores 20 HP"])
