import { Realm } from "../game/world"

class GameActions {
    account = null
    character = null
    gameCon: WebSocket = null
    parentContext: any = null
    reconnect: () => void = null

    constructor(reconnect: () => void) {
        this.reconnect = reconnect
    }

    ready(action: any, account?: any, character?: any) {
        const hasIdentity = Boolean(account && character) || Boolean(this.account && this.character)
        const ready = Boolean(hasIdentity && this.gameCon && this.gameCon.readyState === WebSocket.OPEN)
        if (!ready) {
            console.error("GameActions not ready: " + action.action || "unknown", {
                identity: hasIdentity,
                gameCon: this.gameCon,
                readyState: this.gameCon ? this.gameCon.readyState : "no connection",
            })
            this.reconnect()
        }
        return ready
    }

    send(action: any, account?: any, character?: any) {
        if (!this.ready(action, account, character)) return
        action.account = account || this.account
        action.character = character || this.character
        this.gameCon.send(JSON.stringify(action))
    }

    getCharacter({ character_id }: { character_id: string }) {
        const action = {
            action: "get_character",
            payload: { character_id },
        }
        this.send(action)
    }

    move({ x, y, direction }: { x: number; y: number; direction: string }) {
        const action = {
            action: "move",
            payload: { x, y, direction },
        }
        this.send(action)
    }

    respawn() {
        const action = {
            action: "respawn",
            payload: {},
        }
        this.send(action)
    }

    useItem({ id }: { id: string }) {
        const action = {
            action: "use_item",
            payload: { id },
        }
        this.send(action)
    }

    interact({ object_id }: { object_id: string }) {
        if (!object_id) return
        const action = {
            action: "interact",
            payload: { object_id },
        }
        this.send(action)
    }

    sell({ item_id, count }: { item_id: string; count: number }) {
        const action = {
            action: "sell",
            payload: { item_id, count },
        }
        this.send(action)
    }

    buy({ item_id, price, count }: { item_id: string; price: number; count: number }) {
        const action = {
            action: "buy",
            payload: { item_id, price, count },
        }
        this.send(action)
    }

    unequipItem({ slot }: { slot: string }) {
        const action = {
            action: "unequip_item",
            payload: { slot },
        }
        this.send(action)
    }

    applyCurrency({ currency_id, equipment_id }: { currency_id: string; equipment_id: string }) {
        const action = {
            action: "apply_currency",
            payload: { currency_id, equipment_id },
        }
        this.send(action)
    }

    sendChatMessage({ message }: { message: string }) {
        const action = {
            action: "send_chat_message",
            payload: { message },
        }
        this.send(action)
    }

    // --- Admin Actions ---
    setRealm({ realm, account, character }: { realm: Realm; account?: any; character?: any }) {
        const action = {
            action: "set_realm",
            payload: { realm },
        }
        this.send(action, account, character)
    }

    placeTerrain({
        game_id,
        properties,
        x,
        y,
        z,
        realm,
    }: {
        game_id: string
        properties: object
        x: number
        y: number
        z: number
        realm: Realm
    }) {
        const action = {
            action: "place_terrain",
            payload: { properties: { game_id, x, y, z, ...properties, realm } },
        }
        this.send(action)
    }

    deleteTerrain(terrain_id: string) {
        const action = {
            action: "delete_terrain",
            payload: { id: terrain_id },
        }
        this.send(action)
    }

    placeObject({
        object_id,
        properties,
        x,
        y,
        realm,
    }: {
        object_id: string
        properties: object
        x: number
        y: number
        realm: Realm
    }) {
        const action = {
            action: "place_object",
            payload: { properties: { object_id, x, y, ...properties, realm } },
        }
        this.send(action)
    }

    deleteObject(obj_id: string) {
        const action = {
            action: "delete_object",
            payload: { id: obj_id },
        }
        this.send(action)
    }

    giveItem({ item_id }: { item_id: string }) {
        const action = {
            action: "give_item",
            payload: { item_id },
        }
        this.send(action)
    }
}

export default GameActions
