export interface RenderObject {
    id: string
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
}
