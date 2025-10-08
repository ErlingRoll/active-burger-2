import { useContext, useEffect, useState } from "react"
import { CharacterContext } from "../../../contexts/character-context"
import { UserContext } from "../../../contexts/user-context"
import { GamestateContext } from "../../../contexts/gamestate-context"
import { RenderObject } from "../../../models/object"

const CellInfo = ({ pos }: { pos: { x: number; y: number } | null }) => {
    const { gamestate } = useContext(GamestateContext)
    const { admin } = useContext(UserContext)
    const { character } = useContext(CharacterContext)

    const [debug, setDebug] = useState<boolean>(false)
    const [objects, setObjects] = useState<RenderObject[]>([])

    useEffect(() => {
        if (!pos) return
        setObjects(gamestate.position_objects[`${pos.x}_${pos.y}`] || [])
    }, [pos])

    if (!pos || objects.length === 0) return null

    return (
        <div className="m-4 p-2 pt-0 bg-white/70 rounded flex flex-col items-start">
            <div className="center-col items-start!">
                {objects.map((obj) => (
                    <div key={obj.id}>
                        <p className="font-bold text-lg">{obj.name}</p>
                        {obj.hasOwnProperty("current_hp") && (
                            <p>
                                <b>HP :</b> {(obj as any).current_hp}/{(obj as any).max_hp}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CellInfo
