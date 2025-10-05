import "./App.css"
import { useContext, useEffect } from "react"
import Gamescreen from "./views/gamescreen/gamescreen"
import { UserContext } from "./contexts/user-context"
import Login from "./views/login/login"
import { GamestateContext } from "./contexts/gamestate-context"

function Game() {
    const { user, character } = useContext(UserContext)
    const { gameCon, gamestate } = useContext(GamestateContext)

    useEffect(() => {
        console.log("App state:", { user, character, gameCon, gamestate })
    }, [user, gameCon, gamestate])

    return <div>{!user || !character || !gameCon || !gamestate ? <Login /> : <Gamescreen />}</div>
}

export default Game
