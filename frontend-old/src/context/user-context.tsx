
import React, { Dispatch, SetStateAction, createContext } from "react"

export type User = {
  id: string
  name: string
}

type UserContextType = {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: (user: any) => {}
})

export const UserProvider = ({ children }: {children: any}) => {
    const [user, setUser] = React.useState<User | null>(null)
    return <UserContext.Provider value={{ user, setUser: setUser }}>{children}</UserContext.Provider>
}
