import { useContext, useEffect, useState, PointerEvent } from "react"
import { GamestateContext } from "../../contexts/gamestate-context"
import { RenderObject } from "../../models/object"
import { CharacterContext } from "../../contexts/character-context"
import { PlayerContext } from "../../contexts/player-context"
import { TERRAIN_OBJECTS } from "../../game/objects"
import { TERRAIN } from "../../game/terrain"
import { Terrain } from "../../models/terrain"
import Settings from "../gamescreen/components/game-ui/components/settings"
import GameGrid from "../gamescreen/components/game-grid"
import HoverInfo from "./components/hover-info"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const WorldEditor = () => {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 0.8 }) // x and y will be set to center on player
    const [hoveringCell, setHoveringCell] = useState<{ x: number; y: number } | null>(null)
    const [hoveringTerrain, setHoveringTerrain] = useState<Terrain[]>([])
    const [brush, setBrush] = useState<{ id: string; type: "terrain" | "object"; object: RenderObject | any } | null>(
        null
    )
    const [brushZ, setBrushZ] = useState<number>(0)
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

    const [lastMoveRepeat, setLastMoveRepeat] = useState<number>(Date.now())
    const moveRepeatDelay = 100 // milliseconds

    const { gamestate, terrain } = useContext(GamestateContext)
    const { character } = useContext(CharacterContext)
    const { gameActions } = useContext(PlayerContext)

    const cameraStep = 1

    // Camera movement
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

    useEffect(() => {
        if (!hoveringCell) return setHoveringTerrain([])
        const terrains = structuredClone(terrain[`${hoveringCell.x}_${hoveringCell.y}`])
        if (!terrains) return setHoveringTerrain([])
        terrains.sort((a: Terrain, b: Terrain) => b.z - a.z)
        setHoveringTerrain(terrains)
    }, [hoveringCell])

    function changeBrush({
        id,
        type,
        object,
    }: {
        id: string
        type: "terrain" | "object"
        object?: RenderObject | any
    }) {
        if (brush?.id === id && brush?.type === type) return setBrush(null)
        setSelectedVariant(null)
        setBrush({ id, type, object })
    }

    function handleCellClick(pos: { x: number; y: number }) {
        if (!brush) return

        if (brush.id === "delete" && brush.type === "terrain") {
            const terrains = terrain[`${pos.x}_${pos.y}`] || []
            terrains.sort((a, b) => b.z - a.z) // Delete highest z-index first
            if (terrains.length === 0) return
            gameActions.deleteTerrain(terrains[0].id)
            return
        }

        if (brush.id === "delete" && brush.type === "object") {
            const posObjects = gamestate.position_objects[`${pos.x}_${pos.y}`] || []
            if (posObjects.length === 0) return
            gameActions.deleteObject(posObjects[0].id)
            return
        }

        if (brush.type === "object") {
            gameActions.placeObject({
                object_id: brush.id,
                x: pos.x,
                y: pos.y,
            })
        }

        if (brush.type === "terrain") {
            const terrain = structuredClone(TERRAIN[brush.id])
            terrain.z = brushZ
            terrain.texture = terrain.texture + (selectedVariant ? `_${selectedVariant}` : "")
            gameActions.placeTerrain({
                game_id: brush.id,
                properties: terrain,
                x: pos.x,
                y: pos.y,
            })
        }
    }

    function handleCellEnter(pos: { x: number; y: number; event: PointerEvent }) {
        setHoveringCell({ x: pos.x, y: pos.y })
        const leftClicked = pos.event.buttons === 1
        if (leftClicked) {
            handleCellClick({ x: pos.x, y: pos.y })
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
            <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden select-none z-200 pointer-events-none">
                <HoverInfo terrains={hoveringTerrain} />
                <div className="absolute flex flex-col items-end p-4 bottom-0 right-0 z-200 gap-4 pointer-events-none">
                    <Settings />
                </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-200">
                <div className="absolute bottom-0 left-0 m-4 pointer-events-none flex gap-4 items-end">
                    <div className="bg-dark/90 text-light rounded p-2 pointer-events-auto">
                        <div className="flex gap-2 items-end">
                            <div className="center-col items-start! gap-2 text-sm">
                                {Object.values(TERRAIN_OBJECTS).map((obj: RenderObject) => (
                                    <div
                                        key={obj.object_id}
                                        className={
                                            `w-full flex items-center gap-2 p-1 border-2 rounded cursor-pointer border-primary text-light font-bold ` +
                                            (brush?.id === obj.object_id && "bg-primary")
                                        }
                                        onClick={() => changeBrush({ id: obj.object_id, type: "object", object: obj })}
                                    >
                                        <div className="h-8 w-8 rounded center-col">
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
                                        `w-full px-2 py-1 border-2 border-danger text-light font-bold ` +
                                        (brush?.id === "delete" && brush?.type === "object" && "bg-danger")
                                    }
                                    onClick={() => changeBrush({ id: "delete", type: "object" })}
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="center-col items-start! gap-2 text-sm">
                                {Object.values(TERRAIN).map((obj: Terrain) => (
                                    <div
                                        key={obj.game_id}
                                        className={
                                            `w-full flex items-center gap-2 p-1 border-2 rounded cursor-pointer border-primary text-light font-bold ` +
                                            (brush?.id === obj.game_id && "bg-primary")
                                        }
                                        onClick={() => changeBrush({ id: obj.game_id, type: "terrain", object: obj })}
                                    >
                                        <img
                                            src={textures[`/src/assets/textures/${obj.texture}.png`]}
                                            className="h-8 w-8 rounded"
                                        />
                                        {obj.name}
                                    </div>
                                ))}
                                <button
                                    className={
                                        `w-full px-2 py-1 border-2 border-danger text-light font-bold ` +
                                        (brush?.id === "delete" && brush?.type === "terrain" && "bg-danger")
                                    }
                                    onClick={() => changeBrush({ id: "delete", type: "terrain" })}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    {brush && brush.id != "delete" && (
                        <div className="text-light grid grid-cols-[repeat(2,minmax(0,auto))] items-end gap-4 pointer-events-auto">
                            <div className="center-col gap-2 bg-dark/90 rounded p-2">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <button
                                        key={index}
                                        className={
                                            "border-2 border-primary px-4 py-1 font-bold" +
                                            (brushZ === 7 - index ? " bg-primary" : "")
                                        }
                                        onClick={() => setBrushZ(7 - index)}
                                    >
                                        z: {7 - index}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-col items-start justify-end gap-2 text-sm bg-dark/90 rounded p-2">
                                {brush.object.variants && (
                                    <div className="grid grid-cols-3 gap-1">
                                        {brush.object.variants.map((variant: string) => (
                                            <div
                                                key={variant}
                                                className={
                                                    "w-full flex items-center justify-start border-2 border-primary rounded cursor-pointer p-1 " +
                                                    (selectedVariant == variant ? "bg-primary!" : "")
                                                }
                                                onClick={() => setSelectedVariant(variant)}
                                            >
                                                <div className="w-8 h-8 center-col">
                                                    <img
                                                        src={
                                                            textures[
                                                                `/src/assets/textures/${brush.object.texture}_${variant}.png`
                                                            ]
                                                        }
                                                        className="h-8 w-8 rounded"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div
                                    className={
                                        " flex items-center justify-start border-2 border-primary rounded p-1 " +
                                        (selectedVariant == null ? "bg-primary!" : "")
                                    }
                                >
                                    <div className={"w-8 h-8 center-col mr-2"}>
                                        <img
                                            src={textures[`/src/assets/textures/${brush.object.texture}.png`]}
                                            className="h-8 w-8 rounded"
                                        />
                                    </div>
                                    <p className="font-bold">{brush.object.name}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <GameGrid
                center={camera}
                hoverHighlight={true}
                showSelectedCell={false}
                onCellClick={(pos) => handleCellClick(pos)}
                onCellEnter={(pos) => handleCellEnter(pos)}
            />
        </div>
    )
}

export default WorldEditor
