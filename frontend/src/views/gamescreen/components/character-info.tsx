import { useContext, useState } from "react"
import { CharacterContext } from "../../../contexts/character-context"
import { UserContext } from "../../../contexts/user-context"
import { GamestateContext } from "../../../contexts/gamestate-context"

const CharacterInfo = () => {
    const { gamestate } = useContext(GamestateContext)
    const { admin } = useContext(UserContext)
    const { character } = useContext(CharacterContext)

    const [debug, setDebug] = useState<boolean>(false)

    return (
        <div className="absolute top-0 left-0 m-4 p-2 pt-0 bg-white/70 rounded flex flex-col items-center z-200">
            <div className="center-col items-start!">
                <p className="font-bold text-lg">{character.name}</p>
                <p>
                    <b>HP :</b> {character.current_hp}/{character.max_hp}
                </p>
                {debug && <p className="text-sm text-gray-700">Character: {character.id}</p>}
                {debug && <p className="text-sm text-gray-700">Account: {character.account_id}</p>}
                {debug && <p className="text-sm text-gray-700">Admin: {admin ? "Yes" : "No"}</p>}
                <p className="text-sm text-gray-700">
                    <b>Pos :</b> ({gamestate.render_objects[character.id].x}, {gamestate.render_objects[character.id].y}
                    )
                </p>
            </div>
        </div>
    )
}

export default CharacterInfo
