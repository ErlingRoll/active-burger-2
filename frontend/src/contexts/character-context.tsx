import React, { Dispatch, SetStateAction, createContext, use, useEffect } from "react"
import { Item } from "../models/item"
import { Character } from "../models/object"

type CharacterContextType = {
    character: Character | null
    setCharacter: Dispatch<SetStateAction<Character | null>>
}

export const CharacterContext = createContext<CharacterContextType>({
    character: null,
    setCharacter: (character: any) => {},
})

export const CharacterProvider = ({ children }: { children: any }) => {
    const [character, setCharacter] = React.useState<Character | null>(null)

    return <CharacterContext.Provider value={{ character, setCharacter }}>{children}</CharacterContext.Provider>
}
