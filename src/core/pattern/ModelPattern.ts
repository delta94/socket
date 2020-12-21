
console.log('AbstractModel')
export interface findOptions {
    limit: number,
    page: number,
    select?: [],
    match?: {},
}

export interface findResponse {
    error?: {},
    data?: [],
    paginate?: {
        nextPage?: number,
        previousPage?: number,
        totalPage: number,
        count: number,
        currentPage: number
    }
}

export interface findOneOptions {
    match: {
        _id?: string,
    },
    select?: []
}


export default interface ModelPattern {



    find(options: findOptions): Promise<findResponse>

    findOne(options: findOneOptions | string): Promise<{ error?: {}, data?: {} }>

    // findMany(): Promise<{ error?: any, data?: any }>


    // insert(): Promise<{ error?: any, insertCount?: number }>

    insertOne(): Promise<{ error?: {}, insertCount: number, result: {} }>

    insertMany(): Promise<{ error?: {}, insertCount: number, result: [] }>


    // update(): {error?: {}, updateCount: number, result: []}

    updateOne(): Promise<{ error?: {}, updateCount: number, result: {} }>

    updateMany(): Promise<{ error?: {}, updateCount: number, result: [] }>

    // delete(): Promise<{ error?: any, deleteCount?: number }>

    deleteOne(): Promise<{ error?: {}, deleteCount: number, result: {} }>

    deleteMany(): Promise<{ error?: {}, deleteCount: number, result: [] }>

    count(options: { match?: {} }): Promise<number>
}