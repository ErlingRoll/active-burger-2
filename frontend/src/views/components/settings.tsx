import { useContext, useState } from "react"
import { SettingsContext } from "../../contexts/settings-context"
import { FaTimes } from "react-icons/fa"

const Settings = () => {
    const [changingActionButton, setChangingActionButton] = useState<boolean>(false)

    const { settings, setSettings, settingsOpen, setSettingsOpen, setDefaultSettings } = useContext(SettingsContext)

    if (!settingsOpen) return null

    return (
        <div className="absolute top-0 left-0 w-full h-full center-col pointer-events-none">
            <div className="relative min-w-124 bg-dark text-light border-2 border-light p-8 rounded-lg pointer-events-auto z-200">
                <div className="absolute top-0 right-0">
                    <div
                        className="absolute bottom-2 right-0 bg-danger rounded p-1 cursor-pointer hover:scale-105"
                        onClick={() => setSettingsOpen(false)}
                    >
                        <FaTimes className="text-light text-3xl" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-8 text-light">Settings</h2>
                <div className="grid grid-cols-[repeat(2,minmax(0,auto))] items-center gap-2 text-lg font-bold">
                    <div className="flex items-center gap-2">
                        <p className="">Action Button:</p>
                        <p className="justify-self-start text-primary">{settings.actionButton.toUpperCase()}</p>
                    </div>
                    {!changingActionButton ? (
                        <button
                            className="justify-self-end bg-primary rounded px-4 py-2 hover:scale-105"
                            onClick={() => setChangingActionButton(true)}
                        >
                            Change
                        </button>
                    ) : (
                        <div className="justify-self-end">
                            <p className="text-sm italic">Press a key to set as action button</p>
                            <input
                                type="text"
                                autoFocus
                                className="absolute w-0 h-0 opacity-0"
                                onBlur={() => setChangingActionButton(false)}
                                onKeyDown={(e) => {
                                    setSettings({ ...settings, actionButton: e.key.toLowerCase() })
                                    setChangingActionButton(false)
                                    e.preventDefault()
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-8">
                    <button
                        className="justify-self-end font-bold bg-primary rounded px-4 py-2 hover:scale-105"
                        onClick={setDefaultSettings}
                    >
                        Default
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings
