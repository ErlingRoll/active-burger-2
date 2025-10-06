import React, { Dispatch, SetStateAction, createContext } from "react"

export type User = {
    id: string
    name: string
}

export type Character = {
    id: string
    name: string
    account_id: string
}

export type ExtendedUser = User & any

type UserContextType = {
    user: ExtendedUser | null
    setUser: Dispatch<SetStateAction<User | null>>
    character: Character | null
    setCharacter: Dispatch<SetStateAction<Character | null>>
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: (user: any) => {},
    character: null,
    setCharacter: (character: any) => {},
})

export const UserProvider = ({ children }: { children: any }) => {
    const [user, setUser] = React.useState<ExtendedUser | null>(null)
    const [character, setCharacter] = React.useState<Character | null>(null)
    return <UserContext.Provider value={{ user, setUser, character, setCharacter }}>{children}</UserContext.Provider>
}
