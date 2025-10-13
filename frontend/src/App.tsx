import "./App.css"
import Game from "./Game"
import CompoundProvider from "./contexts/compound-provider"

function App() {
    return (
        <CompoundProvider>
            <Game />
        </CompoundProvider>
    )
}

export default App
