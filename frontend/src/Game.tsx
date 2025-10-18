import "./App.css"
import { useContext, useEffect } from "react"
import Gamescreen from "./views/gamescreen/gamescreen"
import { UserContext } from "./contexts/user-context"
import Login from "./views/login/login"
import { GamestateContext } from "./contexts/gamestate-context"
import { CharacterContext } from "./contexts/character-context"
import WorldEditor from "./views/world-editor"

function Game() {
    const { account, admin } = useContext(UserContext)
    const { character } = useContext(CharacterContext)
    const { gameCon, gamestate } = useContext(GamestateContext)

    const urlPaths = window.location.pathname.split("/")
    const mainPath = urlPaths[1].toLocaleLowerCase()

    if (!account || !character || !gameCon || !gamestate) {
        return <Login />
    }

    if (admin && mainPath === "edit") {
        return <WorldEditor />
    }

    return <Gamescreen />
}

export default Game
