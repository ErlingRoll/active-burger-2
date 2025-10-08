from src.models.item import Item


class Burger(Item):

    item_id: str = "burger"
    name: str = "Burger"
    description: str = "Pretty decent BK burger. Greasy AF."
    texture: str = "burger_texture.png"
    value: int = 5
    type: str = "food"
    stackable: bool = True
    count: int = 1
