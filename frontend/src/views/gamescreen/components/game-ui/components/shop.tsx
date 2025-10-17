import { Fragment, useContext, useMemo, useState } from "react"
import { CharacterContext } from "../../../../../contexts/character-context"
import { RiCopperCoinFill } from "react-icons/ri"
import { GamestateContext } from "../../../../../contexts/gamestate-context"
import { UIContext } from "../../../../../contexts/ui-context"
import { PlayerContext } from "../../../../../contexts/player-context"
import { Item } from "../../../../../models/item"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const shopTabs = ["Sell", "Buy"]

const shopItems: Partial<Item>[] = [
    {
        name: "Pickaxe",
        item_id: "pickaxe",
        count: 1,
        texture: "pickaxe",
        value: 50,
        type: "tool",
        stackable: false,
    },
]

const Shop = () => {
    const [tab, setTab] = useState<number>(0)

    const { gameActions } = useContext(PlayerContext)
    const { items, character } = useContext(CharacterContext)
    const { setShopOpen } = useContext(UIContext)

    const tabName = useMemo(() => {
        return shopTabs[tab]
    }, [tab])

    return (
        <div className="w-[30vw] min-w-48 h-[50vh] min-h-32 bg-dark/90 text-light overflow-hidden rounded pointer-events-auto">
            <div className="flex flex-row items-stretch justify-between">
                {shopTabs.map((t, i) => (
                    <button
                        key={t}
                        className={`inline h-full text-2xl font-bold px-4 rounded-none! pb-1 ${
                            tab !== i && "bg-light text-dark"
                        }`}
                        onClick={() => setTab(i)}
                    >
                        {t}
                    </button>
                ))}
                <div className="min-w-24 flex-grow bg-light" />
                <button
                    className="text-lg font-bold px-4 cursor-pointer rounded-none! bg-danger text-light"
                    onClick={() => setShopOpen(false)}
                >
                    Close
                </button>
            </div>
            <div className="p-4">
                {tabName === "Sell" && (
                    <div className="grid grid-cols-5 gap-4 items-center">
                        {items.map((item) => (
                            <Fragment key={item.id}>
                                <img
                                    src={textures[`/src/assets/textures/item/${item.texture}.png`]}
                                    className="w-12 h-12 object-fit"
                                />
                                <p className="font-bold text-lg">{item.name}</p>
                                <p className="font-bold text-lg">x {item.count || 1}</p>
                                <div className="flex flex-row items-center gap-1">
                                    <RiCopperCoinFill color="gold" className="" />
                                    <p className="font-bold text-lg">{item.value}</p>
                                </div>
                                <button
                                    className="bg-primary text-light font-bold rounded px-2 py-1"
                                    onClick={() => gameActions.sell({ item_id: item.id, count: 1 })}
                                >
                                    Sell
                                </button>
                            </Fragment>
                        ))}
                    </div>
                )}
                {tabName === "Buy" && (
                    <div className="grid grid-cols-5 gap-4 items-center">
                        {shopItems.map((item, index) => (
                            <Fragment key={index}>
                                <img
                                    src={textures[`/src/assets/textures/item/${item.texture}.png`]}
                                    className="w-12 h-12 object-fit"
                                />
                                <p className="font-bold text-lg">{item.name}</p>
                                <p className="font-bold text-lg">
                                    {item.count && item.count > 1 ? `x ${item.count}` : null}
                                </p>
                                <div className="flex flex-row items-center gap-1">
                                    <RiCopperCoinFill color="gold" className="" />
                                    <p className="font-bold text-lg">{item.value * 2}</p>
                                </div>
                                <button
                                    className="bg-primary text-light font-bold rounded px-2 py-1"
                                    onClick={() => gameActions.buy({ item_id: item.item_id!, count: 1 })}
                                    disabled={character.gold < (item.value || 0)}
                                >
                                    Buy
                                </button>
                            </Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Shop
