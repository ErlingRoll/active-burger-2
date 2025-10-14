import { useContext } from "react"
import { UIContext } from "../../../../contexts/ui-context"
import Inventory from "./components/inventory"
import CharacterInfo from "./components/character-info"
import CellInfo from "./components/cell-info"
import Settings from "./components/settings"
import Log from "./components/log"
import Shop from "./components/shop"

const GameUI = ({ selectedCell }: { selectedCell: { x: number; y: number } | null }) => {
    const { showGrid, setShowGrid, adminMode, setAdminMode } = useContext(UIContext)

    return (
        <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden select-none z-200">
            <Shop />
            <Inventory />
            <div className="absolute flex items-start top-0 left-0 z-200">
                <CharacterInfo />
                <CellInfo pos={selectedCell} />
            </div>
            <div className="absolute flex flex-col items-end p-4 bottom-0 right-0 z-200 gap-4 pointer-events-none">
                <Settings
                    showGrid={showGrid}
                    setShowGrid={setShowGrid}
                    adminMode={adminMode}
                    setAdminMode={setAdminMode}
                />
                <Log />
            </div>
        </div>
    )
}

export default GameUI
