import React, { Dispatch, SetStateAction, createContext, use, useEffect } from "react"

export type Settings = {
    actionButton: string
}

type settingsContextType = {
    settings: Settings
    setSettings: Dispatch<SetStateAction<Settings>>
    settingsOpen: boolean
    setSettingsOpen: Dispatch<SetStateAction<boolean>>
    setDefaultSettings: () => void
}

export const SettingsContext = createContext<settingsContextType>({
    settings: {
        actionButton: "e",
    },
    setSettings: (settings: any) => {},
    settingsOpen: false,
    setSettingsOpen: (settingsOpen: any) => {},
    setDefaultSettings: () => {},
})

export const SettingsProvider = ({ children }: { children: any }) => {
    const [settingsOpen, setSettingsOpen] = React.useState<boolean>(false)
    const [settings, setSettings] = React.useState<Settings>({
        actionButton: "e",
    })

    function saveSettingsToLocalStorage(settingsToSave: Settings) {
        localStorage.setItem("game-settings", JSON.stringify(settingsToSave))
    }

    function loadSettingsFromLocalStorage() {
        const savedSettings = localStorage.getItem("game-settings")
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings))
        }
    }

    useEffect(() => {
        loadSettingsFromLocalStorage()
    }, [])

    useEffect(() => {
        saveSettingsToLocalStorage(settings)
    }, [settings])

    function setDefaultSettings() {
        setSettings({
            actionButton: "e",
        })
    }

    return (
        <SettingsContext.Provider value={{ settings, setSettings, settingsOpen, setSettingsOpen, setDefaultSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}
