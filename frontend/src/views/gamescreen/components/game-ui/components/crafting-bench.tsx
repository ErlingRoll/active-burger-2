import { Fragment, useContext, useEffect, useState } from "react"
import { Equipment } from "../../../../../models/item"
import { RiCopperCoinFill } from "react-icons/ri"
import { CharacterContext } from "../../../../../contexts/character-context"
import ItemTooltip from "./item-tooltip"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const CraftingBench = () => {
    const [item, setItem] = useState<Equipment | null>(null)
    const [baseMods, setBaseMods] = useState<{ [key: string]: number }[]>()
    const [mods, setMods] = useState<{ [key: string]: number }[]>()

    const { items } = useContext(CharacterContext)

    function selectEquipment(equipment: Equipment) {
        setItem(equipment)
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
        <div className="bg-dark/90 text-light overflow-hidden rounded pointer-events-auto px-4 pb-4 pt-2">
            <div className="flex flex-col">
                <div className="flex items-center">
                    <div className="h-12 w-12"></div>
                    <p className="font-bold text-lg">{item.name}</p>
                </div>
                <div className="flex flex-row items-center gap-1">
                    <RiCopperCoinFill color="gold" className="" />
                    <p className="font-bold text-lg">{item.value}</p>
                </div>
                {baseMods && (
                    <div className="font-bold">
                        {baseMods.map((mod, index) => (
                            <div key={index} className="text-sm flex items-center gap-1">
                                <p className="capitalize">{Object.keys(mod)[0].replaceAll("_", " ")}:</p>
                                <p className={Object.values(mod)[0] >= 0 ? "text-green-500" : "text-red-500"}>
                                    {Object.values(mod)[0] >= 0 ? `${Object.values(mod)[0]}` : Object.values(mod)[0]}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                {item.description && <p className="text-sm mt-2">{item.description}</p>}
            </div>
        </div>
    )
}

export default CraftingBench
