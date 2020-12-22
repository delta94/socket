


export default interface CachePattern {
    get(key: string): Promise<any>

    set(key: string, value: string): void
}