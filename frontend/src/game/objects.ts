import { RenderObject } from "../models/object"

export const TERRAIN_OBJECTS: { [object_id: string]: Partial<RenderObject> } = {
    gold_ore: {
        name: "Gold Ore",
        object_id: "gold_ore",
        texture: "terrain/ore/gold",
    },
    shopkeeper: {
        name: "Shopkeeper",
        object_id: "shopkeeper",
        texture: "npcs/shopkeeper",
    },
    crafting_bench: {
        name: "Crafting Bench",
        object_id: "crafting_bench",
        texture: "misc/crafting_bench",
    },
}
