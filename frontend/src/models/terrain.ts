import { Realm } from "../game/world"

export interface Terrain {
    id: string
    created_at: string
    name: string
    game_id: string
    texture: string
    x: number
    y: number
    z: number
    realm: Realm
    solid: boolean
    opacity: number
    rotation: number
    ext?: string
    variant: string
    variants: string[]
}
