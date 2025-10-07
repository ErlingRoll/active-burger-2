import { RenderObject } from "../../models/game-models"

export const goldOre = (props: Partial<RenderObject>): Partial<RenderObject> => {
    const defaultObject: Partial<RenderObject> = {
        name: "gold_ore",
        x: 0,
        y: 0,
        texture: "terrain/gold_ore",
        height: 50,
        width: 50,
        solid: true,
    }

    return { ...defaultObject, ...props }
}
