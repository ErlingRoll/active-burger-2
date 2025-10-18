from src.models.items.mods import ToolMod, mod_value
from src.models.item import Item
from src.models.equipment import EquipSlot


class Tool(Item):
    type: str = "tool"
    stackable: bool = False
    count: int = 1
    equipable: bool = True


class Pickaxe(Tool):
    item_id: str = "pickaxe"
    name: str = "Pickaxe"
    description: str = "Looks a bit rusty but probably useful for mining."
    texture: str = "tool/pickaxe"
    value: int = 50
    equip_slot: str = EquipSlot.PICKAXE.value
    base_mods: dict = {
        ToolMod.EFFICIENCY.value: mod_value[ToolMod.EFFICIENCY.value][8],
        ToolMod.FORTUNE.value: mod_value[ToolMod.FORTUNE.value][8]
    }
