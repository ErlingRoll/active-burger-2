import { useContext, useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import Gamescreen from "./views/gamescreen/gamescreen"
import { UserContext, UserProvider } from "./contexts/user-context"
import Login from "./views/login/login"
import { GameContext, GameProvider } from "./contexts/game-context"

function App() {
    const { user } = useContext(UserContext)
    const { gameCon, game } = useContext(GameContext)

    return (
        <UserProvider>
            <GameProvider>{!user || !gameCon || !game ? <Login /> : <Gamescreen />}</GameProvider>
        </UserProvider>
    )
}

export default App
