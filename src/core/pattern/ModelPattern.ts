
import appConfig from 'config/app'
import databaseConfig from 'config/database'
// import { prepareField } from 'core/helper/model';
import validate from 'core/validate';
import { DoBeforeFind } from 'hooks/modelhook';
import { EnumType } from 'typescript';
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

export interface Field {
    type?: number | boolean | string | any | [],
    default?: any,
    required?: true,
    relation?: string,
    struct?: any,
    multi?: true,
    validate?: any,
    pattern?: any,
    enum?: any[],
    unique?: true,
    index?: true
}

interface PrivateField {
    type: EnumField,
    default?: any,
    required?: true,
    relation?: string,
    struct?: any,
    multi?: true,
    validate?: any,
    pattern?: any,
    enum?: any[],
    unique?: true,
    index?: true,
    resolve: Function
}

export interface ModelInterface {
    findOne(options: findOneOptions | string): Promise<findOneResponse>

    findMany(options?: findOptions): Promise<findResponse>


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

export interface FieldsInput { [key: string]: any[] | Field | Function }

let _: any = {}
export default abstract class ModelAbstract {

    protected primaryKey: {
        name: string,
        type: Function
    } = {
            name: "id",
            type: Number
        }

    protected defaultColumn: FieldsInput = {
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    }

    protected cache: CacheAbstract | null | any = null
    protected findOptions: any = null
    protected _fields: { [key: string]: PrivateField } = {}
    protected idValue: Function = String


    name: string | null = null

    static getModel(name: string): ModelInterface | null {
        if (name in _.instance) {
            return _.instance[name];
        }

        return null;
    }

    constructor(name: string, fields: FieldsInput) {
        this.name = name
        this._setupCache();
        this._setupField(fields);

        _[this.name] = this;

        console.log(this._fields)
    }



    setCache(name, value) {
        if (!this.cache) return;

        this.cache?.set(name, value)
    }

    async getCache(id): Promise<boolean | {}> {
        if (!this.cache) return false;

        if (typeof id !== 'string') {
            id = id.toString()
        }
        return await this.cache?.get(id)
    }


    protected async _findOne(options: findOneOptions | string): Promise<{ next: boolean, data?: any }> {
        let { match } = options;
        if ('_id' in match) {
            let data = await this.getCache(match['_id']);
            if (data) return { data, next: false };
        }

        return { next: true }
    }

    protected async _findMany(options?: findOptions | any): Promise<{ page?: number, limit?: number, match?: any, data?: any, next?: boolean }> {
        let { page, limit, match } = options;

        !page && (page = 1)
        !limit && (limit = 15)

        page <= 0 && (page = 1);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let { data, next } = await DoBeforeFind();
        if (!next) {
            return { data }
        }

        return { next: true }
    }


    protected async _checkValidateOne(data: any): Promise<{ error?: any, data?: any }> {

        // let rules = {}
        // let message = {}

        let errors = {}
        for (let i in this._fields) {
            let field = this._fields[i];
            // rules[i] = {}
            // message[i] = {}
            // if (field.required) {
            //     rules[i].required = true
            //     message[i].required = field?.validate?.requried || `${i} field is require`
            // }

            // if (field.pattern) {
            //     rules[i].pattern = field.pattern
            //     message[i].pattern = field?.validate?.pattern || `${i} field is not like pattern`;
            // }

            // if (field.enum) {
            //     rules[i].enum = field.enum
            //     message[i].enum = field?.validate?.enum || `${i} field is in [${field.enum.join()}]`
            // }

            let { error, value } = field.resolve(data[i])
            if (error) {
                errors[i] = error;
            } else {
                data[i] = value;
            }
            // if(!data[i] && field.default){
            //     data[i] = field.default;
            // }

            // if(field.type === EnumField.Relation){
            //     if(field.multi){
            //         if(!Array.isArray(data[i])){
            //             data[i] = [data[i]]
            //         }
            //     }
            // }
        }

        if (Object.keys(errors).length > 0) {
            return { error: errors }
        }

        return { data }

        // return validate(data, rules, message)
    }

    abstract insertOrUpdate(options: {} | []): Promise<intertOrUpdateResponse>



    abstract updateOne(query: {}, data: {}): Promise<updateOneResponse>

    abstract updateMany(data: []): Promise<updateManyResponse>


    abstract deleteOne(query: {}): Promise<deleteOneResponse>

    abstract deleteMany(query: []): Promise<deleteManyResponse>

    abstract count(options: { match?: {} }): Promise<number>

    private _prepareData() {
        // this._fields = prepareField({
        //     [this.primaryKey.name]: this.primaryKey.type,
        //     ...this.defaultColumn
        // })
    }

    private _setupCache() {
        if (databaseConfig.cache) {
            this.cache = databaseConfig.cache;
        } else if ('cache' in appConfig?.provider) {
            this.cache = appConfig.provider['cache']
        }
    }

    private _setupField(fields: FieldsInput) {


        for (let i in fields) {

            let field = fields[i];
            if (typeof field === 'function') {
                this._fields[i] = {
                    type: EnumField.Function,
                    resolve: field
                }
            } else if (Array.isArray(field)) {
                let type: any = {
                    type: EnumField.Array,
                    resolve: ArrayResolve
                }
                if (field[0]) {
                    type.struct = field[0]
                }

                this._fields[i] = type;

            } else if (field.relation) {
                this._fields[i] = {
                    ...field,
                    type: EnumField.Relation,
                    resolve: RelationResolve
                }
            } else if (field.type) {

                this._fields[i] = {
                    ...field,
                    type: EnumField.Function,
                    resolve: field.type
                }
            } else if (Array.isArray(field.enum)) {
                this._fields[i] = {
                    ...field,
                    type: EnumField.Enum,
                    resolve: EnumResolve
                }
            } else {
                this._fields[i] = {
                    type: EnumField.Struct,
                    resolve: StructResolve,
                    struct: field
                }
            }
        }
    }

}


enum EnumField {
    Function = 'FUNCTION',
    Struct = 'STRUCT',
    Array = 'ARRAY',
    Relation = 'RELATION',
    Enum = 'ENUM'
}

let EnumResolve = function (this: any, data): { error?: any, data?: any } {
    if (!data && this.default) data = this.default;
    if (this.enum.include(data)) return { data };
    return { error: this?.validate?.default || `field required include [${this.enum.join()}]` }
}

let StructResolve = function (this: any, data): { error?: any, data?: any } {
    if (typeof data !== 'object') return { error: 'Field required is object' };
    for (let i in this.struct) {
        if (typeof this.struct === 'function') {
            data[i] = this.struct(data[i])
        }
    }
    return { data }

}

let RelationResolve = function (this: any, data): { error?: any, data?: any } {

    if (this.multi) {
        if (!Array.isArray(data) && data) data = [data];
        else {
            data = []
        }
    }

    return { data }
}

let ArrayResolve = function (this: any, data): { error?: any, data?: any } {

    if (!Array.isArray(data)) {
        data = [data]
    }
    data = data.map(e => {
        if (this.struct) {
            if (typeof this.struct === 'function') {
                return this.struct(e)
            } else {
                let type = {
                    resolve: StructResolve,
                    struct: this.struct
                }

                let { data, error } = type.resolve(e);
                if (!error) return data;
            }
        }
    })

    data = data.filter(e => e !== undefined);

    return { data };

}