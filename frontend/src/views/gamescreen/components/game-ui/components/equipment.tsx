import { Fragment, useContext } from "react"
import { CharacterContext } from "../../../../../contexts/character-context"
import ItemTooltip from "./item-tooltip"
import { PlayerContext } from "../../../../../contexts/player-context"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const Equipment = () => {
    const { gameActions } = useContext(PlayerContext)
    const { equipment } = useContext(CharacterContext)

    return (
        <div id="equipment" className="px-3 py-2 bg-dark/90 text-light rounded pointer-events-auto">
            <div className="grid grid-cols-2 items-center gap-2">
                {Object.entries(equipment).map(([slot, item]) => (
                    <Fragment key={slot}>
                        <p className="font-bold text-md capitalize">{slot}:</p>
                        {item ? (
                            <div className="flex flex-row items-center gap-2">
                                <div className="bg-light/90 rounded center-col">
                                    <ItemTooltip item={item} namespace="equipment" place="top-start" />
                                    <img
                                        id={`equipment-item-${item.id}`}
                                        src={textures[`/src/assets/textures/item/${item.texture}.png`]}
                                        alt={item.name}
                                        className="w-10 h-10 cursor-pointer"
                                        onClick={() => gameActions.unequipItem({ slot })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="text-md text-gray-300">Empty</p>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default Equipment
