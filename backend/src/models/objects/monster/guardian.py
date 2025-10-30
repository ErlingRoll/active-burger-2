from supabase_auth import Any
from src.models.items.mods import WeaponMod
from src.models.objects.loot_table import LootTable, LootTableItem
from .monster import Monster


class Guardian(Monster):
    name: str = "Guardian"
    object_id: str = "guardian"
    texture: str = "monster/guardian"
    max_hp: int = 300
    current_hp: int = 300
    power: int = 14
    expDrop: int = 50
    props: dict[str, Any] = {
        "weapon_mods": {
            WeaponMod.PHYSICAL_DAMAGE.value: 50,
            WeaponMod.LIGHTNING_DAMAGE.value: 100,
            WeaponMod.ADDED_CRIT_CHANCE.value: 50,
            WeaponMod.CRIT_MULTIPLIER.value: 50,
        }
    }

    loot_table: LootTable = LootTable(
        items=[
            LootTableItem(item_id="kebab", chance=1, amount=1),
        ]
    )
