
import appConfig from 'config/app'
import databaseConfig from 'config/database'
import CacheAbstract from './CachePattern';
export interface findOptions {
    limit?: number,
    page?: number,
    select?: [],
    match?: any,
}

export interface findResponse {
    error?: {},
    data?: any[],
    paginate?: {
        nextPage?: number,
        previousPage?: number,
        totalPage: number,
        count: number,
        currentPage: number
    }
}

export interface findOneOptions {
    match: {},
    select?: []
}

export interface findOneResponse { error?: {}, data?: any }

export interface insertOneOptions { }

export interface intertOneResponse { error?: {}, insertCount: number, data?: any }

export interface insertManyResponse { error?: {}, insertCount: number, data?: any[] }

export interface intertOrUpdateResponse { error?: {}, insertCount: number, data?: any[] }

export interface updateOneResponse { error?: {}, updateCount: number, data?: any }

export interface updateManyResponse { error?: {}, updateCount: number, data?: any[] }

export interface deleteOneResponse { error?: {}, deleteCount: number, data?: any }

export interface deleteManyResponse { error?: {}, deleteCount: number, data?: any[] }
export default interface ModelPattern {

    find(options?: findOptions): Promise<findResponse>

    findOne(options: findOneOptions | string): Promise<findOneResponse>

    // findMany(): Promise<{ error?: any, data?: any }>


    // insert(): Promise<{ error?: any, insertCount?: number }>

    insertOne(options: {}): Promise<intertOneResponse>

    insertMany(options: []): Promise<insertManyResponse>

    insertOrUpdate(options: {} | []): Promise<intertOrUpdateResponse>


    // update(): {error?: {}, updateCount: number, result: []}

    updateOne(query: {}, data: {}): Promise<updateOneResponse>

    updateMany(data: []): Promise<updateManyResponse>

    // delete(): Promise<{ error?: any, deleteCount?: number }>

    deleteOne(query: {}): Promise<deleteOneResponse>

    deleteMany(query: []): Promise<deleteManyResponse>

    count(options: { match?: {} }): Promise<number>
}

export abstract class ModelAbstract {
    cache: CacheAbstract | null | any = null
    findOptions: any = null
    constructor() {

        if (databaseConfig.cache) {
            this.cache = databaseConfig.cache;
        } else if ('cache' in appConfig?.provider) {
            this.cache = appConfig.provider['cache']
        }
    }

    setCache(name, value) {
        if (!this.cache) return;

        // if (typeof value !== 'string') {
        //     value = JSON.stringify(value)
        // }
        this.cache?.set(name, value)
    }

    async getCache(id): Promise<boolean | {}> {
        if (!this.cache) return false;

        if (typeof id !== 'string') {
            id = id.toString()
        }
        return await this.cache?.get(id)
    }
}