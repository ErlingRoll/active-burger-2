import { use, useEffect, useRef, useState } from 'react'
import type { RenderObject } from '../../models/game-models'

// Extend RenderObject with more properties as needed
interface ExtendedRenderObject extends RenderObject {
    width: number
    height: number
    color: string
}

const Gamescreen = () => {
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 }) // x and y will be set to center on player
    const [renderObjects, setRenderObjects] = useState<{ [key: string]: ExtendedRenderObject }>({
        player: { x: 0, y: 0, color: 'blue', width: 32, height: 32 },
        erling: { x: 3, y: 1, color: 'red', width: 32, height: 32 },
        ola: { x: -3, y: 2, color: 'green', width: 32, height: 32 },
    })

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const renderDistance = 21 // Number of cells to render around the player
    const cellSize = 64 // Size of each grid cell in world space

    const cellName = (x: number, y: number) => `cell-${x},${y}`

    function clearGrid() {
        const gameGrid = document.getElementById('game-grid')
        if (!gameGrid) return
        gameGrid.querySelectorAll('div[id^="cell-"]').forEach((cell) => {
            cell.innerHTML = ''
        })
    }

    useEffect(() => {
        // Add player movement
        const handleKeyDown = (event: KeyboardEvent) => {
            setRenderObjects((prev) => {
                const newPlayerPos = { ...prev['player'] }
                switch (event.key) {
                    case 'ArrowUp':
                        newPlayerPos.y -= 1
                        break
                    case 'ArrowDown':
                        newPlayerPos.y += 1
                        break
                    case 'ArrowLeft':
                        newPlayerPos.x -= 1
                        break
                    case 'ArrowRight':
                        newPlayerPos.x += 1
                        break
                }
                return { ...prev, player: newPlayerPos }
            })
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        clearGrid()
        Object.entries(renderObjects).forEach(([key, obj]) => {
            const cell = document.getElementById(cellName(obj.x, obj.y))
            if (!cell) return

            // Obj container
            const div = document.createElement('div')
            div.className = 'flex flex-col items-center'
            cell.appendChild(div)

            // Add Name
            const nameTag = document.createElement('p')
            nameTag.className = 'text-[0.6rem] text-gray-800 mb-1'
            nameTag.innerText = key
            div.appendChild(nameTag)

            // Add sprite to cell
            const spriteElement = document.createElement('div')
            spriteElement.className = 'h-[30px] w-[18px]'
            spriteElement.style.backgroundColor = obj.color
            div.appendChild(spriteElement)
        })
    }, [renderObjects])

    return (
        <div className='absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden'>
            <div id='game-grid' className={`grid grid-cols-[repeat(21,64px)] auto-rows-[64px] gap-0 border`}>
                {/* Grid */}
                {Array.from({ length: renderDistance * renderDistance }).map((_, index) => {
                    const center = { x: renderObjects['player'].x, y: renderObjects['player'].y }
                    const wx = (index % renderDistance) + center.x - Math.floor(renderDistance / 2)
                    const wy = Math.floor(index / renderDistance) + center.y - Math.floor(renderDistance / 2)
                    return (
                        <div key={index} className='relative bg-gray-100 border-[1px] border-gray-400'>
                            <p className='absolute bottom-0 left-0 ml-[1px] text-[0.5rem] text-gray-500'>{`${wx}, ${wy}`}</p>
                            <div
                                id={cellName(wx, wy)}
                                className='h-full flex flex-row items-center justify-around bg-green-200'
                            ></div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default Gamescreen
