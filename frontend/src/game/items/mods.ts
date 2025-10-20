export enum ToolMod {
    EFFICIENCY = "efficiency",
    FORTUNE = "fortune",
}

export const toolModValue: Record<ToolMod, number[]> = {
    [ToolMod.EFFICIENCY]: [200, 170, 150, 100, 70, 40, 20, 12, 8, 5],
    [ToolMod.FORTUNE]: [10, 8, 7, 6, 5, 4, 3, 2, 1, 1],
}

export enum WeaponMod {
    PHYSICAL_DAMAGE = "physical_damage",
    FIRE_DAMAGE = "fire_damage",
    COLD_DAMAGE = "cold_damage",
    LIGHTNING_DAMAGE = "lightning_damage",
    REPEAT = "repeat",
    LUCK = "luck",
}

export const weaponModValue: Record<WeaponMod, number[]> = {
    [WeaponMod.PHYSICAL_DAMAGE]: [100, 70, 50, 30, 20, 15, 10, 7, 5, 3],
    [WeaponMod.FIRE_DAMAGE]: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    [WeaponMod.COLD_DAMAGE]: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    [WeaponMod.LIGHTNING_DAMAGE]: [80, 60, 40, 25, 15, 10, 7, 5, 3, 2],
    [WeaponMod.REPEAT]: [10, 5, 4, 3, 2, 2, 2, 1, 1, 1],
    [WeaponMod.LUCK]: [7, 6, 5, 4, 3, 2, 2, 1, 1, 1],
}
