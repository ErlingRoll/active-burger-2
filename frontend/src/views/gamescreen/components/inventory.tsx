import { useContext } from "react"
import { CharacterContext } from "../../../contexts/character-context"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const Inventory = () => {
    const { character } = useContext(CharacterContext)

    return (
        <div className="absolute bottom-0 left-0 m-4 p-2 pt-0 bg-white/70 rounded flex flex-col items-center z-200 pointer-events-auto">
            <div className="center-col items-start!">
                <p className="w-full font-bold text-lg mb-2">Inventory</p>
                <div className="grid grid-cols-4 gap-2">
                    {Object.values(character.items).map((item, index) => (
                        <div
                            key={index}
                            className="w-12 h-12 bg-gray-200 border border-gray-400 flex justify-center items-center"
                            title={item.name}
                        >
                            <img
                                src={textures[`/src/assets/textures/items/${item.texture}.png`]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Inventory
