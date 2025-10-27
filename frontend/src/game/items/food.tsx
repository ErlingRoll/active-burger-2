import { Item } from "../../models/item"

export const FOOD: { [id: string]: Partial<Item> } = {
    burger: {
        item_id: "burger",
        name: "Burger",
        description: "Pretty decent BK burger. Greasy AF.",
        count: 1,
        texture: "item/food/burger",
        value: 20,
        type: "food",
        stackable: true,
        equipable: false,
        consumable: true,
    },
}
