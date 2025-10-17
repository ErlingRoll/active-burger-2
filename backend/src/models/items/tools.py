from src.models.items.mods import ToolMod, mod_value
from src.models.item import Item


class Tool(Item):
    type: str = "tool"
    stackable: bool = False
    count: int = 1


class Pickaxe(Tool):
    item_id: str = "pickaxe"
    name: str = "Pickaxe"
    description: str = "Looks a bit rusty but probably useful for mining."
    texture: str = "tool/pickaxe"
    value: int = 50
    base_mods: dict = {
        ToolMod.EFFICIENCY.value: mod_value[ToolMod.EFFICIENCY.value][8],
        ToolMod.FORTUNE.value: mod_value[ToolMod.FORTUNE.value][8]
    }
