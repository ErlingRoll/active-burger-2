from .entity import Entity


class Character(Entity):

    account_id: str
    type: str = "character"
    direction: str = "right"
