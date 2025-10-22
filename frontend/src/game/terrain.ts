import { Terrain } from "../models/terrain"

export const TERRAIN: { [game_id: string]: Partial<Terrain> } = {
    water: {
        name: "Water",
        game_id: "water",
        texture: "terrain/water",
        solid: true,
    },
    sandstone: {
        name: "Sandstone",
        game_id: "sandstone",
        texture: "terrain/sandstone",
        solid: false,
        variants: ["top_left", "top", "top_right", "left", "center", "right", "bottom_left", "bottom", "bottom_right"],
    },
}
