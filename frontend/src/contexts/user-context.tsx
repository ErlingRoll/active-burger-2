import React, { Dispatch, SetStateAction, createContext, use, useEffect } from "react"
import { Account } from "../models/account"

export type User = Account & any

type UserContextType = {
    user: User | null
    setUser: Dispatch<SetStateAction<User | null>>
    account: Account | null
    setAccount: Dispatch<SetStateAction<Account | null>>
    admin: boolean
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: (user: any) => {},
    account: null,
    setAccount: (account: any) => {},
    admin: false,
})

export const UserProvider = ({ children }: { children: any }) => {
    const [user, setUser] = React.useState<User | null>(null)
    const [account, setAccount] = React.useState<Account | null>(null)

    useEffect(() => {
        console.log("User updated:", user)
    }, [user])

    return (
        <UserContext.Provider value={{ user, setUser, account, setAccount, admin: account?.admin }}>
            {children}
        </UserContext.Provider>
    )
}
