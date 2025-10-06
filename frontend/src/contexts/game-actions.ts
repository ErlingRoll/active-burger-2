class GameActions {
    user = null
    character = null
    gameCon: WebSocket = null

    ready() {
        const ready = Boolean(this.user && this.character && this.gameCon && this.gameCon.readyState === WebSocket.OPEN)
        if (!ready) console.error("GameActions not ready")
        return ready
    }

    move({ x, y }: { x: number; y: number }) {
        if (!this.ready()) return
        const action = {
            action: "move",
            payload: { character_id: this.character.id, x, y },
        }
        this.gameCon.send(JSON.stringify(action))
    }
}

export default GameActions
