import { useContext, useEffect, useState } from "react"
import { GamestateContext } from "../contexts/gamestate-context"
import { Character, Entity, RenderObject } from "../models/object"
import { CharacterContext } from "../contexts/character-context"
import { UIContext } from "../contexts/ui-context"
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
    const { showGrid } = useContext(UIContext)
    const { gameActions } = useContext(PlayerContext)

    const renderDistance = 31 // Number of cells to render around the player
    const cameraStep = 3

    const cellName = (x: number, y: number) => `cell-${x},${y}`
    const terrainCellName = (x: number, y: number) => `terrain-${x},${y}`

    function clearGrid() {
        const gameGrid = document.getElementById("game-grid")
        if (!gameGrid) return
        gameGrid.querySelectorAll('div[id^="cell-"]').forEach((cell) => {
            cell.innerHTML = ""
        })
    }

    function clearObject(objectId: string) {
        const obj = document.getElementById(`object-${objectId}`)
        if (obj && obj.parentNode) {
            obj.parentNode.removeChild(obj)
        }
    }

    function drawObject(obj: RenderObject & Entity & Character) {
        const cell = document.getElementById(cellName(obj.x, obj.y))
        if (!cell) return

        clearObject(obj.id)

        // Obj container
        const div = document.createElement("div")
        div.id = `object-${obj.id}`
        div.className = "h-full flex flex-col items-center z-100"
        cell.appendChild(div)

        // Add HP bar
        if (obj.max_hp! != null && obj.current_hp != null && obj.type !== "character" && obj.current_hp < obj.max_hp) {
            const hpBarContainer = document.createElement("div")
            hpBarContainer.className =
                "w-10 h-2 bg-red-200 rounded border-2 border-dark overflow-hidden pointer-events-none"
            const hpBar = document.createElement("div")
            hpBar.className = "h-2 bg-red-600"
            const hpPercent = Math.max(0, (obj.current_hp / obj.max_hp) * 100)
            hpBar.style.width = hpPercent + "%"
            hpBarContainer.appendChild(hpBar)
            div.appendChild(hpBarContainer)
        }

        // Add Name
        if (obj.name_visible) {
            const nameContainer = document.createElement("div")
            const nameTagHeightHolder = document.createElement("p")
            nameTagHeightHolder.innerHTML = "&nbsp;"
            nameTagHeightHolder.className = "text-transparent text-[0.7rem] user-select-none select-none"
            nameContainer.appendChild(nameTagHeightHolder)

            const nameTag = document.createElement("p")
            nameTag.className =
                "absolute top-0 left-1/2 transform -translate-x-1/2 text-[0.7rem] text-blue-100 drop-shadow-[0.1px_0.3px_1px_rgb(0,0,0)] font-bold whitespace-nowrap"
            nameTag.innerText = obj.name
            nameContainer.appendChild(nameTag)
            div.appendChild(nameContainer)
        }

        if (obj.texture) {
            const img = document.createElement("img")
            img.src = textures[`/src/assets/textures/${obj.texture}.png`] as string
            img.alt = obj.name
            img.className = "h-full"
            div.appendChild(img)
            return
        }

        if (obj.type === "character") {
            const img = document.createElement("img")
            img.src = textures["/src/assets/textures/character/among_us.png"] as string
            if (obj.direction === "left") img.style.transform = "scaleX(-1)"
            img.alt = obj.name
            img.className = "h-full"
            div.appendChild(img)
            return
        }

        // Add sprite to cell
        const spriteElement = document.createElement("div")
        spriteElement.className = "h-[30px] w-[18px]"
        spriteElement.style.backgroundColor = "brown"
        div.appendChild(spriteElement)
    }

    function drawTerrain(terrainData: { [pos: string]: Terrain[] }) {
        const center = { x: camera.x, y: camera.y }
        const pos_list: { x: number; y: number }[] = Array.from({ length: renderDistance * renderDistance }).map(
            (_, index) => {
                const wx = (index % renderDistance) + center.x - Math.floor(renderDistance / 2)
                const wy = Math.floor(renderDistance / 2) - Math.floor(index / renderDistance) + center.y
                return { x: wx, y: wy }
            }
        )

        for (const pos of pos_list) {
            const worldX = pos.x
            const worldY = pos.y
            const tCell = document.getElementById(terrainCellName(worldX, worldY))
            if (!tCell) continue
            tCell.innerHTML = ""
            const terrains = terrainData[`${pos.x}_${pos.y}`]
            if (!terrains) continue
            terrains.forEach((terrain) => {
                const img = document.createElement("img")
                img.src = textures[`/src/assets/textures/${terrain.texture}.png`] as string
                img.className = "w-full h-full"
                img.style.zIndex = terrain.z.toString()
                tCell.appendChild(img)
            })
        }
    }

    useEffect(() => {
        drawTerrain(terrain)
    }, [terrain, camera])

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
        clearGrid()
        Object.values(gamestate.render_objects).forEach((obj: any) => drawObject(obj))
    }, [gamestate, camera])

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
                                            `w-full flex items-center gap-2 px-4 py-2 border-2 rounded cursor-pointer border-primary text-light font-bold ` +
                                            (brush?.id === obj.object_id && "bg-primary")
                                        }
                                        onClick={() => changeBrush({ id: obj.object_id, type: "object" })}
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
                                            `w-full flex items-center gap-2 px-4 py-2 border-2 rounded cursor-pointer border-primary text-light font-bold ` +
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
                renderDistance={31}
                hoverHighlight={true}
                showSelectedCell={false}
            />
        </div>
    )
}

export default WorldEditor
