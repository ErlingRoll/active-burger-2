import { useContext, useEffect, useState, PointerEvent } from "react"
import { GamestateContext } from "../../contexts/gamestate-context"
import { RenderObject } from "../../models/object"
import { CharacterContext } from "../../contexts/character-context"
import { PlayerContext } from "../../contexts/player-context"
import { TERRAIN_OBJECTS } from "../../game/objects"
import { TERRAIN, TERRAIN_COLORS } from "../../game/terrain"
import { Terrain } from "../../models/terrain"
import { Realm } from "../../game/world"

import SettingsMenu from "../gamescreen/components/game-ui/components/settings-menu"
import GameGrid from "../gamescreen/components/game-grid"
import Select from "react-select"
import HoverInfo from "./components/hover-info"
import ObjectConfig from "./components/object-config"
import { ToastContainer } from "react-toastify"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const WorldEditor = () => {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 2, step: 3, realm: null }) // x and y will be set to center on player
    const [renderSize, setRenderSize] = useState<{ width: number; height: number }>({ width: 41, height: 29 })
    const [hoveringCell, setHoveringCell] = useState<{ x: number; y: number } | null>(null)
    const [hoveringTerrain, setHoveringTerrain] = useState<Terrain[]>([])
    const [brush, setBrush] = useState<{ id: string; type: "terrain" | "object"; object: RenderObject | any } | null>(
        null
    )
    const [brushZ, setBrushZ] = useState<number>(0)
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
    const [solid, setSolid] = useState<boolean | null>(null)
    const [objectProps, setObjectProps] = useState<{ [key: string]: any }>({})

    const [lastMoveRepeat, setLastMoveRepeat] = useState<number>(Date.now())
    const moveRepeatDelay = 100 // milliseconds

    const { gamestate, terrain, realm, realmSettings } = useContext(GamestateContext)
    const { character } = useContext(CharacterContext)
    const { gameActions } = useContext(PlayerContext)

    // Load camera from localStorage
    useEffect(() => {
        const savedCamera = localStorage.getItem("worldEditorCamera")
        if (savedCamera) {
            const parsedCamera = JSON.parse(savedCamera)
            setCamera(parsedCamera)
            setTimeout(() => {
                if (parsedCamera.realm) gameActions.setRealm({ realm: parsedCamera.realm })
            }, 100)
        }
    }, [])

    useEffect(() => {}, [realm])

    // Save camera to localStorage
    useEffect(() => {
        localStorage.setItem("worldEditorCamera", JSON.stringify(camera))
    }, [camera])

    // Camera movement
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (document.activeElement.tagName === "INPUT") return
            if (event.repeat) {
                if (Date.now() - lastMoveRepeat < moveRepeatDelay) return
            }
            setLastMoveRepeat(Date.now())

            const input = event.key.toLowerCase()
            let gameInput = true
            switch (input) {
                case "arrowup":
                case "w":
                    setCamera((oldCamera) => ({ ...oldCamera, y: oldCamera.y + oldCamera.step }))
                    break
                case "arrowdown":
                case "s":
                    setCamera((oldCamera) => ({ ...oldCamera, y: oldCamera.y - oldCamera.step }))
                    break
                case "arrowleft":
                case "a":
                    setCamera((oldCamera) => ({ ...oldCamera, x: oldCamera.x - oldCamera.step }))
                    break
                case "arrowright":
                case "d":
                    setCamera((oldCamera) => ({ ...oldCamera, x: oldCamera.x + oldCamera.step }))
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
        if (brush?.id === id && brush?.type === type) {
            setBrush(null)
            return
        }
        setSelectedVariant(null)
        setBrush({ id, type, object })
        setObjectProps({})
        setBrushZ(0)
        setSolid(object?.solid)
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
                properties: { ...brush.object, ...objectProps, props: objectProps, solid: solid },
                x: pos.x,
                y: pos.y,
                realm: realm,
            })
        }

        if (brush.type === "terrain") {
            let terrain = structuredClone(TERRAIN[brush.id])
            if (!terrain) terrain = structuredClone(TERRAIN_COLORS[brush.id])
            gameActions.placeTerrain({
                game_id: terrain.game_id,
                properties: {
                    ...terrain,
                    ...brush.object,
                    ...objectProps,
                    props: objectProps,
                    texture: terrain.texture + (selectedVariant ? `_${selectedVariant}` : ""),
                    solid: solid,
                },
                x: pos.x,
                y: pos.y,
                z: brushZ,
                realm: realm,
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
                backgroundImage: `url(${textures[`/src/assets/textures/${realmSettings.background}.png`]})`,
                backgroundRepeat: "repeat",
            }}
        >
            <ToastContainer
                position="top-right"
                limit={5}
                autoClose={60000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick={true}
                closeButton={false}
                pauseOnHover={true}
                rtl={false}
                theme="dark"
                className={"cursor-pointer pointer-events-auto"}
                toastClassName={"bg-dark! border-2 border-primary"}
            />
            <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden select-none z-200 pointer-events-none">
                <HoverInfo terrains={hoveringTerrain} />
                <div className="absolute flex items-end p-4 bottom-0 right-0 z-200 gap-4 pointer-events-none">
                    <div className="bg-dark/90 text-light rounded p-2 pointer-events-auto flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2 font-bold">
                            <p>X</p>
                            <input
                                type="number"
                                className="bg-dark border-2 border-primary rounded px-2 py-1 w-20 text-light"
                                value={camera.x}
                                onChange={(e) => {
                                    let value = parseInt(e.target.value)
                                    if (isNaN(value)) return
                                    setCamera({ ...camera, x: value })
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2 font-bold">
                            <p>Y</p>
                            <input
                                type="number"
                                className="bg-dark border-2 border-primary rounded px-2 py-1 w-20 text-light"
                                value={camera.y}
                                onChange={(e) => {
                                    let value = parseInt(e.target.value)
                                    if (isNaN(value)) return
                                    setCamera({ ...camera, y: value })
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2 font-bold">
                            <p>Camera step</p>
                            <input
                                type="number"
                                className="bg-dark border-2 border-primary rounded px-2 py-1 w-20 text-light"
                                value={camera.step}
                                onChange={(e) => {
                                    let value = parseInt(e.target.value)
                                    if (isNaN(value) || value <= 1) return
                                    if (value > 20) value = 20
                                    setCamera({ ...camera, step: value })
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2 font-bold">
                            <p>Zoom</p>
                            <input
                                type="number"
                                className="bg-dark border-2 border-primary rounded px-2 py-1 w-20 text-light"
                                value={camera.zoom}
                                onChange={(e) => {
                                    let value = parseFloat(e.target.value)
                                    if (isNaN(value) || value <= 0.2) return
                                    if (value > 5) value = 5
                                    setCamera({ ...camera, zoom: value })
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2 font-bold">
                            <p>Width</p>
                            <input
                                type="number"
                                className="bg-dark border-2 border-primary rounded px-2 py-1 w-20 text-light"
                                value={renderSize.width}
                                onChange={(e) => {
                                    let value = parseInt(e.target.value)
                                    if (isNaN(value) || value < 0) return
                                    if (value > 41) value = 41
                                    setRenderSize({ ...renderSize, width: value })
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2 font-bold">
                            <p>Height</p>
                            <input
                                type="number"
                                className="bg-dark border-2 border-primary rounded px-2 py-1 w-20 text-light"
                                value={renderSize.height}
                                onChange={(e) => {
                                    let value = parseInt(e.target.value)
                                    if (isNaN(value) || value < 0) return
                                    if (value > 41) value = 41
                                    setRenderSize({ ...renderSize, height: value })
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2 font-bold">
                            <p>Realm</p>
                            <Select<{ value: Realm; label: string }>
                                className="w-full border-2 text-dark! border-primary rounded text-sm"
                                value={realm ? { value: realm, label: realm } : null}
                                onChange={(opt) => {
                                    if (!opt) return
                                    setCamera({ ...camera, realm: opt.value })
                                    gameActions.setRealm({ realm: opt.value })
                                }}
                                options={Object.values(Realm).map((realm) => ({
                                    value: realm,
                                    label: realm,
                                }))}
                                menuPlacement="auto"
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            />
                        </div>
                    </div>
                    <SettingsMenu />
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
                                                src={
                                                    textures[`/src/assets/textures/${obj.texture}.${obj.ext || "png"}`]
                                                }
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
                                            src={textures[`/src/assets/textures/${obj.texture}.${obj.ext || "png"}`]}
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
                            <div className="center-col items-start! gap-2 text-sm">
                                {Object.values(TERRAIN_COLORS).map((obj: Terrain, index) => (
                                    <div
                                        key={index}
                                        className={
                                            `w-full flex items-center gap-2 p-1 border-2 rounded cursor-pointer border-primary text-light font-bold ` +
                                            (brush?.id === obj.game_id && "bg-primary")
                                        }
                                        onClick={() =>
                                            changeBrush({ id: obj.name.toLowerCase(), type: "terrain", object: obj })
                                        }
                                    >
                                        <img
                                            src={textures[`/src/assets/textures/${obj.texture}.${obj.ext || "png"}`]}
                                            className="h-8 w-8 rounded"
                                        />
                                        {obj.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {brush && brush.id != "delete" && (
                        <div className="text-light grid grid-cols-[repeat(3,minmax(0,auto))] items-end gap-4 pointer-events-none">
                            <div className="center-col gap-2 bg-dark/90 rounded p-2 pointer-events-auto">
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
                            <div className="center-col">
                                <div className="center-col gap-2 bg-dark/90 rounded p-2 pointer-events-auto">
                                    {[13, 12, 11].map((value) => {
                                        return (
                                            <button
                                                key={value}
                                                className={
                                                    "border-2 border-primary px-4 py-1 font-bold" +
                                                    (brushZ === value ? " bg-primary" : "")
                                                }
                                                onClick={() => setBrushZ(value)}
                                            >
                                                z: {value}
                                            </button>
                                        )
                                    })}
                                </div>
                                {solid != null ? (
                                    <div className="center-col gap-2 bg-dark/90 rounded p-2 pointer-events-auto mt-2">
                                        <button
                                            className={
                                                "border-2 border-primary px-4 py-1 font-bold" +
                                                (solid ? " bg-primary" : "")
                                            }
                                            onClick={() => setSolid(!solid)}
                                        >
                                            Solid
                                        </button>
                                    </div>
                                ) : (
                                    <div />
                                )}
                            </div>
                            <div className="flex flex-col items-start justify-end gap-2 text-sm bg-dark/90 rounded p-2 pointer-events-auto">
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
                                                                `/src/assets/textures/${
                                                                    brush.object.texture
                                                                }_${variant}.${brush.object.ext || "png"}`
                                                            ]
                                                        }
                                                        className="h-8 w-8 rounded"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {brush.id === "teleporter" && (
                                    <ObjectConfig
                                        propKeys={["name", "target_x", "target_y", "target_realm"]}
                                        onChange={setObjectProps}
                                    />
                                )}
                                <div
                                    className={
                                        " flex items-center justify-start border-2 border-primary rounded cursor-pointer p-1 " +
                                        (selectedVariant == null ? "bg-primary!" : "")
                                    }
                                    onClick={() => setSelectedVariant(null)}
                                >
                                    <div className={"w-8 h-8 center-col mr-2"}>
                                        <img
                                            src={
                                                textures[
                                                    `/src/assets/textures/${brush.object.texture}.${
                                                        brush.object.ext || "png"
                                                    }`
                                                ]
                                            }
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
                editMode={true}
                center={{ ...camera, zoom: 1 / camera.zoom }}
                renderWidth={renderSize.width}
                renderHeight={renderSize.height}
                hoverHighlight={true}
                showSelectedCell={false}
                onCellDown={(pos) => handleCellClick(pos)}
                onCellEnter={(pos) => handleCellEnter(pos)}
            />
        </div>
    )
}

export default WorldEditor
