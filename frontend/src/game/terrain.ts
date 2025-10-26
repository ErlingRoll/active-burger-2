import { Terrain } from "../models/terrain"

export const TERRAIN: { [game_id: string]: Partial<Terrain> } = {
    wood_post: {
        name: "Wood Post",
        game_id: "wood_post",
        texture: "terrain/wood_post",
        solid: true,
    },
    rock: {
        name: "Rock",
        game_id: "rock",
        texture: "terrain/rock",
        solid: true,
    },
    bush: {
        name: "Bush",
        game_id: "bush",
        texture: "terrain/bush",
        solid: true,
    },
    water: {
        name: "Water",
        game_id: "water",
        texture: "terrain/water",
        solid: true,
    },
    water_wave: {
        name: "Water Wave",
        game_id: "water_wave",
        texture: "terrain/water_wave",
        solid: true,
        ext: "gif",
    },
    rock_floor: {
        name: "Rock Floor",
        game_id: "rock_floor",
        texture: "terrain/rock_floor",
        solid: false,
    },
    sandstone: {
        name: "Sandstone",
        game_id: "sandstone",
        texture: "terrain/sandstone",
        solid: false,
        variants: ["top_left", "top", "top_right", "left", "center", "right", "bottom_left", "bottom", "bottom_right"],
    },
}

export const TERRAIN_COLORS: { [game_id: string]: Partial<Terrain> } = {
    red: {
        name: "Red",
        game_id: "color",
        texture: "terrain/color/red",
        solid: false,
    },
    orange: {
        name: "Orange",
        game_id: "color",
        texture: "terrain/color/orange",
        solid: false,
    },
    yellow: {
        name: "Yellow",
        game_id: "color",
        texture: "terrain/color/yellow",
        solid: false,
    },
    green: {
        name: "Green",
        game_id: "color",
        texture: "terrain/color/green",
        solid: false,
    },
    blue: {
        name: "Blue",
        game_id: "color",
        texture: "terrain/color/blue",
        solid: false,
    },
    purple: {
        name: "Purple",
        game_id: "color",
        texture: "terrain/color/purple",
        solid: false,
    },
    brown: {
        name: "Brown",
        game_id: "color",
        texture: "terrain/color/brown",
        solid: false,
    },
}
