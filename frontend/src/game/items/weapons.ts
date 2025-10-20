import { Equipment } from "../../models/item"
import { WeaponMod, weaponModValue } from "./mods"

export const WEAPONS: { [object_id: string]: Partial<Equipment> } = {
    toothpick: {
        item_id: "toothpick",
        name: "Toothpick",
        description: "You COULD play golf with this.",
        type: "weapon",
        texture: "item/weapon/toothpick",
        count: 1,
        stackable: false,
        value: 5,
        base_mods: {
            [WeaponMod.PHYSICAL_DAMAGE]: weaponModValue[WeaponMod.PHYSICAL_DAMAGE][9],
        },
    },
}
