export enum Realm {
    BOB_VALLEY = "bob_valley",
    ERLYVILLE = "erlyville",
}

export const realmValue = (key: string): Realm | null => {
    return Realm[key as keyof typeof Realm] || null
}
