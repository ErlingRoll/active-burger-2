import { RenderObject } from "../models/object"

export const TERRAIN_OBJECTS: { [object_id: string]: Partial<RenderObject> } = {
    rock: {
        name: "Rock",
        object_id: "rock",
        texture: "terrain/rock",
    },
    bush: {
        name: "Bush",
        object_id: "bush",
        texture: "terrain/bush",
    },
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
}
