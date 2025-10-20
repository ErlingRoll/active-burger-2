export interface Item {
    id: string
    created_at: string
    item_id: string
    name: string
    description: string
    texture: string
    value: number
    type: string
    stackable: boolean
    count: number
    character_id: string
    rarity: string
    equipable?: boolean
}

export interface Equipment extends Item {
    base_mods: { [key: string]: number }
    mods: { [key: string]: number }
}

export enum EquipSlot {
    WEAPON = "weapon",
    ARMOR = "armor",
    PICKAXE = "pickaxe",
}

export const EQUIP_SLOTS: EquipSlot[] = Object.values(EquipSlot)
