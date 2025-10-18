import React, { Dispatch, SetStateAction, createContext, use, useEffect } from "react"
import { Item } from "../models/item"
import { Character } from "../models/object"

type CharacterContextType = {
    character: Character | null
    setCharacter: Dispatch<SetStateAction<Character | null>>
    items: Item[]
    setItems: Dispatch<SetStateAction<Item[] | null>>
    itemMap: { [id: string]: Item }
    setItemMap: Dispatch<SetStateAction<{ [id: string]: Item }>>
}

export const CharacterContext = createContext<CharacterContextType>({
    character: null,
    setCharacter: (character: any) => {},
    items: [],
    setItems: (items: any) => {},
    itemMap: {},
    setItemMap: (itemMap: any) => {},
})

export const CharacterProvider = ({ children }: { children: any }) => {
    const [character, setCharacter] = React.useState<Character | null>(null)
    const [items, setItems] = React.useState<Item[]>([])
    const [itemMap, setItemMap] = React.useState<{ [id: string]: Item }>({})

    useEffect(() => {
        if (!character || !character.items) return
        console.log(character)
        const newItems = Object.values(character.items).sort((a: Item, b: Item) => a.name.localeCompare(b.name))
        setItems(newItems)
        const newItemMap: { [id: string]: Item } = {}
        newItems.forEach((item) => {
            newItemMap[item.id] = item
        })
        setItemMap(newItemMap)
    }, [character])

    return (
        <CharacterContext.Provider value={{ character, setCharacter, items, setItems, itemMap, setItemMap }}>
            {children}
        </CharacterContext.Provider>
    )
}
