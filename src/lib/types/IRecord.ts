export interface IRecord {
    _id: string,
    userId: string,
    action: string,
    input: string,
    result: string,
    timestamp: Date
}

export interface ICreateRecord {
    userId: string,
    action: string,
    input: string,
    result: string
}