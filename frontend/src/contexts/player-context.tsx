import { createContext, useContext, useEffect, useRef, useState } from "react"
import { RenderObject } from "../models/object"
import { UIContext } from "./ui-context"
import GameActions from "./game-actions"
import { UserContext } from "./user-context"
import { GamestateContext } from "./gamestate-context"
import { CharacterContext } from "./character-context"

type PlayerContextType = {
    gameActions?: GameActions
    localInteract: (object: RenderObject) => void
    selectedCell?: { x: number; y: number } | null
    setSelectedCell?: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
}

export const PlayerContext = createContext<PlayerContextType>({
    gameActions: null,
    localInteract: (object: RenderObject) => {},
    selectedCell: null,
    setSelectedCell: (cell: any) => {},
})

export const PlayerProvider = ({ children }: { children: any }) => {
    const { account } = useContext(UserContext)
    const { character } = useContext(CharacterContext)
    const { gameCon, gamestate } = useContext(GamestateContext)
    const { setShopOpen } = useContext(UIContext)

    const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null)
    const [lastMoveRepeat, setLastMoveRepeat] = useState<number>(Date.now())
    const moveRepeatDelay = 100 // milliseconds

    // Store gameactions in a ref so it doesn't get recreated on every render
    const gameActions = useRef(new GameActions())

    function localInteract(object: RenderObject) {
        if (object.object_id === "shopkeeper") {
            setShopOpen(true)
        }
    }

    useEffect(() => {
        gameActions.current.account = account
        gameActions.current.character = character
        gameActions.current.gameCon = gameCon
    }, [account, character, gameCon])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!gamestate || !character) return
            const urlPaths = window.location.pathname.split("/")
            const mainPath = urlPaths[1].toLocaleLowerCase()
            if (mainPath === "edit") return
            if (event.repeat) {
                if (Date.now() - lastMoveRepeat < moveRepeatDelay) return
            }
            setLastMoveRepeat(Date.now())

            const player = gamestate.render_objects[character.id]
            const input = event.key.toLowerCase()
            let gameInput = true
            switch (input) {
                case "arrowup":
                case "w":
                    gameActions.current.move({ x: player.x, y: player.y + 1, direction: "up" })
                    break
                case "arrowdown":
                case "s":
                    gameActions.current.move({ x: player.x, y: player.y - 1, direction: "down" })
                    break
                case "arrowleft":
                case "a":
                    gameActions.current.move({ x: player.x - 1, y: player.y, direction: "left" })
                    break
                case "arrowright":
                case "d":
                    gameActions.current.move({ x: player.x + 1, y: player.y, direction: "right" })
                    break
                case "e":
                    if (!selectedCell) break
                    const object = gamestate.position_objects[selectedCell.x + "_" + selectedCell.y]?.[0]
                    if (!object) break
                    localInteract(object)
                    gameActions.current.interact({ object_id: object.id })
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
    }, [gamestate, character, gameActions, selectedCell, lastMoveRepeat])

    return (
        <PlayerContext.Provider value={{ gameActions: gameActions.current, localInteract, setSelectedCell }}>
            {children}
        </PlayerContext.Provider>
    )
}
