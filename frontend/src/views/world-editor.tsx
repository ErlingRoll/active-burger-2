import { useContext, useEffect, useState } from "react"
import { GamestateContext } from "../contexts/gamestate-context"
import { RenderObject } from "../models/object"
import { CharacterContext } from "../contexts/character-context"
import { PlayerContext } from "../contexts/player-context"
import { TERRAIN_OBJECTS } from "../game/objects"
import { TERRAIN } from "../game/terrain"
import { Terrain } from "../models/terrain"
import Settings from "./gamescreen/components/game-ui/components/settings"
import Log from "./gamescreen/components/game-ui/components/log"
import GameGrid from "./gamescreen/components/game-grid"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const WorldEditor = () => {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 0.8 }) // x and y will be set to center on player
    const [brush, setBrush] = useState<{ id: string; type: "terrain" | "object"; properties: object } | null>(null)

    const [lastMoveRepeat, setLastMoveRepeat] = useState<number>(Date.now())
    const moveRepeatDelay = 100 // milliseconds

    const { gamestate, terrain } = useContext(GamestateContext)
    const { character } = useContext(CharacterContext)
    const { gameActions } = useContext(PlayerContext)

    const cameraStep = 1

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) {
                if (Date.now() - lastMoveRepeat < moveRepeatDelay) return
            }
            setLastMoveRepeat(Date.now())

            const input = event.key.toLowerCase()
            let gameInput = true
            switch (input) {
                case "arrowup":
                case "w":
                    setCamera((oldCamera) => ({ ...oldCamera, y: oldCamera.y + cameraStep }))
                    break
                case "arrowdown":
                case "s":
                    setCamera((oldCamera) => ({ ...oldCamera, y: oldCamera.y - cameraStep }))
                    break
                case "arrowleft":
                case "a":
                    setCamera((oldCamera) => ({ ...oldCamera, x: oldCamera.x - cameraStep }))
                    break
                case "arrowright":
                case "d":
                    setCamera((oldCamera) => ({ ...oldCamera, x: oldCamera.x + cameraStep }))
                    break
                default:
                    gameInput = false
            }
            if (gameInput) {
                event.preventDefault()
                return
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [gamestate, character, gameActions])

    function changeBrush({
        id,
        type,
        properties = {},
    }: {
        id: string
        type: "terrain" | "object"
        properties?: object
    }) {
        if (brush?.id === id && brush?.type === type) return setBrush(null)
        setBrush({ id, type, properties })
    }

    function handleCellClick(x: number, y: number) {
        if (!brush) return

        if (brush.id === "delete" && brush.type === "terrain") {
            const terrains = terrain[`${x}_${y}`] || []
            terrains.sort((a, b) => b.z - a.z) // Delete highest z-index first
            if (terrains.length === 0) return
            gameActions.deleteTerrain(terrains[0].id)
            return
        }

        if (brush.id === "delete" && brush.type === "object") {
            const posObjects = gamestate.position_objects[`${x}_${y}`] || []
            if (posObjects.length === 0) return
            gameActions.deleteObject(posObjects[0].id)
            return
        }

        if (brush.type === "object") {
            gameActions.placeObject({
                object_id: brush.id,
                x: x,
                y: y,
            })
        }

        if (brush.type === "terrain") {
            gameActions.placeTerrain({
                game_id: brush.id,
                properties: TERRAIN[brush.id],
                x: x,
                y: y,
            })
        }
    }

    return (
        <div
            className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden select-none"
            style={{
                backgroundImage: `url(${textures[`/src/assets/textures/terrain/grass.png`]})`,
                backgroundRepeat: "repeat",
            }}
        >
            <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden select-none z-300 pointer-events-none">
                <div className="absolute flex flex-col items-end p-4 bottom-0 right-0 z-200 gap-4 pointer-events-none">
                    <Settings />
                    <Log />
                </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-200">
                <div className="absolute bottom-0 left-0 m-4 pointer-events-auto">
                    <div className="bg-dark/90 text-light p-2 pt-1 rounded">
                        <p className="text-lg font-bold mb-2">Brush: {brush?.id}</p>
                        <div className="flex gap-2 items-end">
                            <div className="center-col items-start! gap-2">
                                {Object.values(TERRAIN_OBJECTS).map((obj: RenderObject) => (
                                    <div
                                        key={obj.object_id}
                                        className={
                                            `w-full flex items-center gap-2 px-2 pr-4 py-2 border-2 rounded cursor-pointer border-primary text-light font-bold ` +
                                            (brush?.id === obj.object_id && "bg-primary")
                                        }
                                        onClick={() => changeBrush({ id: obj.object_id, type: "object" })}
                                    >
                                        <div className="h-10 w-10 rounded center-col">
                                            <img
                                                src={textures[`/src/assets/textures/${obj.texture}.png`]}
                                                className="h-full"
                                            />
                                        </div>
                                        {obj.name}
                                    </div>
                                ))}
                                <button
                                    className={
                                        `w-full px-4 py-2 border-2 border-danger text-light font-bold ` +
                                        (brush?.id === "delete" && brush?.type === "object" && "bg-danger")
                                    }
                                    onClick={() => changeBrush({ id: "delete", type: "object" })}
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="center-col items-start! gap-2">
                                {Object.values(TERRAIN).map((obj: Terrain) => (
                                    <div
                                        key={obj.game_id}
                                        className={
                                            `w-full flex items-center gap-2 px-2 pr-4 py-2 border-2 rounded cursor-pointer border-primary text-light font-bold ` +
                                            (brush?.id === obj.game_id && "bg-primary")
                                        }
                                        onClick={() => changeBrush({ id: obj.game_id, type: "terrain" })}
                                    >
                                        <img
                                            src={textures[`/src/assets/textures/${obj.texture}.png`]}
                                            className="h-10 w-10 rounded"
                                        />
                                        {obj.name}
                                    </div>
                                ))}
                                <button
                                    className={
                                        `w-full px-4 py-2 border-2 border-danger text-light font-bold ` +
                                        (brush?.id === "delete" && brush?.type === "terrain" && "bg-danger")
                                    }
                                    onClick={() => changeBrush({ id: "delete", type: "terrain" })}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <GameGrid
                center={camera}
                onCellClick={(pos) => handleCellClick(pos.x, pos.y)}
                hoverHighlight={true}
                showSelectedCell={false}
            />
        </div>
    )
}

export default WorldEditor
