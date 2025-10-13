import { useContext } from "react"
import { CharacterContext } from "../../../../../contexts/character-context"
import { UserContext } from "../../../../../contexts/user-context"
import { GamestateContext } from "../../../../../contexts/gamestate-context"

const Settings = ({
    showGrid,
    setShowGrid,
    adminMode,
    setAdminMode,
}: {
    showGrid: boolean
    setShowGrid: (value: boolean) => void
    adminMode: boolean
    setAdminMode: (value: boolean) => void
}) => {
    const { admin } = useContext(UserContext)
    const { logout } = useContext(GamestateContext)

    return (
        <div className="center-col items-end z-200 pointer-events-auto">
            {admin && (
                <button
                    className={
                        `min-w-28 px-4 pt-2 pb-3 rounded text-light text-sm font-bold ` +
                        (adminMode ? "bg-success" : "bg-danger")
                    }
                    onClick={() => setAdminMode(!adminMode)}
                >
                    {adminMode ? "Admin on" : "Admin off"}
                </button>
            )}
            <button
                className={
                    `min-w-28 px-4 pt-2 pb-3 mt-4 rounded text-light text-sm font-bold ` +
                    (showGrid ? "bg-success" : "bg-danger")
                }
                onClick={() => setShowGrid(!showGrid)}
            >
                {showGrid ? "Grid on" : "Grid off"}
            </button>
            <button className="min-w-28 px-4 pt-2 pb-3 mt-4 text-light bg-danger text-sm font-bold" onClick={logout}>
                Logout
            </button>
        </div>
    )
}

export default Settings
