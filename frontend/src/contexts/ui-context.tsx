import React, { Dispatch, SetStateAction, createContext, use, useEffect } from "react"
import { ShopItem } from "../game/shop/shop"
import { noobShop } from "../game/shop/noob_shop"

type UIContextType = {
    adminMode?: boolean
    setAdminMode?: Dispatch<SetStateAction<boolean>>
    showGrid?: boolean
    setShowGrid?: Dispatch<SetStateAction<boolean>>
    shopOpen?: boolean
    setShopOpen?: Dispatch<SetStateAction<boolean>>
    shopItems?: ShopItem[]
    setShopItems?: Dispatch<SetStateAction<ShopItem[]>>
    craftingBenchOpen?: boolean
    setCraftingBenchOpen?: Dispatch<SetStateAction<boolean>>
}

export const UIContext = createContext<UIContextType>({
    shopOpen: false,
    setShopOpen: (shopOpen: any) => {},
    shopItems: [],
    setShopItems: (shopItems: any) => {},
    adminMode: false,
    setAdminMode: (adminMode: any) => {},
    showGrid: false,
    setShowGrid: (showGrid: any) => {},
    craftingBenchOpen: false,
    setCraftingBenchOpen: (craftingBenchOpen: any) => {},
})

export const UIProvider = ({ children }: { children: any }) => {
    const [adminMode, setAdminMode] = React.useState<boolean>(false)
    const [shopOpen, setShopOpen] = React.useState<boolean>(false)
    const [shopItems, setShopItems] = React.useState<ShopItem[]>(noobShop)
    const [showGrid, setShowGrid] = React.useState<boolean>(false)
    const [craftingBenchOpen, setCraftingBenchOpen] = React.useState<boolean>(false)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase()
            if (key === "escape") {
                setShopOpen(false)
                setCraftingBenchOpen(false)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <UIContext.Provider
            value={{
                setShopOpen,
                shopOpen,
                shopItems,
                setShopItems,
                setAdminMode,
                adminMode,
                setShowGrid,
                showGrid,
                setCraftingBenchOpen,
                craftingBenchOpen,
            }}
        >
            {children}
        </UIContext.Provider>
    )
}
