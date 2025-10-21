import { Fragment } from "react"
import { Item } from "../../models/item"

export interface Currency extends Item {
    description: string | any
}

export const CRAFTING_CURRENCY: Partial<Currency>[] = [
    {
        item_id: "alchemy_orb",
        name: "Alchemy Orb",
        description: (
            <Fragment>
                Upgrade a <b>common</b> item to a <span className="text-rare font-bold">rare</span> item with 3-4 random
                explicit mods
            </Fragment>
        ),
        texture: "item/currency/alchemy_orb",
    },
    {
        item_id: "chaos_orb",
        name: "Chaos Orb",
        description: (
            <Fragment>
                Reroll a <span className="text-rare font-bold">rare</span> item changing all <b>explicit</b> mods into
                3-4 random new ones
            </Fragment>
        ),
        texture: "item/currency/chaos_orb",
    },
    {
        item_id: "scouring_orb",
        name: "Scouring Orb",
        description: (
            <Fragment>
                Remove all <b>explicit</b> mods from an item, making it <b>common</b>
            </Fragment>
        ),
        texture: "item/currency/scouring_orb",
    },
]
