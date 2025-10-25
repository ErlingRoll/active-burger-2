import { useContext, useEffect, useState } from "react"
import { Equipment, Item } from "../../../../../models/item"
import { CharacterContext } from "../../../../../contexts/character-context"
import { RiCopperCoinFill } from "react-icons/ri"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

type ItemInfoProps = {
    itemId: string
    item?: Item | Equipment
    showImg?: boolean
    onImgClick?: () => void
}

const ItemInfo = ({ itemId, item, showImg, onImgClick }: ItemInfoProps) => {
    const [_item, setItem] = useState<Item>(null)
    const [baseMods, setBaseMods] = useState<{ [key: string]: number }[]>()
    const [mods, setMods] = useState<{ [key: string]: number }[]>()

    const { items, itemMap } = useContext(CharacterContext)

    useEffect(() => {
        if (!_item) return
        const baseMods = Object.entries(_item.base_mods || {}).map(([key, value]) => ({ [key]: value }))
        const mods = Object.entries(_item.mods || {}).map(([key, value]) => ({ [key]: value }))
        setBaseMods(baseMods)
        setMods(mods)
    }, [_item])

    useEffect(() => {
        if (itemId && itemMap) {
            const inventoryItem = itemMap[itemId]
            if (inventoryItem) return setItem(inventoryItem)
        }
        if (item) return setItem(item)
    }, [itemId, item, items])

    if (!_item) {
        return <div>Loading item...</div>
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center mb-1">
                {showImg && (
                    <div
                        className="relative w-10 h-10 mr-4 bg-blue-100 border border-gray-400 rounded-sm center-col cursor-pointer hover:border-primary"
                        title={_item.name}
                        onClick={() => onImgClick && onImgClick()}
                    >
                        <img
                            src={textures[`/src/assets/textures/${_item.texture}.png`]}
                            alt={_item.name}
                            className="h-full"
                        />
                    </div>
                )}
                <div>
                    <p className="font-bold text-2xl">{_item.name}</p>
                    <p className={`capitalize text-sm text-${_item.rarity} dark-shadow font-bold -mt-1`}>
                        {_item.rarity}
                    </p>
                </div>
            </div>
            <div className="flex flex-row items-center gap-1">
                <RiCopperCoinFill color="gold" className="" />
                <p className="font-bold text-lg">{_item.value}</p>
            </div>
            {_item.equipable && (
                <div className="w-fit center-col items-start! mt-1">
                    {baseMods && baseMods.length ? (
                        <div className="text-gray-300">
                            {baseMods.map((mod, index) => (
                                <div key={index} className="text-sm flex items-center gap-1">
                                    <p className="capitalize">{Object.keys(mod)[0].replaceAll("_", " ")}:</p>
                                    <p
                                        className={
                                            "font-bold " +
                                            (Object.values(mod)[0] >= 0 ? "text-green-500" : "text-red-500")
                                        }
                                    >
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
            )}
            {_item.description && <p className="text-sm mt-2">{_item.description}</p>}
        </div>
    )
}

export default ItemInfo
