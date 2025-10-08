import "./App.css"
import { UserProvider } from "./contexts/user-context"
import { GameProvider } from "./contexts/gamestate-context"
import Game from "./Game"
import { CharacterProvider } from "./contexts/character-context"

function App() {
    return (
        <UserProvider>
            <CharacterProvider>
                <GameProvider>
                    <Game />
                </GameProvider>
            </CharacterProvider>
        </UserProvider>
    )
}

export default App
