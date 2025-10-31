import React, { Dispatch, SetStateAction, createContext, use, useEffect } from "react"
import { EQUIP_SLOTS, Item } from "../models/item"
import { Character } from "../models/object"

type CharacterContextType = {
    character: Character | null
    setCharacter: Dispatch<SetStateAction<Character | null>>
    items: Item[]
    setItems: Dispatch<SetStateAction<Item[] | null>>
    itemMap: { [id: string]: Item }
    setItemMap: Dispatch<SetStateAction<{ [id: string]: Item }>>
    equipment: { [slot: string]: Item | null }
}

export const CharacterContext = createContext<CharacterContextType>({
    character: null,
    setCharacter: (character: any) => {},
    items: [],
    setItems: (items: any) => {},
    itemMap: {},
    setItemMap: (itemMap: any) => {},
    equipment: {},
})

export const CharacterProvider = ({ children }: { children: any }) => {
    const [character, setCharacter] = React.useState<Character | null>(null)
    const [items, setItems] = React.useState<Item[]>([])
    const [itemMap, setItemMap] = React.useState<{ [id: string]: Item }>({})
    const [equipment, setEquipment] = React.useState<{ [slot: string]: Item | null }>({})

    useEffect(() => {
        if (!character || !character.items) return
        const newItems = Object.values(character.items).sort((a: Item, b: Item) => {
            if (a.type < b.type) return -1
            if (a.type > b.type) return 1
            if (a.item_id < b.item_id) return -1
            if (a.item_id > b.item_id) return 1
            return 0
        })
        setItems(newItems)
        const newItemMap: { [id: string]: Item } = {}
        newItems.forEach((item) => {
            newItemMap[item.id] = item
        })
        setItemMap(newItemMap)

        const _equipment: { [slot: string]: Item | null } = {}
        EQUIP_SLOTS.forEach((slot) => (_equipment[slot] = character.equipment?.[slot]))
        setEquipment(_equipment)
    }, [character])

    return (
        <CharacterContext.Provider
            value={{
                character,
                setCharacter,
                items,
                setItems,
                itemMap,
                setItemMap,
                equipment,
            }}
        >
            {children}
        </CharacterContext.Provider>
    )
}
