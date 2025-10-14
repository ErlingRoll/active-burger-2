import React, { Dispatch, SetStateAction, createContext, use, useEffect } from "react"

type UIContextType = {
    adminMode?: boolean
    setAdminMode?: Dispatch<SetStateAction<boolean>>
    shopOpen?: boolean
    setShopOpen?: Dispatch<SetStateAction<boolean>>
    showGrid?: boolean
    setShowGrid?: Dispatch<SetStateAction<boolean>>
}

export const UIContext = createContext<UIContextType>({
    shopOpen: false,
    setShopOpen: (shopOpen: any) => {},
    adminMode: false,
    setAdminMode: (adminMode: any) => {},
    showGrid: false,
    setShowGrid: (showGrid: any) => {},
})

export const UIProvider = ({ children }: { children: any }) => {
    const [shopOpen, setShopOpen] = React.useState<boolean>(false)
    const [adminMode, setAdminMode] = React.useState<boolean>(false)
    const [showGrid, setShowGrid] = React.useState<boolean>(false)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase()
            if (key === "escape") {
                setShopOpen(false)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <UIContext.Provider value={{ setShopOpen, shopOpen, setAdminMode, adminMode, setShowGrid, showGrid }}>
            {children}
        </UIContext.Provider>
    )
}
