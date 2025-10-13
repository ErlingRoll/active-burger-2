import { ReactNode } from "react"
import { UserProvider } from "./user-context"
import { CharacterProvider } from "./character-context"
import { GameProvider } from "./gamestate-context"
import { UIProvider } from "./ui-context"

const CompoundProvider = ({ children }: { children: ReactNode }) => {
    const providers = [UIProvider, GameProvider, CharacterProvider, UserProvider]
    return providers.reduce((acc, Provider) => <Provider>{acc}</Provider>, children)
}

export default CompoundProvider
