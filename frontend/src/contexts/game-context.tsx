import React, { Dispatch, SetStateAction, createContext, useContext, useEffect } from "react"
import { UserContext } from "./user-context"

export type Game = {}

export type ExtendedGame = Game & any

export const gameWebsocketUrl = import.meta.env.VITE_GAME_WS_URL

type GameContextType = {
    gameCon: WebSocket | null
    setGameCon: Dispatch<SetStateAction<any>>
    game: ExtendedGame | null
    setGame: Dispatch<SetStateAction<Game | null>>
}

export const GameContext = createContext<GameContextType>({
    gameCon: null,
    setGameCon: (gameCon: any) => {},
    game: null,
    setGame: (game: any) => {},
})

export const GameProvider = ({ children }: { children: any }) => {
    const [game, setGame] = React.useState<ExtendedGame | null>(null)
    const [gameCon, setGameCon] = React.useState<WebSocket | null>(null)

    const { user } = useContext(UserContext)

    useEffect(() => {
        console.log(gameCon)
        if (!gameCon) return
        gameCon.onerror = (error) => {
            console.error("WebSocket error:", error)
            gameCon.close()
            setGameCon(null)
        }

        gameCon.onmessage = (event: any) => {
            const data = event.data
            let parsedData = null
            try {
                parsedData = JSON.parse(data)
            } catch (e) {
                console.error("Error parsing WebSocket message:", data)
                return
            }
            const messageEvent = parsedData.event
            if (!messageEvent) {
                console.error("Received WebSocket message without event:", parsedData)
                return
            }
        }

        const loginInfo = {
            action: "login",
            userId: user?.id,
        }

        gameCon.send(JSON.stringify(loginInfo))
    }, [gameCon])

    return <GameContext.Provider value={{ gameCon, setGameCon, game, setGame }}>{children}</GameContext.Provider>
}
