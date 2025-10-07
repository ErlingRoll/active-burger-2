import { RenderObject } from "../../models/game-models"

export const bush = (props: Partial<RenderObject>): Partial<RenderObject> => {
    const defaultObject: Partial<RenderObject> = {
        name: "bush",
        x: 0,
        y: 0,
        texture: "terrain/bush",
        height: 50,
        width: 50,
        solid: true,
    }

    return { ...defaultObject, ...props }
}
