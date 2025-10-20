from src.models.items.mods import ToolMod, tool_mod_value
from src.models.item import Item
from src.models.equipment import EquipSlot, Equipment


class Tool(Equipment):
    type: str = "tool"

    def get_efficiency(self) -> int:
        return self.base_mods.get(ToolMod.EFFICIENCY.value, 0)


class Pickaxe(Tool):
    item_id: str = "pickaxe"
    name: str = "Pickaxe"
    description: str = "Looks a bit rusty but probably useful for mining."
    texture: str = "item/tool/pickaxe"
    value: int = 50
    equip_slot: str = EquipSlot.PICKAXE.value
    base_mods: dict = {
        ToolMod.EFFICIENCY.value: tool_mod_value[ToolMod.EFFICIENCY.value][8],
    }
