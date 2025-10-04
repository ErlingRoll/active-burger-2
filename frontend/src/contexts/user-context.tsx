import React, { Dispatch, SetStateAction, createContext } from "react"

export type User = {
    id: string
    name: string
}

export type ExtendedUser = User & any

type UserContextType = {
    user: ExtendedUser | null
    setUser: Dispatch<SetStateAction<User | null>>
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: (user: any) => {},
})

export const UserProvider = ({ children }: { children: any }) => {
    const [user, setUser] = React.useState<ExtendedUser | null>(null)
    return <UserContext.Provider value={{ user, setUser: setUser }}>{children}</UserContext.Provider>
}
