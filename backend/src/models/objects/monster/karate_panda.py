from src.models.objects.loot_table import LootTable, LootTableItem
from .monster import Monster


class KaratePanda(Monster):
    name: str = "Karate Panda"
    object_id: str = "karate_panda"
    texture: str = "monster/karate_panda"
    max_hp: int = 35
    current_hp: int = 35
    power: int = 7
    expDrop: int = 29
    loot_table: LootTable = LootTable(
        items=[
            LootTableItem(
                item_id="chaos_orb",
                chance=1,
                amount=1,
            ),
            LootTableItem(
                item_id="alchemy_orb",
                chance=1,
                amount=1,
            ),
            LootTableItem(
                item_id="scouring_orb",
                chance=1,
                amount=1,
            ),
            LootTableItem(
                item_id="transmutation_orb",
                chance=1,
                amount=1,
            ),
            LootTableItem(
                item_id="alteration_orb",
                chance=1,
                amount=1,
            ),
        ]
    )
