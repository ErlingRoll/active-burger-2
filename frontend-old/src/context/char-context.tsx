
import React, { Dispatch, SetStateAction, createContext } from "react"

export type Char = {
  id: string
  name: string
}

type CharContextType = {
  user: Char | null
  setAdmin: Dispatch<SetStateAction<Char | null>>
}

export const CharContext = createContext<CharContextType>({
  user: null,
  setAdmin: (admin: any) => {},
})

export const CharProvider = CharContext.Provider
