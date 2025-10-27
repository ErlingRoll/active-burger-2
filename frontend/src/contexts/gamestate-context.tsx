import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react"
import { UserContext } from "./user-context"
import { RenderObject } from "../models/object"
import { CharacterContext } from "./character-context"
import { Terrain } from "../models/terrain"
import { toast } from "react-toastify"
import { Item } from "../models/item"
import { Realm } from "../game/world"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

export type ChatMessage = {
    account_id: string
    account_name: string
    character_id: string
    character_name: string
    message: string
    timestamp: string
}

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
    damageHits: any[]
    chatMessages: ChatMessage[]
    terrain: { [pos: string]: Terrain[] }
    reconnect: () => void
    realm?: Realm
    setRealm?: Dispatch<SetStateAction<Realm | null>>
}

export const GamestateContext = createContext<GamestateContextType>({
    gameCon: null,
    setGameCon: (gameCon: any) => {},
    gamestate: null,
    setGamestate: (game: any) => {},
    logout: () => {},
    log: [],
    damageHits: [],
    chatMessages: [],
    terrain: {},
    reconnect: () => {},
    realm: null,
    setRealm: (realm: Realm) => {},
})

export const GameProvider = ({ children }: { children: any }) => {
    const [gameCon, setGameCon] = useState<WebSocket | null>(null)
    const [gamestate, setGamestate] = useState<Gamestate | null>(null)
    const [terrain, setTerrain] = useState<{ [pos: string]: Terrain[] }>({})
    const [realm, setRealm] = useState<Realm | null>(null)
    const [log, setLog] = useState<string[]>([])
    const [damageHits, setDamageHits] = useState<any[]>([])
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

    const [connecting, setConnecting] = useState<boolean>(false)
    const [connectTimeout, setConnectTimeout] = useState(null)

    const { user, setUser, setAccount } = useContext(UserContext)
    const { character, setCharacter } = useContext(CharacterContext)

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

    function notifyLoot(payload: any) {
        const items: Item[] = payload.items
        const toast_component = (
            <div className="flex flex-col items-start gap-1">
                <p className="font-bold mb-1">Loot Dropped!</p>
                {items.map((item, index: number) => (
                    <div key={index} className="flex items-center">
                        <p className="mr-2">
                            <b>{item.count}</b>x
                        </p>
                        <div className="h-8 w-8 center-col mr-1">
                            <img
                                src={textures[`/src/assets/textures/${item.texture}.png`]}
                                className="h-full object-fit"
                            />
                        </div>
                        <span className={`font-bold text-${item.rarity}`}>{item.name}</span>
                    </div>
                ))}
            </div>
        )
        toast(toast_component)
    }

    function on_event(event: string, payload: any, log: string[] | null) {
        if (log) setLog((prevLog) => [...log, ...prevLog])

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
                if (character) return setCharacter({ ...payload, direction: character.direction })
                setCharacter(payload)
                break
            case "realm_update":
                setRealm(payload.realm)
                break
            case "log":
                const error = payload.error
                if (error) {
                    toast.error(error)
                }
                break
            case "chat_update":
                setChatMessages(payload.messages)
                break
            case "loot_drop":
                notifyLoot(payload)
                break
            case "damage_hit":
                console.log("Damage hit received:", payload)
                let _damageHits = damageHits.slice(0, 100)
                setDamageHits([payload, ..._damageHits])
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
        if (!character || !gameCon) return
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
    }, [character, gameCon])

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
    }, [gameCon, connecting])

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
                damageHits,
                chatMessages,
                terrain,
                realm,
                setRealm,
            }}
        >
            {children}
        </GamestateContext.Provider>
    )
}
