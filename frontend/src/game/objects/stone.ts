import { RenderObject } from "../../models/object"

export const stone = (props: Partial<RenderObject>): Partial<RenderObject> => {
    const defaultObject: Partial<RenderObject> = {
        name: "stone",
        x: 0,
        y: 0,
        texture: "terrain/stone",
        height: 50,
        width: 50,
        solid: true,
    }

    return { ...defaultObject, ...props }
}
