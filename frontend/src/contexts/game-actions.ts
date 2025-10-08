import { RenderObject } from "../models/game-models"

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
            payload: { character_id: this.character.id, x, y, direction },
        }
        this.send(action)
    }

    // --- Admin Actions ---
    placeObject(obj: Partial<RenderObject>) {
        if (!this.ready()) return
        const action = {
            action: "place_object",
            payload: obj,
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

    giveItem({ item_id, character_id }: { item_id: string; character_id: string }) {
        if (!this.ready()) return
        const action = {
            action: "give_item",
            payload: { item_id, character_id },
        }
        this.send(action)
    }
}

export default GameActions
