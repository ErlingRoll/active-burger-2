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
    consumable: boolean
    count: number
    character_id: string
    rarity: string
    equipable?: boolean
    base_mods: { [key: string]: number }
    mods: { [key: string]: number }
}

export interface Equipment extends Item {}

export enum EquipSlot {
    WEAPON = "weapon",
    ARMOR = "armor",
    PICKAXE = "pickaxe",
}

export const EQUIP_SLOTS: EquipSlot[] = Object.values(EquipSlot)
