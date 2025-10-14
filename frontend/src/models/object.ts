import { Item } from "./item"

export interface RenderObject {
    id: string
    object_id: string
    type: string
    created_at?: string
    name: string
    name_visible: boolean
    x: number
    y: number
    direction: string
    texture?: string
    width: number
    height: number
    solid: boolean
    gold: number
}

export interface Entity extends RenderObject {
    max_hp: number
    current_hp: number
}

export interface Character extends Entity {
    account_id: string
    items: { [id: string]: Item }
}
