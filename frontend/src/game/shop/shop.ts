import { Item } from "../../models/item"

export interface ShopItem {
    item: Partial<Item>
    price: number
    multiple?: boolean
}
