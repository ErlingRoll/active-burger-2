from src.models.item import Item


class Burger(Item):

    item_id = "burger"

    def __init__(self, **data):
        super().__init__(**data)
        self.name = "Burger"
        self.description = "Pretty decent BK burger. Greasy AF."
        self.texture = "burger_texture.png"
        self.value = 5
        self.type = "food"
        self.stackable = True
        self.count = data.get("count", 1)
