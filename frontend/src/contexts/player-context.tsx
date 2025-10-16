import { createContext, useContext, useEffect, useRef } from "react"
import { RenderObject } from "../models/object"
import { UIContext } from "./ui-context"
import GameActions from "./game-actions"
import { UserContext } from "./user-context"
import { GamestateContext } from "./gamestate-context"
import { CharacterContext } from "./character-context"

type PlayerContextType = {
    gameActions?: GameActions
    localInteract: (object: RenderObject) => void
}

export const PlayerContext = createContext<PlayerContextType>({
    gameActions: null,
    localInteract: (object: RenderObject) => {},
})

export const PlayerProvider = ({ children }: { children: any }) => {
    const { account } = useContext(UserContext)
    const { character } = useContext(CharacterContext)
    const { gameCon } = useContext(GamestateContext)
    const { setShopOpen } = useContext(UIContext)

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

    return (
        <PlayerContext.Provider value={{ gameActions: gameActions.current, localInteract }}>
            {children}
        </PlayerContext.Provider>
    )
}
