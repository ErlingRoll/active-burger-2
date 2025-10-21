import { Fragment } from "react"
import "./App.css"
import Game from "./Game"
import CompoundProvider from "./contexts/compound-provider"

function App() {
    return (
        <CompoundProvider>
            <Fragment>
                <Game />
                <div className="absolute top-0 left-0 hidden">
                    <p className="bg-common border-common text-common">Common</p>
                    <p className="bg-uncommon border-uncommon text-uncommon">Uncommon</p>
                    <p className="bg-rare border-rare text-rare">Rare</p>
                    <p className="bg-epic border-epic text-epic">Epic</p>
                    <p className="bg-legendary border-legendary text-legendary">Legendary</p>
                </div>
            </Fragment>
        </CompoundProvider>
    )
}

export default App
