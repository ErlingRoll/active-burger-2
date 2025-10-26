import "./App.css"
import { useContext } from "react"
import Gamescreen from "./views/gamescreen/gamescreen"
import { UserContext } from "./contexts/user-context"
import Login from "./views/login/login"
import { GamestateContext } from "./contexts/gamestate-context"
import { CharacterContext } from "./contexts/character-context"
import WorldEditor from "./views/world-editor/world-editor"

function Game() {
    const { account, admin } = useContext(UserContext)
    const { character } = useContext(CharacterContext)
    const { gameCon, gamestate, realm } = useContext(GamestateContext)

    const urlPaths = window.location.pathname.split("/")
    const mainPath = urlPaths[1].toLocaleLowerCase()

    if (!account || !character || !gameCon || !gamestate) {
        return <Login />
    }

    if (admin && mainPath === "edit") {
        return <WorldEditor />
    }

    if (!gamestate.render_objects[character.id]) {
        return (
            <div className="absolute top-0 left-0 w-full h-full center-col text-light font-bold">
                <p className="mb-2">Loading game...</p>
                <p>If this takes too long, please try refreshing the page.</p>
                <p className="mb-2">If that doesn't work contact Erling</p>
                <p>WebSocket status: {gameCon ? "Connected" : "Disconnected"}</p>
                <p>Client realm: {realm}</p>
                <p>Character realm: {character.realm}</p>
                <p>Character ID: {character.id}</p>
                <p>gamestate: {gamestate ? "Yes" : "No"}</p>
                <p>Render objects: {gamestate ? Object.keys(gamestate.render_objects).length : "null"}</p>
            </div>
        )
    }

    return <Gamescreen />
}

export default Game
