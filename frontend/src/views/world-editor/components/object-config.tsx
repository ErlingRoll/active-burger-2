import { useEffect, useState } from "react"

export type ObjectConfigProps = {
    propKeys: string[]
    onChange: (newProps: { [key: string]: any }) => void
}

const ObjectConfig = ({ propKeys, onChange }: ObjectConfigProps) => {
    const [objectProps, setObjectProps] = useState<{ [key: string]: any }>({})

    return (
        <div className="flex flex-col gap-2">
            {propKeys.map((key) => (
                <div key={key} className="w-full flex items-center justify-between gap-2 font-bold">
                    <p>{key}</p>
                    <input
                        className="bg-dark border-2 border-primary rounded px-2 py-1 w-20 text-light"
                        onChange={(e) => {
                            const newProps = { ...objectProps, [key]: e.target.value }
                            setObjectProps(newProps)
                            onChange(newProps)
                        }}
                    />
                </div>
            ))}
        </div>
    )
}
export default ObjectConfig
