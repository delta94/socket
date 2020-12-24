


// export default interface CachePattern {
//     get(key: string): Promise<any>

//     set(key: string, value: string): void
// }

export default abstract class AbstractCache {

    abstract rememeber(key: string, callback: () => any): Promise<any>

    abstract forget(key?: string)

    abstract get(key: string): Promise<any>

    abstract set(key: string, value: string): void
}