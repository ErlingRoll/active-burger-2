import { PlacesType, Tooltip } from "react-tooltip"
import { Equipment, Item } from "../../../../../models/item"
import { RiCopperCoinFill } from "react-icons/ri"
import { useEffect, useState } from "react"

const ItemTooltip = ({ item, namespace, place }: { item: Item | Equipment; namespace: string; place?: PlacesType }) => {
    const [baseMods, setBaseMods] = useState<{ [key: string]: number }[]>()
    const [mods, setMods] = useState<{ [key: string]: number }[]>()

    useEffect(() => {
        const _item = item as Item & Equipment
        const baseMods = Object.entries(_item.base_mods || {}).map(([key, value]) => ({ [key]: value }))
        const mods = Object.entries(_item.mods || {}).map(([key, value]) => ({ [key]: value }))
        setBaseMods(baseMods)
        setMods(mods)
    }, [item])

    return (
        <div className="absolute z-210">
            <Tooltip className="pointer-events-none" anchorSelect={`#${namespace}-item-${item.id}`} place={place}>
                <div className="flex flex-col">
                    <p className="font-bold text-lg">{item.name}</p>
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
                                        {Object.values(mod)[0] >= 0
                                            ? `${Object.values(mod)[0]}`
                                            : Object.values(mod)[0]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    {item.description && <p className="text-sm mt-2">{item.description}</p>}
                </div>
            </Tooltip>
        </div>
    )
}

export default ItemTooltip
