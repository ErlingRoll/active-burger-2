
from enum import Enum


class ItemModType(Enum):
    TOOL = "tool"
    WEAPON = "weapon"


class ToolMod(Enum):
    EFFICIENCY = "efficiency"
    FORTUNE = "fortune"


tool_mod_value = {
    ToolMod.EFFICIENCY.value: [200, 170, 150, 100, 70, 40, 20, 12, 8, 5],
    ToolMod.FORTUNE.value: [10, 8, 7, 6, 5, 4, 3, 2, 1, 1]
}


class WeaponMod(Enum):
    PHYSICAL_DAMAGE = "physical_damage"
    FIRE_DAMAGE = "fire_damage"
    COLD_DAMAGE = "cold_damage"
    LIGHTNING_DAMAGE = "lightning_damage"
    REPEAT = "repeat"
    LUCK = "luck"


weapon_mod_value = {
    WeaponMod.PHYSICAL_DAMAGE.value: [100, 70, 50, 30, 20, 15, 10, 7, 5, 3],
    WeaponMod.FIRE_DAMAGE.value: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    WeaponMod.COLD_DAMAGE.value: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    WeaponMod.LIGHTNING_DAMAGE.value: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    WeaponMod.REPEAT.value: [10, 5, 4, 3, 2, 2, 2, 1, 1, 1],
    WeaponMod.LUCK.value: [7, 6, 5, 4, 3, 2, 2, 1, 1, 1]
}

item_mods = {
    ItemModType.TOOL.value: {
        "mods": [enum.value for enum in ToolMod],
        "values": tool_mod_value,
    },
    ItemModType.WEAPON.value: {
        "mods": [enum.value for enum in WeaponMod],
        "values": weapon_mod_value,
    },
}
