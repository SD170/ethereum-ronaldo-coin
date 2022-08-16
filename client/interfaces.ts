

export type ownerData = {
    address?: string,
    name?: string | null,
    note?: string | null,
    createdAt?: string
}

export type ownerDataRedis = {
    address?: string,
    name?: string | null,
    note?: string | null,
    entityId?: string
    createdAt?: string,

}
