import { useContext } from "react"
import { GamestateContext } from "../../../../../contexts/gamestate-context"

const Log = () => {
    const { log } = useContext(GamestateContext)

    return (
        <div className="bg-dark/90 text-light rounded p-2 select-text">
            <div className="flex flex-col-reverse gap-1 min-h-38 max-h-64 min-w-[25vw] w-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {log.map((msg, index) => (
                    <div key={index} className="bg-primary/30 rounded py-[1px] px-[0.3rem]">
                        {msg}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Log
