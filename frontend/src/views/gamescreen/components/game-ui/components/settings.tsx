import { Fragment, useContext } from "react"
import { CharacterContext } from "../../../../../contexts/character-context"
import { UserContext } from "../../../../../contexts/user-context"
import { GamestateContext } from "../../../../../contexts/gamestate-context"
import { UIContext } from "../../../../../contexts/ui-context"

const Settings = () => {
    const { admin } = useContext(UserContext)
    const { logout } = useContext(GamestateContext)

    const { showGrid, setShowGrid, adminMode, setAdminMode } = useContext(UIContext)

    const urlPaths = window.location.pathname.split("/")
    const mainPath = urlPaths[1].toLocaleLowerCase()
    const isWorldEditor = mainPath === "edit"

    return (
        <div className="center-col items-end z-200 pointer-events-auto">
            {admin && (
                <Fragment>
                    <button
                        className={`min-w-28 px-4 pt-2 pb-3 rounded text-light text-sm font-bold bg-info`}
                        onClick={() => {
                            if (isWorldEditor) {
                                window.location.href = "/game"
                            } else {
                                window.location.href = "/edit"
                            }
                        }}
                    >
                        {isWorldEditor ? "Gamescreen" : "World Editor"}
                    </button>
                    <button
                        className={
                            `min-w-28 px-4 pt-2 mt-4 pb-3 rounded text-light text-sm font-bold ` +
                            (adminMode ? "bg-success" : "bg-danger")
                        }
                        onClick={() => setAdminMode(!adminMode)}
                    >
                        {adminMode ? "Admin on" : "Admin off"}
                    </button>
                </Fragment>
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
