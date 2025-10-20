from src.generators.dice import roll
from src.models.damage_hit import DamageHit
from src.models.equipment import EquipSlot, Equipment
from src.models.item import Item
from src.models.items.mods import ToolMod, WeaponMod, weapon_mod_value


class Weapon(Equipment):
    type: str = "weapon"
    equip_slot: str = EquipSlot.WEAPON.value

    def roll_hit(self) -> DamageHit:
        total_physical = self.base_mods.get(WeaponMod.PHYSICAL_DAMAGE.value, 0) + self.mods.get(WeaponMod.PHYSICAL_DAMAGE.value, 0)
        total_fire = self.base_mods.get(WeaponMod.FIRE_DAMAGE.value, 0) + self.mods.get(WeaponMod.FIRE_DAMAGE.value, 0)
        total_cold = self.base_mods.get(WeaponMod.COLD_DAMAGE.value, 0) + self.mods.get(WeaponMod.COLD_DAMAGE.value, 0)
        total_lightning = self.base_mods.get(WeaponMod.LIGHTNING_DAMAGE.value, 0) + self.mods.get(WeaponMod.LIGHTNING_DAMAGE.value, 0)

        luck = self.base_mods.get(WeaponMod.LUCK.value, 0) + self.mods.get(WeaponMod.LUCK.value, 0)

        hit = DamageHit(
            physical=roll(total_physical, 0, luck),
            fire=roll(total_fire, 0, luck),
            cold=roll(total_cold, 0, luck),
            lightning=roll(total_lightning, 0, luck)
        )

        return hit


class Toothpick(Weapon):
    item_id: str = "toothpick"
    name: str = "Toothpick"
    description: str = "You COULD play golf with this."
    texture: str = "item/weapon/toothpick"
    value: int = 5
    base_mods: dict[str, int] = {
        WeaponMod.PHYSICAL_DAMAGE.value: weapon_mod_value[WeaponMod.PHYSICAL_DAMAGE.value][9],
    }
