export enum Realm {
    BOB_VALLEY = "bob_valley",
}

export const realmValue = (key: string): Realm | null => {
    return Realm[key as keyof typeof Realm] || null
}
