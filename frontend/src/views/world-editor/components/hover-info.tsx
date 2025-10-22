import { useEffect } from "react"
import { Terrain } from "../../../models/terrain"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

type HoverInfoProps = {
    terrains: Terrain[]
}

const HoverInfo = ({ terrains }: HoverInfoProps) => {
    if (terrains.length === 0) return null

    useEffect(() => {
        console.log("HoverInfo terrains:", terrains)
    }, [terrains])

    return (
        <div className="absolute top-0 right-0 m-4 p-2 bg-dark/90 text-light rounded">
            <div className="flex flex-col items-center gap-1">
                {terrains.map((terrain, index) => (
                    <div
                        key={index}
                        className="w-full grid grid-cols-[repeat(3,minmax(0,auto))] items-center justify-start gap-1"
                    >
                        <div className="w-8 h-8 mr-2 center-col">
                            <img src={textures[`/src/assets/textures/${terrain.texture}.png`]} />
                        </div>
                        <p className="font-bold">{terrain.z}:</p>
                        <p className="font-bold">{terrain.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HoverInfo
