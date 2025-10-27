import { useContext, useMemo, useState } from "react"
import { GamestateContext } from "../../contexts/gamestate-context"
import { FaTimes } from "react-icons/fa"
import { UIContext } from "../../contexts/ui-context"
import GameUI from "./components/game-ui/game-ui"
import { PlayerContext } from "../../contexts/player-context"
import GameGrid from "./components/game-grid"
import { Realm } from "../../game/world"
import { CharacterContext } from "../../contexts/character-context"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const Gamescreen = () => {
    const [adminCell, setAdminCell] = useState<{ x: number; y: number } | null>(null)

    const { adminMode } = useContext(UIContext)
    const { gamestate } = useContext(GamestateContext)
    const { character } = useContext(CharacterContext)
    const { gameActions, selectedCell } = useContext(PlayerContext)

    const isDead = useMemo(() => {
        return character?.current_hp <= 0
    }, [character])

    return (
        <div
            className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden select-none"
            style={{
                backgroundImage: `url(${textures[`/src/assets/textures/terrain/grass.png`]})`,
                backgroundRepeat: "repeat",
            }}
        >
            {isDead && (
                <div
                    id="dead-screen"
                    className="absolute top-0 left-0 w-full h-full bg-dark/50 pointer-events-auto z-300 center-col justify-between!"
                >
                    <div className="flex-1 center-col justify-end! gap-4">
                        <p className="text-light text-3xl font-bold">You died</p>
                        <button
                            className="mt-4 px-4 pt-3 pb-4 bg-primary text-light text-xl font-bold hover:scale-105"
                            onClick={() => gameActions.respawn()}
                        >
                            Respawn
                        </button>
                    </div>
                    <div className="flex-1" />
                    <div className="flex-1" />
                </div>
            )}
            <div id="fx-layer" className="absolute top-0 left-0 w-full h-full pointer-events-none z-200" />
            <GameUI selectedCell={selectedCell} />
            <GameGrid hoverHighlight={adminMode} onCellClick={(pos) => adminMode && setAdminCell(pos)} />

            {adminCell && (
                <div className="absolute top-0 left-0 w-full center-col pointer-events-none z-200">
                    <div className="relative bg-dark/70 text-light rounded m-4 p-2 pb-4 center-col pointer-events-auto">
                        <button
                            className="absolute top-2 right-2 bg-danger p-[0.2rem]"
                            onClick={() => setAdminCell(null)}
                        >
                            <FaTimes className="text-light" />
                        </button>
                        <p className="mb-4">{adminCell ? `X: ${adminCell.x} Y: ${adminCell.y}` : "No Admin Cell"}</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="self-start center-col">
                                <p className="font-bold mb-2">Delete objects</p>
                                {(gamestate.position_objects[adminCell.x + "_" + adminCell.y] || []).map((obj) => (
                                    <div key={obj.id} className="flex justify-between items-center mb-2">
                                        <button
                                            className="px-4 py-2 bg-danger text-light font-bold"
                                            onClick={() => gameActions.deleteObject(obj.id)}
                                        >
                                            {obj.name}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="self-start center-col">
                                <p className="font-bold mb-2">Place objects</p>
                                {[
                                    { name: "Rock", object_id: "rock" },
                                    { name: "Bush", object_id: "bush" },
                                    { name: "Gold ore", object_id: "gold_ore" },
                                    { name: "Shop", object_id: "shopkeeper" },
                                ].map((item) => (
                                    <button
                                        key={item.object_id}
                                        className="min-w-28 mb-2 bg-primary text-light font-bold px-4 py-2"
                                        onClick={() =>
                                            gameActions.placeObject({
                                                object_id: item.object_id,
                                                properties: {},
                                                x: adminCell.x,
                                                y: adminCell.y,
                                                realm: Realm.BOB_VALLEY,
                                            })
                                        }
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                            <div className="self-start center-col">
                                <p className="font-bold mb-2">Give Object</p>
                                <button
                                    className="min-w-28 mb-2 bg-primary text-light font-bold px-4 py-2"
                                    onClick={() => gameActions.giveItem({ item_id: "burger" })}
                                >
                                    Burger
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Gamescreen
