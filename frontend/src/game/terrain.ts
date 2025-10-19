import { Terrain } from "../models/terrain"

export const TERRAIN: { [game_id: string]: Partial<Terrain> } = {
    water: {
        name: "Water",
        game_id: "water",
        texture: "terrain/water",
        solid: true,
    },
}
