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
        equipable: true,
        value: 10,
        base_mods: {
            [WeaponMod.PHYSICAL_DAMAGE]: weaponModValue[WeaponMod.PHYSICAL_DAMAGE][9],
        },
    },
    pool_noodle: {
        item_id: "pool_noodle",
        name: "Pool Noodle",
        description: "Perfect for cooking up a storm... or bashing heads.",
        type: "weapon",
        texture: "item/weapon/pool_noodle",
        count: 1,
        stackable: false,
        equipable: true,
        value: 50,
        base_mods: {
            [WeaponMod.PHYSICAL_DAMAGE]: weaponModValue[WeaponMod.PHYSICAL_DAMAGE][7],
        },
    },
    frying_pan: {
        item_id: "frying_pan",
        name: "Frying Pan",
        description: "Perfect for cooking up a storm... or bashing heads.",
        type: "weapon",
        texture: "item/weapon/frying_pan",
        count: 1,
        stackable: false,
        equipable: true,
        value: 300,
        base_mods: {
            [WeaponMod.PHYSICAL_DAMAGE]: weaponModValue[WeaponMod.PHYSICAL_DAMAGE][7],
            [WeaponMod.FIRE_DAMAGE]: weaponModValue[WeaponMod.FIRE_DAMAGE][8],
        },
    },
}
