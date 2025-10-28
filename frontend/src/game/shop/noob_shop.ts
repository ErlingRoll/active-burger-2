import { ARMOR } from "../items/armor"
import { FOOD } from "../items/food"
import { TOOLS } from "../items/tools"
import { WEAPONS } from "../items/weapons"
import { ShopItem } from "./shop"

export const noobShop: ShopItem[] = [
    {
        item: FOOD["burger"],
        price: 40,
        multiple: true,
    },
    {
        item: FOOD["balkan_kebab"],
        price: 240,
        multiple: true,
    },
    {
        item: TOOLS["pickaxe"],
        price: 100,
        multiple: false,
    },
    {
        item: WEAPONS["pool_noodle"],
        price: 100,
        multiple: false,
    },
    {
        item: WEAPONS["frying_pan"],
        price: 500,
        multiple: false,
    },
    {
        item: ARMOR["hoodie"],
        price: 1000,
        multiple: false,
    },
]
