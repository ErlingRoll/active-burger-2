import { Fragment } from "react"
import { Item } from "../../models/item"

export interface Currency extends Item {
    description: string | any
}

export const CRAFTING_CURRENCY: Partial<Currency>[] = [
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
    {
        item_id: "transmutation_orb",
        name: "Transmutation Orb",
        description: (
            <Fragment>
                Upgrade a <b>common</b> item to an <span className="dark-shadow text-uncommon font-bold">uncommon</span>{" "}
                item with 1-2 random explicit mods
            </Fragment>
        ),
        texture: "item/currency/transmutation_orb",
    },
    {
        item_id: "alteration_orb",
        name: "Alteration Orb",
        description: (
            <Fragment>
                Reroll an <span className="dark-shadow text-uncommon font-bold">uncommon</span> item's <b>explicit</b>{" "}
                mods, changing them into 1-2 new random ones
            </Fragment>
        ),
        texture: "item/currency/alteration_orb",
    },
    {
        item_id: "alchemy_orb",
        name: "Alchemy Orb",
        description: (
            <Fragment>
                Upgrade a <b>common</b> item to a <span className="dark-shadow text-rare font-bold">rare</span> item
                with 3-4 random <b>explicit</b> mods
            </Fragment>
        ),
        texture: "item/currency/alchemy_orb",
    },
    {
        item_id: "chaos_orb",
        name: "Chaos Orb",
        description: (
            <Fragment>
                Reroll a <span className="dark-shadow text-rare font-bold">rare</span> item changing all <b>explicit</b>{" "}
                mods into 3-4 random new ones
            </Fragment>
        ),
        texture: "item/currency/chaos_orb",
    },
    {
        item_id: "exalted_orb",
        name: "Exalted Orb",
        description: (
            <Fragment>
                Add an additional <b>explicit</b> mod to an{" "}
                <span className="dark-shadow text-uncommon font-bold">uncommon</span> or{" "}
                <span className="dark-shadow text-rare font-bold">rare</span> item
            </Fragment>
        ),
        texture: "item/currency/exalted_orb",
    },
    {
        item_id: "annulment_orb",
        name: "Annulment Orb",
        description: (
            <Fragment>
                Remove a random <b>explicit</b> mod from an item
            </Fragment>
        ),
        texture: "item/currency/annulment_orb",
    },
    {
        item_id: "celestial_orb",
        name: "Celestial Orb",
        description: (
            <Fragment>
                Add 2 additional <b>explicit</b> mods to a <span className="dark-shadow text-rare font-bold">rare</span>{" "}
                item
            </Fragment>
        ),
        texture: "item/currency/celestial_orb",
    },
]
