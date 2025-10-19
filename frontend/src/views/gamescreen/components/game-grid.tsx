import { Fragment, useContext, useEffect, useState } from "react"
import { GamestateContext } from "../../../contexts/gamestate-context"
import { CharacterContext } from "../../../contexts/character-context"
import { UIContext } from "../../../contexts/ui-context"
import { PlayerContext } from "../../../contexts/player-context"
import { Character, Entity, RenderObject } from "../../../models/object"
import { Terrain } from "../../../models/terrain"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

type GameGridProps = {
    center?: { x: number; y: number; zoom: number }
    renderDistance?: number
    hoverHighlight?: boolean
    showSelectedCell?: boolean
    onCellClick?: ({ x, y }: { x: number; y: number }) => void
}

const GameGrid = ({
    center,
    renderDistance = 31,
    hoverHighlight = false,
    showSelectedCell = true,
    onCellClick,
}: GameGridProps) => {
    const { gamestate, terrain } = useContext(GamestateContext)
    const { character } = useContext(CharacterContext)
    const { showGrid } = useContext(UIContext)
    const { selectedCell } = useContext(PlayerContext)

    const cellName = (x: number, y: number) => `cell-${x},${y}`
    const terrainCellName = (x: number, y: number) => `terrain-${x},${y}`

    function camera() {
        const player = gamestate.render_objects[character.id]
        return center || { x: player.x, y: player.y, zoom: 1 }
    }

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
        div.className = "h-full flex flex-col items-center"
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
        const _center = camera()
        const pos_list: { x: number; y: number }[] = Array.from({ length: renderDistance * renderDistance }).map(
            (_, index) => {
                const wx = (index % renderDistance) + _center.x - Math.floor(renderDistance / 2)
                const wy = Math.floor(renderDistance / 2) - Math.floor(index / renderDistance) + _center.y
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
    }, [terrain, gamestate])

    useEffect(() => {
        clearGrid()
        Object.values(gamestate.render_objects).forEach((obj: any) => drawObject(obj))
    }, [gamestate])

    return (
        <div
            id="game-grid"
            className={`grid auto-rows-[64px] gap-0 border border-gray-100/30`}
            style={{
                gridTemplateColumns: `repeat(${renderDistance}, ${64 * camera().zoom}px)`,
                gridTemplateRows: `repeat(${renderDistance}, ${64 * camera().zoom}px)`,
            }}
        >
            {Array.from({ length: renderDistance * renderDistance }).map((_, index) => {
                const _center = camera()
                const wx = (index % renderDistance) + _center.x - Math.floor(renderDistance / 2)
                const wy = Math.floor(renderDistance / 2) - Math.floor(index / renderDistance) + _center.y
                return (
                    <div key={index} className={`relative`}>
                        {showGrid && (
                            <p className="absolute bottom-0 left-0 ml-[1px] text-[0.8rem] text-light drop-shadow-[0.1px_0.3px_1px_rgb(0,0,0)] z-1000 pointer-events-none">{`${wx}, ${wy}`}</p>
                        )}
                        <img
                            src={textures[`/src/assets/textures/terrain/grass.png`]}
                            className="absolute top-0 left-0 w-full h-full"
                        />
                        <div className="absolute top-0 left-0 w-full h-full" id={terrainCellName(wx, wy)} />
                        <div
                            id={cellName(wx, wy)}
                            className="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-around"
                        />
                        <div className="absolute top-0 left-0 w-full h-full border-[1px] border-light opacity-20" />
                        {showSelectedCell && selectedCell && selectedCell.x === wx && selectedCell.y === wy && (
                            <div className="absolute top-0 left-0 w-full h-full border-2 border-dashed border-primary" />
                        )}
                        <div
                            className={`absolute top-0 left-0 w-full h-full z-110 border-orange-300 border-dashed ${
                                hoverHighlight && "cursor-pointer hover:border-2"
                            }`}
                            onClick={() => onCellClick && onCellClick({ x: wx, y: wy })}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default GameGrid
