import { useContext, useEffect, useState } from "react"
import { GamestateContext } from "../contexts/gamestate-context"
import { Character, Entity, RenderObject } from "../models/object"
import { CharacterContext } from "../contexts/character-context"
import { UIContext } from "../contexts/ui-context"
import { PlayerContext } from "../contexts/player-context"
import { terrainObjects } from "../game/objects"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const WorldEditor = () => {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 0.8 }) // x and y will be set to center on player
    const [brush, setBrush] = useState<string | null>(null)

    const [lastMoveRepeat, setLastMoveRepeat] = useState<number>(Date.now())
    const moveRepeatDelay = 100 // milliseconds

    const { gamestate, logout } = useContext(GamestateContext)
    const { character } = useContext(CharacterContext)
    const { showGrid } = useContext(UIContext)
    const { gameActions } = useContext(PlayerContext)

    const renderDistance = 31 // Number of cells to render around the player

    const cellName = (x: number, y: number) => `cell-${x},${y}`

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
                "absolute top-0 left-1/2 transform -translate-x-1/2 text-[0.7rem] text-blue-700 font-bold whitespace-nowrap"
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
                    setCamera((oldCamera) => ({ ...oldCamera, y: oldCamera.y + 1 }))
                    break
                case "arrowdown":
                case "s":
                    setCamera((oldCamera) => ({ ...oldCamera, y: oldCamera.y - 1 }))
                    break
                case "arrowleft":
                case "a":
                    setCamera((oldCamera) => ({ ...oldCamera, x: oldCamera.x - 1 }))
                    break
                case "arrowright":
                case "d":
                    setCamera((oldCamera) => ({ ...oldCamera, x: oldCamera.x + 1 }))
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

    function handleCellClick(x: number, y: number) {
        if (!brush) return

        const posObjects = gamestate.position_objects[`${x}_${y}`] || []
        if (brush === "delete") {
            if (posObjects.length === 0) return
            gameActions.deleteObject(posObjects[0].id)
            return
        }

        gameActions.placeObject({
            object_id: brush,
            x: x,
            y: y,
        })
    }

    return (
        <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden select-none bg-[#f0d0b1]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-200">
                <div className="absolute bottom-0 left-0 m-4 pointer-events-auto">
                    <div className="bg-dark/90 text-light p-2 pt-1 rounded">
                        <p className="text-lg font-bold">Brush: {brush}</p>
                        <div className="flex gap-2 items-end">
                            <div className="center-col items-start! gap-2">
                                {terrainObjects.map((obj) => (
                                    <button
                                        key={obj.object_id}
                                        className={
                                            `w-full px-4 py-2 border-2 border-primary text-light font-bold ` +
                                            (brush === obj.object_id && "bg-primary")
                                        }
                                        onClick={() => setBrush(obj.object_id)}
                                    >
                                        {obj.name}
                                    </button>
                                ))}
                            </div>
                            <button
                                className={
                                    `px-4 py-2 border-2 border-danger text-light font-bold ` +
                                    (brush === "delete" && "bg-danger")
                                }
                                onClick={() => setBrush("delete")}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                id="game-grid"
                className={`grid gap-0 border border-gray-100 user-select-auto`}
                style={{
                    gridTemplateColumns: `repeat(${renderDistance}, ${64 * camera.zoom}px)`,
                    gridTemplateRows: `repeat(${renderDistance}, ${64 * camera.zoom}px)`,
                }}
            >
                {/* Grid */}
                {Array.from({ length: renderDistance * renderDistance }).map((_, index) => {
                    const center = { x: camera.x, y: camera.y }
                    const wx = (index % renderDistance) + center.x - Math.floor(renderDistance / 2)
                    const wy = Math.floor(renderDistance / 2) - Math.floor(index / renderDistance) + center.y
                    return (
                        <div key={index} className={`relative border-[1px] border-gray-100`}>
                            {/* Admin cell overlay */}
                            <div
                                className={`absolute top-0 left-0 w-full h-full hover:border-2 border-orange-300 cursor-pointer z-110`}
                                onClick={() => handleCellClick(wx, wy)}
                            />

                            {showGrid && (
                                <p className="absolute bottom-0 left-0 ml-[1px] text-[0.5rem] text-gray-500">{`${wx}, ${wy}`}</p>
                            )}
                            <div
                                id={cellName(wx, wy)}
                                className="h-full flex flex-row items-center justify-around bg-[#f0d0b1]"
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default WorldEditor
