import { useContext, useState } from "react"
import { CharacterContext } from "../../../../../contexts/character-context"
import { UserContext } from "../../../../../contexts/user-context"
import { GamestateContext } from "../../../../../contexts/gamestate-context"
import { FaHeart } from "react-icons/fa"

const CharacterInfo = () => {
    const { gamestate } = useContext(GamestateContext)
    const { admin } = useContext(UserContext)
    const { character } = useContext(CharacterContext)

    const [debug, setDebug] = useState<boolean>(false)

    return (
        <div className="m-4 p-2 pt-0 bg-dark/90 text-light rounded flex flex-col items-center">
            <div className="center-col items-start!">
                <p className="font-bold text-lg">{character.name}</p>
                <div className="flex items-center">
                    <FaHeart color="red" className="mr-2" /> {character.current_hp} / {character.max_hp}
                </div>
                {debug && <p className="">Character: {character.id}</p>}
                {debug && <p className="">Account: {character.account_id}</p>}
                {debug && <p className="">Admin: {admin ? "Yes" : "No"}</p>}
                <p className="">
                    <b>Pos :</b> ({gamestate.render_objects[character.id].x}, {gamestate.render_objects[character.id].y}
                    )
                </p>
            </div>
        </div>
    )
}

export default CharacterInfo
