import { useContext, useEffect, useState } from "react"
import { GamestateContext } from "../../contexts/gamestate-context"
import { UserContext } from "../../contexts/user-context"
import { FaTimes } from "react-icons/fa"
import { stone } from "../../game/objects/stone"
import { goldOre } from "../../game/objects/ore/gold"
import { bush } from "../../game/objects/bush"
import { Character, Entity, RenderObject } from "../../models/object"
import { CharacterContext } from "../../contexts/character-context"
import Inventory from "./components/inventory"
import CharacterInfo from "./components/character-info"
import Settings from "./components/settings"
import CellInfo from "./components/cell-info"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const Gamescreen = () => {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 }) // x and y will be set to center on player
    const [showGrid, setShowGrid] = useState(false)
    const [adminCell, setAdminCell] = useState<{ x: number; y: number } | null>(null)
    const [adminMode, setAdminMode] = useState(true)
    const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null)

    const { gamestate, logout, gameActions } = useContext(GamestateContext)
    const { admin } = useContext(UserContext)
    const { character } = useContext(CharacterContext)

    const renderDistance = 41 // Number of cells to render around the player

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
        div.className = "flex flex-col items-center z-100"
        cell.appendChild(div)

        // Add HP bar
        if (obj.max_hp! != null && obj.current_hp != null && obj.type !== "character") {
            const hpBarContainer = document.createElement("div")
            hpBarContainer.className = "w-10 h-2 bg-red-200 rounded"
            const hpBar = document.createElement("div")
            hpBar.className = "h-2 bg-red-600 rounded"
            const hpPercent = Math.max(0, (obj.current_hp / obj.max_hp) * 100)
            hpBar.style.width = hpPercent + "%"
            hpBarContainer.appendChild(hpBar)
            div.appendChild(hpBarContainer)
        }

        // Add Name
        if (obj.name_visible) {
            const nameTag = document.createElement("p")
            nameTag.className = "text-[0.7rem] text-blue-700 font-bold"
            nameTag.innerText = obj.name
            div.appendChild(nameTag)
        }

        if (obj.texture) {
            const img = document.createElement("img")
            img.src = textures[`/src/assets/textures/${obj.texture}.png`] as string
            img.alt = obj.name
            img.style.width = obj.width + "px"
            img.style.height = obj.height + "px"
            div.appendChild(img)
            return
        }

        if (obj.type === "character") {
            const img = document.createElement("img")
            img.src = textures["/src/assets/textures/character/among_us.png"] as string
            if (obj.direction === "left") img.style.transform = "scaleX(-1)"
            img.alt = obj.name
            img.style.width = 42 + "px"
            img.style.height = 42 + "px"
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
        // Add player movement
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return
            const player = gamestate.render_objects[character.id]
            switch (event.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    gameActions.move({ x: player.x, y: player.y + 1, direction: "up" })
                    event.preventDefault()
                    break
                case "ArrowDown":
                case "s":
                case "S":
                    gameActions.move({ x: player.x, y: player.y - 1, direction: "down" })
                    event.preventDefault()
                    break
                case "ArrowLeft":
                case "a":
                case "A":
                    gameActions.move({ x: player.x - 1, y: player.y, direction: "left" })
                    break
                case "ArrowRight":
                case "d":
                case "D":
                    gameActions.move({ x: player.x + 1, y: player.y, direction: "right" })
                    event.preventDefault()
                    break
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [gamestate, character, gameActions])

    function getSelectedCell() {
        const player = gamestate.render_objects[character.id]
        const x = player.x
        const y = player.y

        const newPosMap = {
            up: { x: x, y: y + 1 },
            down: { x: x, y: y - 1 },
            left: { x: x - 1, y: y },
            right: { x: x + 1, y: y },
        }

        const newPos = newPosMap[player.direction]
        setSelectedCell(newPos)
    }

    function clearNeighborHighlights() {
        const gameGrid = document.getElementById("game-grid")
        if (!gameGrid) return
        gameGrid.querySelectorAll(".selected-cell").forEach((cell) => {
            cell.classList.remove("selected-cell", "border-2", "border-orange-400")
        })
    }

    function colorSelectedCell() {
        clearNeighborHighlights()
        const cell = document.getElementById(cellName(selectedCell.x, selectedCell.y))
        if (!cell) return
        cell.classList.add("selected-cell", "border-2", "border-orange-400")
    }

    useEffect(() => {
        if (!selectedCell) return
        colorSelectedCell()
    }, [selectedCell])

    useEffect(() => {
        clearGrid()
        Object.values(gamestate.render_objects).forEach((obj: any) => drawObject(obj))
        getSelectedCell()
    }, [gamestate])

    return (
        <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden">
            <Inventory />
            <div className="absolute flex items-start top-0 left-0 z-200">
                <CharacterInfo />
                <CellInfo pos={selectedCell} />
            </div>
            <Settings showGrid={showGrid} setShowGrid={setShowGrid} adminMode={adminMode} setAdminMode={setAdminMode} />

            <div id="game-grid" className={`grid grid-cols-[repeat(41,64px)] auto-rows-[64px] gap-0 border`}>
                {/* Grid */}
                {Array.from({ length: renderDistance * renderDistance }).map((_, index) => {
                    const center = {
                        x: gamestate.render_objects[character.id].x,
                        y: gamestate.render_objects[character.id].y,
                    }
                    const wx = (index % renderDistance) + center.x - Math.floor(renderDistance / 2)
                    const wy = Math.floor(renderDistance / 2) - Math.floor(index / renderDistance) + center.y
                    return (
                        <div key={index} className={`relative bg-gray-100 border-[1px] border-gray-100`}>
                            {/* Admin cell overlay */}
                            {adminMode && (
                                <div
                                    className={
                                        `absolute top-0 left-0 w-full h-full hover:border-2 border-orange-300 cursor-pointer z-110 ` +
                                        (adminCell && adminCell.x === wx && adminCell.y === wy
                                            ? "border-2 border-orange-500"
                                            : "")
                                    }
                                    onClick={() => setAdminCell({ x: wx, y: wy })}
                                />
                            )}

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

            {adminCell && (
                <div className="absolute top-0 left-0 w-full center-col pointer-events-none z-200">
                    <div className="relative bg-white/70 rounded m-4 p-2 pb-4 center-col pointer-events-auto">
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
                                {/* <button
                                    className="min-w-28 mb-2 bg-primary text-light font-bold px-4 py-2"
                                    onClick={() => gameActions.placeObject(stone)}
                                >
                                    Stone
                                </button> */}
                                <button
                                    className="min-w-28 mb-2 bg-primary text-light font-bold px-4 py-2"
                                    onClick={() =>
                                        gameActions.placeObject({
                                            object_id: "gold_ore",
                                            x: adminCell.x,
                                            y: adminCell.y,
                                        })
                                    }
                                >
                                    Gold ore
                                </button>
                                {/* <button
                                    className="min-w-28 mb-2 bg-primary text-light font-bold px-4 py-2"
                                    onClick={() => gameActions.placeObject(bush({ x: adminCell.x, y: adminCell.y }))}
                                >
                                    Bush
                                </button> */}
                            </div>
                            <div className="self-start center-col">
                                <p className="font-bold mb-2">Give Object</p>
                                <button
                                    className="min-w-28 mb-2 bg-primary text-light font-bold px-4 py-2"
                                    onClick={() => gameActions.giveItem({ item_id: "burger" })}
                                >
                                    Burger
                                </button>
                                <button
                                    className="min-w-28 mb-2 bg-primary text-light font-bold px-4 py-2"
                                    onClick={() => gameActions.giveItem({ item_id: "burger" })}
                                >
                                    Tomato
                                </button>
                            </div>

                            <div className="self-start center-col">
                                <p className="font-bold mb-2">Place Tiles</p>
                                {
                                    <img
                                        className="min-w-28 mb-2 text-light font-bold px-4 py-2"
                                        onClick={() =>
                                            gameActions.placeObject({
                                                object_id: "dirt_tile",
                                                x: adminCell.x,
                                                y: adminCell.y,
                                            })
                                        }
                                        src="src\assets\textures\tiles\dirt.png"
                                    ></img>
                                }
                                <button
                                    className="min-w-28 mb-2 bg-primary text-light font-bold px-4 py-2"
                                    onClick={() =>
                                        gameActions.placeObject({
                                            object_id: "gold_ore",
                                            x: adminCell.x,
                                            y: adminCell.y,
                                        })
                                    }
                                >
                                    Gold ore
                                </button>
                                {/* <button
                                    className="min-w-28 mb-2 bg-primary text-light font-bold px-4 py-2"
                                    onClick={() => gameActions.placeObject(bush({ x: adminCell.x, y: adminCell.y }))}
                                >
                                    Bush
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Gamescreen
