import { Fragment, useContext, useMemo, useState } from "react"
import { CharacterContext } from "../../../../../contexts/character-context"
import { RiCopperCoinFill, RiCopperCoinLine } from "react-icons/ri"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const shopTabs = ["Sell", "Buy"]

const Shop = () => {
    const [tab, setTab] = useState<number>(0)

    const { character } = useContext(CharacterContext)

    const tabName = useMemo(() => {
        return shopTabs[tab]
    }, [tab])

    return (
        <div className="w-[30vw] min-w-48 h-[50vh] min-h-32 bg-dark/90 text-light overflow-hidden rounded">
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
                <button className="text-lg font-bold px-4 cursor-pointer rounded-none! bg-danger text-light">
                    Close
                </button>
            </div>
            <div className="p-4">
                {tabName === "Sell" && (
                    <div className="grid grid-cols-5 gap-4 items-center">
                        {Object.values(character.items || []).map((item) => (
                            <Fragment key={item.id}>
                                <img
                                    src={textures[`/src/assets/textures/items/${item.texture}.png`]}
                                    className="w-12 h-12 object-fit"
                                />
                                <p className="font-bold text-lg">{item.name}</p>
                                <p className="font-bold text-lg">x {item.count || 1}</p>
                                <div className="flex flex-row items-center gap-1">
                                    <RiCopperCoinFill color="gold" className="" />
                                    <p className="font-bold text-lg">{item.value}</p>
                                </div>
                                <button className="bg-primary text-light font-bold rounded px-2 py-1">Sell</button>
                            </Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Shop
