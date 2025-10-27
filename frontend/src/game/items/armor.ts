import { Equipment } from "../../models/item"

export const ARMOR: { [id: string]: Partial<Equipment> } = {
    hoodie: {
        item_id: "hoodie",
        name: "Hoodie",
        description: "A comfy looking hoodie. Provides minimal protection.",
        count: 1,
        texture: "item/armor/hoodie",
        value: 500,
        type: "armor",
        stackable: false,
        equipable: true,
        base_mods: {
            max_hp: 50,
            physical_resistance: 10,
        },
    },
}
