import React, { Dispatch, SetStateAction, createContext, useContext, useEffect } from "react"
import { UserContext } from "./user-context"

export type Gamestate = {}

export type ExtendedGame = Gamestate & any

export const gameWebsocketUrl = import.meta.env.VITE_GAME_WS_URL

type GamestateContextType = {
    gameCon: WebSocket | null
    setGameCon: Dispatch<SetStateAction<any>>
    gamestate: ExtendedGame | null
    setGamestate: Dispatch<SetStateAction<Gamestate | null>>
    logout: () => void
}

export const GamestateContext = createContext<GamestateContextType>({
    gameCon: null,
    setGameCon: (gameCon: any) => {},
    gamestate: null,
    setGamestate: (game: any) => {},
    logout: () => {},
})

export const GameProvider = ({ children }: { children: any }) => {
    const [gamestate, setGamestate] = React.useState<ExtendedGame | null>(null)
    const [gameCon, setGameCon] = React.useState<WebSocket | null>(null)

    const { user, setUser, setCharacter } = useContext(UserContext)

    function logout() {
        // Remove user data from localStorage
        localStorage.removeItem("discordUser")
        localStorage.removeItem("discordAccessToken")
        localStorage.removeItem("discordRefreshToken")

        // Close websocket connection
        if (gameCon) {
            gameCon.close()
            setGameCon(null)
        }
        setGamestate(null)
        setUser(null)
        setCharacter(null)
    }

    function on_event(event: string, payload: any) {
        console.log("Received WebSocket event:", event, payload)
        switch (event) {
            case "login_success":
                on_login_success(payload)
                break
            case "gamestate_update":
                setGamestate(payload)
                console.log(gamestate, gameCon, user)
                break
            default:
                console.error("Unhandled WebSocket event:", event, payload)
        }
    }

    function on_login_success(data: any) {
        console.log("Login successful:", data)
        const character = data.character
        console.log("Setting character:", character)
        setCharacter(character)
    }

    useEffect(() => {
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

            // Handle events
            on_event(messageEvent, parsedData.payload)
        }

        const loginInfo = {
            action: "login",
            payload: {
                discord_id: user?.id,
                discord_avatar: user?.avatar,
                name: user?.global_name,
            },
        }

        gameCon.send(JSON.stringify(loginInfo))
    }, [gameCon])

    return (
        <GamestateContext.Provider
            value={{
                gameCon,
                setGameCon,
                gamestate,
                setGamestate,
                logout,
            }}
        >
            {children}
        </GamestateContext.Provider>
    )
}
