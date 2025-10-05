import "./App.css"
import { UserProvider } from "./contexts/user-context"
import { GameProvider } from "./contexts/gamestate-context"
import Game from "./Game"

function App() {
    return (
        <UserProvider>
            <GameProvider>
                <Game />
            </GameProvider>
        </UserProvider>
    )
}

export default App
