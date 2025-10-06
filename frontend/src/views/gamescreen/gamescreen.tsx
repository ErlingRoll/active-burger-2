import { use, useContext, useEffect, useRef, useState } from "react"
import type { RenderObject } from "../../models/game-models"
import { GamestateContext } from "../../contexts/gamestate-context"
import { UserContext } from "../../contexts/user-context"
import { FaTimes } from "react-icons/fa"
import { stone } from "../../game/objects/stone"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

const Gamescreen = () => {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 }) // x and y will be set to center on player
    const [showGrid, setShowGrid] = useState(false)
    const [adminCell, setAdminCell] = useState<{ x: number; y: number } | null>(null)

    const { gamestate, logout, gameActions } = useContext(GamestateContext)
    const { character, admin } = useContext(UserContext)

    const renderDistance = 21 // Number of cells to render around the player
    const cellSize = 64 // Size of each grid cell in world space

    const cellName = (x: number, y: number) => `cell-${x},${y}`

    function clearGrid() {
        const gameGrid = document.getElementById("game-grid")
        if (!gameGrid) return
        gameGrid.querySelectorAll('div[id^="cell-"]').forEach((cell) => {
            cell.innerHTML = ""
        })
    }

    useEffect(() => {}, [])

    useEffect(() => {
        // Add player movement
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return
            const player = gamestate.render_objects[character.id]
            switch (event.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    gameActions.move({ x: player.x, y: player.y + 1 })
                    event.preventDefault()
                    break
                case "ArrowDown":
                case "s":
                case "S":
                    gameActions.move({ x: player.x, y: player.y - 1 })
                    event.preventDefault()
                    break
                case "ArrowLeft":
                case "a":
                case "A":
                    gameActions.move({ x: player.x - 1, y: player.y })
                    break
                case "ArrowRight":
                case "d":
                case "D":
                    gameActions.move({ x: player.x + 1, y: player.y })
                    event.preventDefault()
                    break
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [gamestate, character, gameActions])

    useEffect(() => {
        clearGrid()
        Object.entries(gamestate.render_objects).forEach(([key, obj]) => {
            const cell = document.getElementById(cellName(obj.x, obj.y))
            if (!cell) return

            // Obj container
            const div = document.createElement("div")
            div.className = "flex flex-col items-center"
            cell.appendChild(div)

            // Add Name
            if (obj.name_visible) {
                const nameTag = document.createElement("p")
                nameTag.className = "text-[0.7rem] text-blue-700 font-bold mb-1"
                nameTag.innerText = obj.name
                div.appendChild(nameTag)
            }

            if (obj.texture) {
                const img = document.createElement("img")
                img.src = textures[`/src/assets/textures/${obj.texture}.png`] as string
                div.appendChild(img)
                return
            }

            // Add sprite to cell

            const spriteElement = document.createElement("div")
            spriteElement.className = "h-[30px] w-[18px]"
            spriteElement.style.backgroundColor = "brown"
            div.appendChild(spriteElement)
        })
    }, [gamestate])

    return (
        <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden">
            <div id="game-grid" className={`grid grid-cols-[repeat(21,64px)] auto-rows-[64px] gap-0 border`}>
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
                            {admin && (
                                <div
                                    className="absolute top-0 left-0 w-full h-full hover:border-2 border-orange-500 cursor-pointer"
                                    onClick={() => setAdminCell({ x: wx, y: wy })}
                                ></div>
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

            <div className="absolute top-0 right-0 m-4 p-2 bg-white/70 rounded flex flex-col items-center">
                <div className="center-col items-start!">
                    <p className="font-bold text-lg">{character.name}</p>
                    <p className="text-sm text-gray-700">Character: {character.id}</p>
                    <p className="text-sm text-gray-700">Account: {character.account_id}</p>
                    <p className="text-sm text-gray-700">Admin: {admin ? "Yes" : "No"}</p>
                    <p className="text-sm text-gray-700">
                        Pos: ({gamestate.render_objects[character.id].x}, {gamestate.render_objects[character.id].y})
                    </p>
                </div>
            </div>

            {adminCell && (
                <div className="absolute top-0 left-0 w-full center-col">
                    <div className="relative w-64 bg-white/70 rounded m-4 p-2 pb-4 center-col">
                        <button
                            className="absolute top-2 right-2 bg-danger p-[0.2rem]"
                            onClick={() => setAdminCell(null)}
                        >
                            <FaTimes className="text-light" />
                        </button>
                        <p className="mb-4">{adminCell ? `X: ${adminCell.x} Y: ${adminCell.y}` : "No Admin Cell"}</p>
                        <button
                            className="bg-primary text-light font-bold px-4 py-2"
                            onClick={() => gameActions.place(stone({ x: adminCell.x, y: adminCell.y }))}
                        >
                            Add stone
                        </button>
                    </div>
                </div>
            )}

            <div className="absolute center-col items-end bottom-0 right-0 m-4">
                <button
                    className={
                        `min-w-24 px-4 pt-2 pb-3 rounded text-light font-bold ` +
                        (showGrid ? "bg-success" : "bg-danger")
                    }
                    onClick={() => setShowGrid(!showGrid)}
                >
                    {showGrid ? "Grid on" : "Grid off"}
                </button>
                <button className="min-w-24 px-4 pt-2 pb-3 mt-4 text-light bg-danger font-bold" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    )
}
export default Gamescreen
