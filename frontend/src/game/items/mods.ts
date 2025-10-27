// Enums
export enum ItemModType {
    TOOL = "tool",
    WEAPON = "weapon",
    ARMOR = "armor",
}

export enum ToolMod {
    EFFICIENCY = "efficiency",
    INCREASED_EFFICIENCY = "increased_efficiency",
    FORTUNE = "fortune",
    LUCK = "luck",
}

export enum WeaponMod {
    PHYSICAL_DAMAGE = "physical_damage",
    FIRE_DAMAGE = "fire_damage",
    COLD_DAMAGE = "cold_damage",
    LIGHTNING_DAMAGE = "lightning_damage",
    CHAOS_DAMAGE = "chaos_damage",
    INCREASED_DAMAGE = "increased_damage",
    INCREASED_ELEMENTAL_DAMAGE = "increased_elemental_damage",
    ADDED_CRIT_CHANCE = "added_crit_chance",
    INCREASED_CRIT_CHANCE = "increased_crit_chance",
    CRIT_MULTIPLIER = "crit_multiplier",
    LUCK = "luck",
    FORTUNE = "fortune",
}

export enum ArmorMod {
    MAX_HP = "max_hp",
    INCREASED_HP = "increased_hp",
    PHYSICAL_RESISTANCE = "physical_resistance",
    ELEMENTAL_RESISTANCE = "elemental_resistance",
    FIRE_RESISTANCE = "fire_resistance",
    COLD_RESISTANCE = "cold_resistance",
    LIGHTNING_RESISTANCE = "lightning_resistance",
    CHAOS_RESISTANCE = "chaos_resistance",
    REFLECT = "reflect",
}

// Helper types
type NumList = number[]
type ModValues<T extends string> = Record<T, NumList>

// Values
export const toolModValue: ModValues<ToolMod> = {
    [ToolMod.EFFICIENCY]: [200, 170, 150, 100, 70, 40, 20, 12, 8, 5],
    [ToolMod.INCREASED_EFFICIENCY]: [100, 80, 60, 40, 30, 20, 15, 10, 7, 5],
    [ToolMod.FORTUNE]: [10, 7, 5, 4, 3, 3, 2, 2, 1, 1],
    [ToolMod.LUCK]: [7, 6, 5, 4, 3, 2, 2, 1, 1, 1],
}

export const weaponModValue: ModValues<WeaponMod> = {
    [WeaponMod.PHYSICAL_DAMAGE]: [100, 70, 50, 30, 20, 15, 10, 7, 5, 3],
    [WeaponMod.FIRE_DAMAGE]: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    [WeaponMod.COLD_DAMAGE]: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    [WeaponMod.LIGHTNING_DAMAGE]: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    [WeaponMod.CHAOS_DAMAGE]: [100, 80, 60, 40, 30, 20, 15, 10, 7, 5],
    [WeaponMod.INCREASED_DAMAGE]: [100, 80, 60, 40, 30, 20, 15, 10, 7, 5],
    [WeaponMod.INCREASED_ELEMENTAL_DAMAGE]: [100, 80, 60, 40, 30, 20, 15, 10, 7, 5],
    [WeaponMod.ADDED_CRIT_CHANCE]: [30, 20, 15, 12, 10, 8, 6, 5],
    [WeaponMod.INCREASED_CRIT_CHANCE]: [100, 80, 70, 50, 40, 30, 20, 10],
    [WeaponMod.CRIT_MULTIPLIER]: [200, 170, 150, 130, 120, 100, 80, 60, 40, 20],
    [WeaponMod.LUCK]: [7, 6, 5, 4, 3, 2, 2, 1, 1, 1],
    [WeaponMod.FORTUNE]: [10, 7, 5, 4, 3, 3, 2, 2, 1, 1],
}

export const armorModValue: ModValues<ArmorMod> = {
    [ArmorMod.MAX_HP]: [1000, 700, 500, 400, 300, 200, 150, 130, 100, 80, 60, 40, 20],
    [ArmorMod.INCREASED_HP]: [100, 80, 60, 40, 30, 20, 15, 10, 7, 5],
    [ArmorMod.PHYSICAL_RESISTANCE]: [50, 45, 40, 30, 35, 20, 15, 10, 7, 5],
    [ArmorMod.ELEMENTAL_RESISTANCE]: [30, 25, 20, 15, 12, 10, 7, 5],
    [ArmorMod.FIRE_RESISTANCE]: [50, 45, 40, 30, 35, 20, 15, 10, 7, 5],
    [ArmorMod.COLD_RESISTANCE]: [50, 45, 40, 30, 35, 20, 15, 10, 7, 5],
    [ArmorMod.LIGHTNING_RESISTANCE]: [50, 45, 40, 30, 35, 20, 15, 10, 7, 5],
    [ArmorMod.CHAOS_RESISTANCE]: [50, 45, 40, 30, 35, 20, 15, 10, 7, 5],
    [ArmorMod.REFLECT]: [160, 140, 120, 100, 80, 60, 50, 40, 30, 20],
}

// Aggregated structure analogous to Python `item_mods`
export const itemMods = {
    [ItemModType.TOOL]: {
        mods: Object.values(ToolMod) as ToolMod[],
        values: toolModValue,
    },
    [ItemModType.WEAPON]: {
        mods: Object.values(WeaponMod) as WeaponMod[],
        values: weaponModValue,
    },
    [ItemModType.ARMOR]: {
        mods: Object.values(ArmorMod) as ArmorMod[],
        values: armorModValue,
    },
} as const

export function getModTier(
    modType: ItemModType | string,
    mod: ToolMod | WeaponMod | ArmorMod | string,
    value: number
): number {
    const modValues = itemMods[modType].values[mod as any]
    if (!modValues) {
        console.log("Mod values not found for", modType, mod)
        return -1
    }
    const tier = modValues.indexOf(value)
    return tier !== -1 ? tier + 1 : -1
}
