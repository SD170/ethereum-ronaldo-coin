

export type ownerData = {
    hashedAddress?: string,
    name?: string | null,
    note?: string | null,
    createdAt?: string
}

export type ownerDataRedis = {
    hashedAddress?: string,
    name?: string | null,
    note?: string | null,
    entityId?: string
    createdAt?: string

}
