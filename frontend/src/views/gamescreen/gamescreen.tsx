import { use, useContext, useEffect, useRef, useState } from "react"
import type { RenderObject } from "../../models/game-models"
import { GamestateContext } from "../../contexts/gamestate-context"
import { UserContext } from "../../contexts/user-context"

const Gamescreen = () => {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 }) // x and y will be set to center on player

    const { gamestate, logout, gameActions } = useContext(GamestateContext)
    const { character } = useContext(UserContext)

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

    useEffect(() => {
        // Add player movement
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return
            const player = gamestate.render_objects[character.id]
            switch (event.key) {
                case "ArrowUp":
                    gameActions.move({ x: player.x, y: player.y + 1 })
                    break
                case "ArrowDown":
                    gameActions.move({ x: player.x, y: player.y - 1 })
                    break
                case "ArrowLeft":
                    gameActions.move({ x: player.x - 1, y: player.y })
                    break
                case "ArrowRight":
                    gameActions.move({ x: player.x + 1, y: player.y })
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
            const nameTag = document.createElement("p")
            nameTag.className = "text-[0.6rem] text-gray-800 mb-1"
            nameTag.innerText = obj.name
            div.appendChild(nameTag)

            // Add sprite to cell
            const spriteElement = document.createElement("div")
            spriteElement.className = "h-[30px] w-[18px]"
            spriteElement.style.backgroundColor = "black"
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
                        <div key={index} className="relative bg-gray-100 border-[1px] border-gray-400">
                            <p className="absolute bottom-0 left-0 ml-[1px] text-[0.5rem] text-gray-500">{`${wx}, ${wy}`}</p>
                            <div
                                id={cellName(wx, wy)}
                                className="h-full flex flex-row items-center justify-around bg-green-200"
                            ></div>
                        </div>
                    )
                })}
            </div>
            <button className="absolute bottom-0 right-0 m-4 bg-red-500! font-bold!" onClick={logout}>
                Log out
            </button>
        </div>
    )
}
export default Gamescreen
