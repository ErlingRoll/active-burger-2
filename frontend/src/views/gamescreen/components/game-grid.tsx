import { useContext, useEffect, useMemo, PointerEvent, MouseEvent } from "react"
import { GamestateContext } from "../../../contexts/gamestate-context"
import { CharacterContext } from "../../../contexts/character-context"
import { UIContext } from "../../../contexts/ui-context"
import { Character, Entity, RenderObject } from "../../../models/object"
import { Terrain } from "../../../models/terrain"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

type GameGridProps = {
    center?: { x: number; y: number; zoom: number }
    renderWidth?: number
    renderHeight?: number
    hoverHighlight?: boolean
    showSelectedCell?: boolean
    onCellClick?: ({ x, y, event }: { x: number; y: number; event: MouseEvent }) => void
    onCellDown?: ({ x, y, event }: { x: number; y: number; event: PointerEvent }) => void
    onCellEnter?: ({ x, y, event }: { x: number; y: number; event: PointerEvent }) => void
    onCellLeave?: ({ x, y, event }: { x: number; y: number; event: PointerEvent }) => void
    editMode?: boolean
}

const GameGrid = ({
    center,
    renderWidth = 31,
    renderHeight = 21,
    hoverHighlight = false,
    showSelectedCell = true,
    onCellClick,
    onCellDown,
    onCellEnter,
    onCellLeave,
    editMode = false,
}: GameGridProps) => {
    const { gamestate, terrain } = useContext(GamestateContext)
    const { character } = useContext(CharacterContext)
    const { showGrid } = useContext(UIContext)

    const cellName = (x: number, y: number) => `cell-${x},${y}`
    const terrainCellName = (x: number, y: number) => `terrain-${x},${y}`

    function camera() {
        if (editMode && center) return center
        const player = gamestate.render_objects[character.id]
        if (!player) return
        return center || { x: player.x, y: player.y, zoom: 1 }
    }

    function drawObjectCell(obj: RenderObject & Entity & Character, cell: HTMLElement) {
        cell.innerHTML = ""

        // Obj container
        const div = document.createElement("div")
        div.className = "absolute top-0 left-0 h-full w-full flex flex-col items-center"
        cell.appendChild(div)

        // Add Name
        if (obj.name_visible) {
            const nameContainer = document.createElement("div")
            const nameTagHeightHolder = document.createElement("p")
            nameTagHeightHolder.innerHTML = "&nbsp;"
            nameTagHeightHolder.className = "text-transparent text-[0.7rem] user-select-none select-none"
            nameContainer.appendChild(nameTagHeightHolder)
            const nameTag = document.createElement("p")
            nameTag.className =
                "absolute top-0 left-1/2 transform -translate-x-1/2 text-[0.7rem] text-blue-100 drop-shadow-[0.1px_0.3px_1px_rgb(0,0,0)] font-bold whitespace-nowrap z-10"
            nameTag.innerText = obj.name
            nameContainer.appendChild(nameTag)
            div.appendChild(nameContainer)
        }

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

        if (obj.type !== "character" && obj.texture) {
            const imgContainer = document.createElement("div")
            imgContainer.className = "w-full flex-1 flex"
            imgContainer.style.backgroundImage = `url('${
                textures[`/src/assets/textures/${obj.texture}.png`] as string
            }')`
            imgContainer.style.backgroundSize = "contain"
            imgContainer.style.backgroundRepeat = "no-repeat"
            imgContainer.style.backgroundPosition = "center"
            if (obj.direction === "left") imgContainer.style.transform = "scaleX(-1)"
            div.appendChild(imgContainer)
            return
        }

        if (obj.type === "character") {
            const imgContainer = document.createElement("div")
            imgContainer.className = "w-full flex-1 flex"
            imgContainer.style.backgroundImage = `url('${
                textures["/src/assets/textures/character/among_us.png"] as string
            }')`
            imgContainer.style.backgroundSize = "contain"
            imgContainer.style.backgroundRepeat = "no-repeat"
            imgContainer.style.backgroundPosition = "center"
            if (obj.direction === "left") imgContainer.style.transform = "scaleX(-1)"
            div.appendChild(imgContainer)
            return
        }
    }

    function drawObjects(objects: { [id: string]: RenderObject & Entity & Character }) {
        const _center = camera()
        const pos_list: { x: number; y: number }[] = Array.from({ length: renderWidth * renderHeight }).map(
            (_, index) => {
                const wx = (index % renderWidth) + Math.floor(_center.x - renderWidth / 2) + 1
                const wy = Math.floor(renderHeight / 2) - Math.floor(index / renderWidth) + _center.y
                return { x: wx, y: wy }
            }
        )

        for (const pos of pos_list) {
            const worldX = pos.x
            const worldY = pos.y
            const cell = document.getElementById(cellName(worldX, worldY))
            if (!cell) continue
            cell.innerHTML = ""
            const pos_objects: (RenderObject & Entity & Character)[] = objects[`${pos.x}_${pos.y}`] as any
            if (!pos_objects) continue
            for (const obj of pos_objects) {
                drawObjectCell(obj, cell)
                if (obj.id === character.id) break
            }
        }
    }

    function drawTerrain(terrainData: { [pos: string]: Terrain[] }) {
        const _center = camera()
        const pos_list: { x: number; y: number }[] = Array.from({ length: renderWidth * renderWidth }).map(
            (_, index) => {
                const wx = (index % renderWidth) + Math.floor(_center.x - renderWidth / 2) + 1
                const wy = Math.floor(renderHeight / 2) - Math.floor(index / renderWidth) + _center.y
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
            const tImgContainer = document.createElement("div")
            tImgContainer.className = "absolute top-0 left-0 h-full w-full flex flex-col items-center"
            terrains.forEach((terrain) => {
                const img = document.createElement("img")
                img.src = textures[`/src/assets/textures/${terrain.texture}.${terrain.ext || "png"}`] as string
                img.className = `absolute top-0 h-full z-[${terrain.z}]`
                img.style.zIndex = terrain.z.toString()
                tImgContainer.appendChild(img)
            })
            tCell.appendChild(tImgContainer)
        }
    }

    function getSelectedCell() {
        if (editMode) return null
        if (!character || !gamestate) return
        const player = gamestate.render_objects[character.id]
        if (!player) return
        const x = player.x
        const y = player.y

        const newPosMap = {
            up: { x: x, y: y + 1 },
            down: { x: x, y: y - 1 },
            left: { x: x - 1, y: y },
            right: { x: x + 1, y: y },
        }

        return newPosMap[player.direction]
    }

    const selectedCell = useMemo(() => getSelectedCell(), [gamestate])

    useEffect(() => {
        drawTerrain(terrain)
    }, [terrain, gamestate, center])

    useEffect(() => {
        if (!gamestate.position_objects) return
        drawObjects(gamestate.position_objects as any)
    }, [gamestate, center])

    return (
        <div
            id="game-grid"
            className={`grid auto-rows-[64px] gap-0 border border-gray-100/30`}
            style={{
                gridTemplateColumns: `repeat(${renderWidth}, ${64 * camera().zoom}px)`,
                gridTemplateRows: `repeat(${renderHeight}, ${64 * camera().zoom}px)`,
            }}
        >
            {Array.from({ length: renderWidth * renderHeight }).map((_, index) => {
                const _center = camera()
                const wx = (index % renderWidth) + Math.floor(_center.x - renderWidth / 2) + 1
                const wy = Math.floor(renderHeight / 2) - Math.floor(index / renderWidth) + _center.y
                return (
                    <div
                        key={index}
                        className={`relative`}
                        onPointerDown={(event) => onCellDown && onCellDown({ x: wx, y: wy, event: event })}
                        onPointerEnter={(event) => onCellEnter && onCellEnter({ x: wx, y: wy, event: event })}
                        onPointerLeave={(event) => onCellLeave && onCellLeave({ x: wx, y: wy, event: event })}
                    >
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
                            className="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-around z-10"
                        />
                        <div className="absolute top-0 left-0 w-full h-full border-[1px] border-light opacity-10" />
                        {showSelectedCell && selectedCell && selectedCell.x === wx && selectedCell.y === wy && (
                            <div className="absolute top-0 left-0 w-full h-full border-2 border-dashed border-primary" />
                        )}
                        <div
                            className={`absolute top-0 left-0 w-full h-full z-110 border-orange-300 border-dashed ${
                                hoverHighlight && "cursor-pointer hover:border-2"
                            }`}
                            onClick={(event) => onCellClick && onCellClick({ x: wx, y: wy, event: event })}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default GameGrid
