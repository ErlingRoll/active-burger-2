import React, { Dispatch, SetStateAction, createContext, useContext, useEffect } from "react"
import { UserContext } from "./user-context"
import { RenderObject } from "../models/object"
import { CharacterContext } from "./character-context"
import { Terrain } from "../models/terrain"

export type Gamestate = {
    render_objects: { [key: string]: RenderObject }
    position_objects: { [key: string]: RenderObject[] }
}

export const gameWebsocketUrl = import.meta.env.VITE_GAME_WS_URL

export type LocalAction = "open_shop"

type GamestateContextType = {
    gameCon: WebSocket | null
    setGameCon: Dispatch<SetStateAction<any>>
    gamestate: Gamestate | null
    setGamestate: Dispatch<SetStateAction<Gamestate | null>>
    logout: () => void
    log: string[]
    setLog: Dispatch<SetStateAction<string[]>>
    terrain: { [pos: string]: Terrain[] }
    reconnect: () => void
}

export const GamestateContext = createContext<GamestateContextType>({
    gameCon: null,
    setGameCon: (gameCon: any) => {},
    gamestate: null,
    setGamestate: (game: any) => {},
    logout: () => {},
    log: [],
    setLog: (log: any) => {},
    terrain: {},
    reconnect: () => {},
})

export const GameProvider = ({ children }: { children: any }) => {
    const [gameCon, setGameCon] = React.useState<WebSocket | null>(null)
    const [gamestate, setGamestate] = React.useState<Gamestate | null>(null)
    const [terrain, setTerrain] = React.useState<{ [pos: string]: Terrain[] }>({})
    const [log, setLog] = React.useState<string[]>([])

    const [connecting, setConnecting] = React.useState<boolean>(false)
    const [connectTimeout, setConnectTimeout] = React.useState(null)

    const { user, setUser, setAccount } = useContext(UserContext)
    const { setCharacter } = useContext(CharacterContext)

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
        setCharacter(null)
        setAccount(null)
        setUser(null)
    }

    function on_event(event: string, payload: any, log: string[] | null) {
        // console.log("Received WebSocket event:", event, payload, log)

        if (log) {
            setLog((prevLog) => [...log, ...prevLog])
        }

        switch (event) {
            case "login_success":
                on_login_success(payload)
                break
            case "gamestate_update":
                setGamestate(payload)
                break
            case "terrain_update":
                setTerrain(payload)
                break
            case "character_update":
                setCharacter(payload)
                break
            case "log":
                break
            default:
                console.error("Unhandled WebSocket event:", event, payload, log)
        }
    }

    function on_login_success(data: any) {
        const account = data.account
        const character = data.character
        setAccount(account)
        setCharacter(character)

        const loginMessage = `Logged in as ${account.name} (${character ? character.name : "no character"})`
        setLog((prevLog) => [loginMessage, ...prevLog])
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
            on_event(messageEvent, parsedData.payload, parsedData.log)
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

    function connect() {
        console.log("Connecting to WebSocket at", gameWebsocketUrl)

        // Stop if already connected
        if (gameCon) {
            console.log("WebSocket already connected")
            return
        }

        const ws = new WebSocket(gameWebsocketUrl)
        ws.onopen = () => {
            console.log("WebSocket connection established")
            setGameCon(ws)
        }
    }

    useEffect(() => {
        if (!user) return
        // console.log("User state updated:", user)
        connect()
    }, [user])

    return (
        <GamestateContext.Provider
            value={{
                gameCon,
                setGameCon,
                gamestate,
                setGamestate,
                reconnect: connect,
                logout,
                log,
                setLog,
                terrain,
            }}
        >
            {children}
        </GamestateContext.Provider>
    )
}
