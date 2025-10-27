from supabase_auth import Any
from src.models.items.mods import WeaponMod
from src.models.objects.loot_table import LootTable, LootTableItem
from .monster import Monster


class Vampire(Monster):
    name: str = "Vampire"
    object_id: str = "vampire"
    texture: str = "monster/vampire"
    max_hp: int = 120
    current_hp: int = 120
    power: int = 14
    expDrop: int = 29
    props: dict[str, Any] = {
        "weapon_mods": {
            WeaponMod.PHYSICAL_DAMAGE.value: 20,
            WeaponMod.CHAOS_DAMAGE.value: 20,
            WeaponMod.ADDED_CRIT_CHANCE.value: 5,
        }
    }

    loot_table: LootTable = LootTable(
        items=[
            LootTableItem(
                item_id="burger",
                chance=0.2,
                amount=3,
            ),
            LootTableItem(
                item_id="scouring_orb",
                chance=0.1,
                amount=1,
                random_amount=2
            ),
            LootTableItem(
                item_id="transmutation_orb",
                chance=0.2,
                amount=1,
                random_amount=2
            ),
            LootTableItem(
                item_id="alteration_orb",
                chance=0.8,
                amount=2,
                random_amount=5
            ),
            LootTableItem(
                item_id="alchemy_orb",
                chance=0.2,
                amount=1,
                random_amount=3
            ),
            LootTableItem(
                item_id="chaos_orb",
                chance=0.5,
                amount=2,
                random_amount=4
            ),
        ]
    )
