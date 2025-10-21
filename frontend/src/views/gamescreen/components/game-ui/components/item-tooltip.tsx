import { PlacesType, Tooltip } from "react-tooltip"
import { Equipment, Item } from "../../../../../models/item"
import { RiCopperCoinFill } from "react-icons/ri"
import { useEffect, useState } from "react"
import ItemInfo from "./item-info"

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
                <ItemInfo itemId={item.id} />
            </Tooltip>
        </div>
    )
}

export default ItemTooltip
