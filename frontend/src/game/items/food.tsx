import { Item } from "../../models/item"

export const FOOD: { [id: string]: Partial<Item> } = {
    burger: {
        item_id: "burger",
        name: "Burger",
        description: "Pretty decent BK burger. Greasy AF. Restores 20 HP.",
        texture: "item/food/burger",
        value: 20,
        type: "food",
        stackable: true,
        equipable: false,
        consumable: true,
    },
    kebab: {
        item_id: "kebab",
        name: "Kebab",
        description: "The best kebab in Oslo. Restores 100 HP.",
        texture: "item/food/burger",
        value: 40,
        type: "food",
        stackable: true,
        equipable: false,
        consumable: true,
    },
}
