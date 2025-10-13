import { useContext } from "react"
import { CharacterContext } from "../../../../../contexts/character-context"
import { GamestateContext } from "../../../../../contexts/gamestate-context"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const Inventory = () => {
    const { character } = useContext(CharacterContext)
    const { gameActions } = useContext(GamestateContext)

    return (
        <div className="absolute bottom-0 left-0 m-4 p-2 pt-0 bg-dark/90 text-light rounded flex flex-col items-center z-200 pointer-events-auto">
            <div className="center-col items-start!">
                <p className="w-full font-bold text-lg mb-2">Inventory</p>
                <div className="grid grid-cols-4 gap-2">
                    {Object.values(character.items).map((item, index) => (
                        <div
                            key={index}
                            className="relative w-12 h-12 bg-blue-100 border border-gray-400 rounded-sm flex justify-center items-center cursor-pointer hover:border-blue-600"
                            title={item.name}
                            onClick={() => gameActions.useItem({ id: item.id })}
                        >
                            <img
                                src={textures[`/src/assets/textures/items/${item.texture}.png`]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                            {item.stackable && (
                                <div className="absolute bottom-0 left-0 bg-light/70 text-dark rounded">
                                    <p className="-mt-[2px] px-[1px] text-sm font-bold">{item.count}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Inventory
