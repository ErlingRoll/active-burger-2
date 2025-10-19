class GameActions {
    account = null
    character = null
    gameCon: WebSocket = null
    parentContext: any = null

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
        if (!this.ready()) return
        action.account = this.account
        action.character = this.character
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

    buy({ item_id, count }: { item_id: string; count: number }) {
        const action = {
            action: "buy",
            payload: { item_id, count },
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

    // --- Admin Actions ---
    placeTerrain({ game_id, x, y, properties }: { game_id: string; properties: object; x: number; y: number }) {
        const action = {
            action: "place_terrain",
            payload: { properties: { game_id, x, y, ...properties } },
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

    placeObject({ object_id, x, y }: { object_id: string; x: number; y: number }) {
        const action = {
            action: "place_object",
            payload: { object_id, x, y },
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
