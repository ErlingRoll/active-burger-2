import { createContext, useContext, useEffect, useRef, useState } from "react"
import { RenderObject } from "../models/object"
import { UIContext } from "./ui-context"
import GameActions from "./game-actions"
import { UserContext } from "./user-context"
import { GamestateContext } from "./gamestate-context"
import { CharacterContext } from "./character-context"
import { Realm } from "../game/world"

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
    setSelectedCell: (cell: { x: number; y: number }) => {},
})

export const PlayerProvider = ({ children }: { children: any }) => {
    const { account } = useContext(UserContext)
    const { character, setCharacter } = useContext(CharacterContext)
    const { gameCon, gamestate, terrain, reconnect, realm } = useContext(GamestateContext)
    const { shopOpen, setShopOpen, craftingBenchOpen, setCraftingBenchOpen } = useContext(UIContext)

    const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null)

    const [lastAction, setLastAction] = useState<{ action: string; timestamp: number }>({
        action: "",
        timestamp: Date.now(),
    })
    const [nextActionAllowed, setNextActionAllowed] = useState<number>(Date.now())
    const [lastMoveRepeat, setLastMoveRepeat] = useState<number>(Date.now())
    const moveRepeatDelay = 100 // milliseconds

    // Store gameactions in a ref so it doesn't get recreated on every render
    const gameActions = useRef(new GameActions(reconnect))

    useEffect(() => {
        if (realm) {
            gameActions.current.setRealm({ realm })
        }
    }, [realm])

    function localInteract(object: RenderObject) {
        switch (object.object_id) {
            case "crafting_bench":
                setCraftingBenchOpen(true)
                break
            case "shopkeeper":
                setShopOpen(true)
                break
        }
    }

    function getSelectedCell() {
        if (!character || !gamestate || !gamestate.render_objects) return
        const x = character.x
        const y = character.y

        const newPosMap = {
            up: { x: x, y: y + 1 },
            down: { x: x, y: y - 1 },
            left: { x: x - 1, y: y },
            right: { x: x + 1, y: y },
        }

        const newPos = newPosMap[character.direction]
        setSelectedCell(newPos)
    }

    function checkSolidTile({ x, y, realm }: { x: number; y: number; realm: Realm }) {
        const posKey = x + "_" + y
        let solid = false

        const terrains = terrain[posKey] || []
        for (const t of terrains) {
            if (t.solid && t.realm === realm) {
                solid = true
                break
            }
        }

        const objects = gamestate.position_objects[posKey] || []
        for (const o of objects) {
            if (o.solid && o.realm === realm) {
                solid = true
                break
            }
        }

        return solid
    }

    function move({ direction }: { direction: "up" | "down" | "left" | "right" }) {
        if (!character) return
        character.direction = direction

        switch (direction) {
            case "up":
                if (checkSolidTile({ x: character.x, y: character.y + 1, realm: character.realm })) return
                gameActions.current.move({ x: character.x, y: character.y + 1, direction: "up" })
                character.y += 1
                break
            case "down":
                if (checkSolidTile({ x: character.x, y: character.y - 1, realm: character.realm })) return
                gameActions.current.move({ x: character.x, y: character.y - 1, direction: "down" })
                character.y -= 1
                break
            case "left":
                if (checkSolidTile({ x: character.x - 1, y: character.y, realm: character.realm })) return
                gameActions.current.move({ x: character.x - 1, y: character.y, direction: "left" })
                character.x -= 1
                break
            case "right":
                if (checkSolidTile({ x: character.x + 1, y: character.y, realm: character.realm })) return
                gameActions.current.move({ x: character.x + 1, y: character.y, direction: "right" })
                character.x += 1
                break
        }
        setCharacter({ ...character })
    }

    useEffect(() => {
        getSelectedCell()
    }, [character])

    useEffect(() => {
        gameActions.current.account = account
        gameActions.current.character = character
        gameActions.current.gameCon = gameCon
    }, [account, character, gameCon])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (document.activeElement.tagName === "INPUT") return
            if (shopOpen || craftingBenchOpen) {
                setShopOpen(false)
                setCraftingBenchOpen(false)
            }
            if (!gamestate || !character) return
            const urlPaths = window.location.pathname.split("/")
            const mainPath = urlPaths[1].toLocaleLowerCase()
            if (mainPath === "edit") return
            if (event.repeat) {
                if (Date.now() - lastMoveRepeat < moveRepeatDelay) return
            }
            setLastMoveRepeat(Date.now())

            const input = event.key.toLowerCase()
            let gameInput = true
            switch (input) {
                case "arrowup":
                case "w":
                    move({ direction: "up" })
                    break
                case "arrowdown":
                case "s":
                    move({ direction: "down" })
                    break
                case "arrowleft":
                case "a":
                    move({ direction: "left" })
                    break
                case "arrowright":
                case "d":
                    move({ direction: "right" })
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
    }, [gamestate, character, gameActions, selectedCell, lastMoveRepeat, shopOpen, craftingBenchOpen])

    return (
        <PlayerContext.Provider
            value={{ gameActions: gameActions.current, localInteract, selectedCell, setSelectedCell }}
        >
            {children}
        </PlayerContext.Provider>
    )
}
