import { Fragment, useContext, useEffect, useState } from "react"
import { Equipment } from "../../../../../models/item"
import { RiCopperCoinFill } from "react-icons/ri"
import { CharacterContext } from "../../../../../contexts/character-context"
import ItemTooltip from "./item-tooltip"
import { PlayerContext } from "../../../../../contexts/player-context"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const CraftingBench = () => {
    const [item, setItem] = useState<Equipment | null>(null)
    const [baseMods, setBaseMods] = useState<{ [key: string]: number }[]>()
    const [mods, setMods] = useState<{ [key: string]: number }[]>()

    const { items } = useContext(CharacterContext)
    const { gameActions } = useContext(PlayerContext)

    function selectEquipment(equipment: Equipment | null) {
        setItem(equipment)
    }

    function getTotalItemCount(itemId: string): { count: number; itemId: string | null } {
        let usingItemId = null
        let total = 0
        items.forEach((i) => {
            if (i.count > 0 && i.item_id === itemId) {
                total += i.count
                usingItemId = i.id
            }
        })
        return { count: total, itemId: usingItemId }
    }

    useEffect(() => {
        if (!item) return
        const baseMods = Object.entries(item.base_mods || {}).map(([key, value]) => ({ [key]: value }))
        const mods = Object.entries(item.mods || {}).map(([key, value]) => ({ [key]: value }))
        setBaseMods(baseMods)
        setMods(mods)
    }, [item])

    if (!item) {
        return (
            <div className="bg-dark/90 text-light overflow-hidden rounded pointer-events-auto px-4 pb-4 pt-2">
                <p className="text-lg font-bold mb-2">Select item to craft</p>
                <div className="grid grid-cols-4 gap-2">
                    {items
                        .filter((i) => i.equipable)
                        .map((item: Equipment, index) => (
                            <Fragment key={index}>
                                <ItemTooltip item={item} namespace="inventory" />
                                <div
                                    key={index}
                                    id={`inventory-item-${item.id}`}
                                    data-tooltip-place="top-end"
                                    className="relative w-12 h-12 bg-blue-100 border border-gray-400 rounded-sm flex justify-center items-center cursor-pointer hover:border-blue-600"
                                    title={item.name}
                                    onClick={() => selectEquipment(item)}
                                >
                                    <img
                                        src={textures[`/src/assets/textures/${item.texture}.png`]}
                                        alt={item.name}
                                        className="h-full"
                                    />
                                    {item.stackable && (
                                        <div className="absolute bottom-0 left-0 bg-light/70 text-dark rounded">
                                            <p className="-mt-[2px] px-[1px] text-sm font-bold">{item.count}</p>
                                        </div>
                                    )}
                                </div>
                            </Fragment>
                        ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-dark/90 text-light overflow-hidden rounded pointer-events-auto p-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col">
                <div className="flex items-center mb-2">
                    <div
                        id={`inventory-item-${item.id}`}
                        data-tooltip-place="top-end"
                        className="relative w-10 h-10 mr-4 bg-blue-100 border border-gray-400 rounded-sm center-col cursor-pointer hover:border-blue-600"
                        title={item.name}
                        onClick={() => selectEquipment(null)}
                    >
                        <img
                            src={textures[`/src/assets/textures/${item.texture}.png`]}
                            alt={item.name}
                            className="h-full"
                        />
                    </div>
                    <div>
                        <p className="font-bold text-lg">{item.name}</p>
                        <p className={`capitalize text-sm text-${item.rarity} -mt-1`}>{item.rarity}</p>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-1">
                    <RiCopperCoinFill color="gold" className="" />
                    <p className="font-bold text-lg">{item.value}</p>
                </div>
                <div className="w-fit center-col items-start!">
                    {baseMods && baseMods.length ? (
                        <div className="text-gray-300">
                            {baseMods.map((mod, index) => (
                                <div key={index} className="text-sm flex items-center gap-1">
                                    <p className="capitalize">{Object.keys(mod)[0].replaceAll("_", " ")}:</p>
                                    <p className={Object.values(mod)[0] >= 0 ? "text-green-500" : "text-red-500"}>
                                        {Object.values(mod)[0] >= 0
                                            ? `${Object.values(mod)[0]}`
                                            : Object.values(mod)[0]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>Empty implicit mods</div>
                    )}
                    <div className="w-full mt-2 mb-1 border-b border-dashed border-light" />
                    {mods && mods.length ? (
                        <div className="font-bold">
                            {mods.map((mod, index) => (
                                <div key={index} className="text-sm flex items-center gap-1">
                                    <p className="capitalize">{Object.keys(mod)[0].replaceAll("_", " ")}:</p>
                                    <p className={Object.values(mod)[0] >= 0 ? "text-green-500" : "text-red-500"}>
                                        {Object.values(mod)[0] >= 0
                                            ? `${Object.values(mod)[0]}`
                                            : Object.values(mod)[0]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            Empty <b>explicit</b> mods
                        </div>
                    )}
                </div>
            </div>
            <div className="center-col">
                <div className="w-full flex items-center gap-4 bg-primary/40 rounded p-2">
                    <div className="flex-1">
                        <div className="flex items-center">
                            <img
                                src={textures[`/src/assets/textures/item/currency/chaos_orb.png`]}
                                alt="Chaos Orb"
                                className="h-6 w-6 mr-2"
                            />
                            <p className="font-bold">Chaos Orb</p>
                            <p className="ml-2">x{getTotalItemCount("chaos_orb").count}</p>
                        </div>
                        <p className="text-sm max-w-[20rem]">
                            Reroll a <span className="text-rare font-bold">rare</span> item changing all <b>explicit</b>{" "}
                            mods into 3-4 random new ones
                        </p>
                    </div>
                    <button
                        className="px-4 py-2 bg-primary rounded text-light font-bold hover:scale-105"
                        onClick={() =>
                            gameActions.applyCurrency({
                                currency_id: getTotalItemCount("chaos_orb").itemId,
                                equipment_id: item.id,
                            })
                        }
                    >
                        Craft
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CraftingBench
