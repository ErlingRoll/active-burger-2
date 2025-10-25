import { Equipment } from "../../models/item"

export const TOOLS: { [id: string]: Partial<Equipment> } = {
    pickaxe: {
        item_id: "pickaxe",
        name: "Pickaxe",
        description: "Looks a bit rusty but probably useful for mining.",
        count: 1,
        texture: "item/tool/pickaxe",
        value: 50,
        type: "tool",
        stackable: false,
        equipable: true,
        base_mods: {
            efficiency: 5,
            fortune: 1,
        },
    },
}
