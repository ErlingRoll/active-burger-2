import { RenderObject } from "../../models/game-models"

export const stone = (props: Partial<RenderObject>): Partial<RenderObject> => {
    const defaultStone: Partial<RenderObject> = {
        name: "Stone",
        x: 0,
        y: 0,
        texture: "terrain/stone",
        height: 50,
        width: 50,
        solid: true,
    }

    return { ...defaultStone, ...props }
}
