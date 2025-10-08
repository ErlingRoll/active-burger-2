import { RenderObject } from "../models/object"

class GameActions {
    account = null
    character = null
    gameCon: WebSocket = null

    ready() {
        const ready = Boolean(
            this.account && this.character && this.gameCon && this.gameCon.readyState === WebSocket.OPEN
        )
        if (!ready)
            console.error("GameActions not ready", {
                account: this.account,
                character: this.character,
                gameCon: this.gameCon,
            })
        return ready
    }

    send(action: any) {
        action.account = this.account
        action.character = this.character
        this.gameCon.send(JSON.stringify(action))
    }

    getCharacter({ character_id }: { character_id: string }) {
        if (!this.ready()) return
        const action = {
            action: "get_character",
            payload: { character_id },
        }
        this.send(action)
    }

    move({ x, y, direction }: { x: number; y: number; direction: string }) {
        if (!this.ready()) return
        const action = {
            action: "move",
            payload: { x, y, direction },
        }
        this.send(action)
    }

    interact({ object_id }: { object_id: string }) {
        if (!this.ready()) return
        const action = {
            action: "interact",
            payload: { object_id },
        }
        this.send(action)
    }

    // --- Admin Actions ---
    placeObject({ object_id, x, y }: { object_id: string; x: number; y: number }) {
        if (!this.ready()) return
        const action = {
            action: "place_object",
            payload: { object_id, x, y },
        }
        this.send(action)
    }

    deleteObject(obj_id: string) {
        if (!this.ready()) return
        const action = {
            action: "delete_object",
            payload: { id: obj_id },
        }
        this.send(action)
    }

    giveItem({ item_id }: { item_id: string }) {
        if (!this.ready()) return
        const action = {
            action: "give_item",
            payload: { item_id },
        }
        this.send(action)
    }
}

export default GameActions
