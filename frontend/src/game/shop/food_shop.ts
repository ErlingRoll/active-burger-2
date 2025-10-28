import { FOOD } from "../items/food"
import { ShopItem } from "./shop"

export const FoodShop: ShopItem[] = [
    {
        item: FOOD["burger"],
        price: 40,
        multiple: true,
    },
    {
        item: FOOD["kebab"],
        price: 500,
        multiple: true,
    },
]
