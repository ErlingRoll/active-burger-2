export const TILE_SIZE = 64

export const SHEET_URL = "src/assets/textures/Sprite-Sheet.png"

export type TileRect = { sx: number; sy: number; sw: number; sh: number }

export function getTile(index: number, atlasCols: number): TileRect {
    if (index < 1) throw new Error(`Tile index must be greater than 0. Got ${index}`)
    const zero = index - 1
    const col = zero % atlasCols
    const row = Math.floor(zero / atlasCols)
    return {
        sx: col * TILE_SIZE,
        sy: row * TILE_SIZE,
        sw: TILE_SIZE,
        sh: TILE_SIZE,
    }
}

export const NAME_TO_INDEX: Record<string, number> = {
    dirt: 1,
    grass: 21,
    grass_edge_top: 3,
    grass_edge_bottom: 5,
    grass_edge_left: 20,
    grass_edge_right: 22,
    grass_corner_tl: 7,
    grass_corner_tr: 8,
    grass_corner_bl: 9,
    grass_corner_br: 10,
}

export function getTileByName(name: string, atlasCols: number): TileRect {
    const index = NAME_TO_INDEX[name]
    if (!index) throw new Error(`Unknown tile name: ${name}`)
    return getTile(index, atlasCols)
}
