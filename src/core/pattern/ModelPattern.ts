
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
    sort?: any
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
    index?: (true | string)
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
    index?: (true | string),

    resolve: FieldResolve,
    function?: Function
}

interface FieldResolve {
    (data): { error?: any, value?: any }
}

export interface ModelInterface {
    findOne(options: findOneOptions | string): Promise<findOneResponse>

    findMany(options?: findOptions): Promise<findResponse>


    // insert(): Promise<{ error?: any, insertCount?: number }>

    insertOne(options: {}): Promise<intertOneResponse>

    insertMany(options: []): Promise<insertManyResponse>

    insertOrUpdate(options: {} | [], match: any): Promise<intertOrUpdateResponse>


    // update(): {error?: {}, updateCount: number, result: []}

    updateOne(query: {}, data: {}): Promise<updateOneResponse>

    updateMany(data: []): Promise<updateManyResponse>

    // delete(): Promise<{ error?: any, deleteCount?: number }>

    deleteOne(query: {}): Promise<deleteOneResponse>

    deleteMany(query: []): Promise<deleteManyResponse>

    count(options: { match?: {} }): Promise<number>



    // public function


    getQueryFilter(query: any): any
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

        // console.log(this._fields)
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

    protected async _findMany(options?: findOptions | any): Promise<{ page?: number, limit?: number, match?: any, data?: any, next?: boolean, sort?: any }> {
        let { page, limit, match, sort } = options;

        !sort && (sort = { [this.primaryKey.name]: -1 })

        !page && (page = 1)
        !limit && (limit = 15)

        if (typeof page === 'string') page = parseInt(page)

        page <= 0 && (page = 1);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let { data, next } = await DoBeforeFind();
        if (!next) {
            return { data }
        }

        // if (!match) match = {}

        return { next: true, page, limit, match, sort }
    }


    protected async _checkValidateOne(data: any): Promise<{ error?: any, data?: any }> {

        let rules = {}
        let message = {}
        let errors = {}
        for (let i in this._fields) {
            let field = this._fields[i];
            rules[i] = {}
            message[i] = {}
            if (field.required) {
                rules[i].required = true
                message[i].required = field?.validate?.requried || `${i} field is require`
            }

            if (field.pattern) {
                rules[i].pattern = field.pattern
                message[i].pattern = field?.validate?.pattern || `${i} field is not like pattern`;
            }

            let { error, value } = field.resolve(data[i])
            if (error) {
                errors[i] = error;
            } else {
                data[i] = value;
            }
            if (!data[i] && field.default) {
                data[i] = field.default;
            }
        }


        let { error: error2, data: data2 } = validate(data, rules, message);

        errors = Object.assign(error2 || {}, errors)
        data = Object.assign(data, data2 || {})

        if (Object.keys(errors).length > 0) {
            return { error: errors }
        }

        return { data }
    }

    abstract insertOrUpdate(options: {} | [], match: any): Promise<intertOrUpdateResponse>



    abstract updateOne(query: {}, data: {}): Promise<updateOneResponse>

    abstract updateMany(data: []): Promise<updateManyResponse>


    abstract deleteOne(query: {}): Promise<deleteOneResponse>

    abstract deleteMany(query: []): Promise<deleteManyResponse>

    abstract count(options: { match?: {} }): Promise<number>


    public getQueryFilter(query: any): any {
        let obj = {};
        for (let i in query) {
            if (i in this._fields) {
                if (['number', 'Number'].includes(this._fields[i]?.function?.name || '')) {
                    obj[i] = parseInt(query[i])

                } else {
                    obj[i] = query[i]
                }
            }
        }

        return obj;
    }

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
                    function: field,
                    resolve: FunctionResolve
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
                    function: field.type,
                    resolve: FunctionResolve
                }
            } else if (Array.isArray(field.enum)) {
                this._fields[i] = {
                    ...field,
                    type: EnumField.Enum,
                    resolve: EnumResolve
                }
            } else {
                let addObj: any = {}
                if (field.index) {
                    addObj.index = field.index;
                    delete field.index;
                }

                if (field.unique) {
                    addObj.unique = field.unique;
                    delete field.unique;
                }

                this._fields[i] = {
                    ...addObj,
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

let FunctionResolve: FieldResolve = function (this: any, data) {

    let value = undefined;
    try {
        value = this.function(data);
    } catch (err) {
        return { error: { err, msg: 'Value of field not unsatisfactory of type function' } }
    }
    return { value }
}

let EnumResolve: FieldResolve = function (this: any, data) {
    if (!data && this.default) data = this.default;
    if (this.enum.include(data)) return { value: data };
    return { error: this?.validate?.default || `field required include [${this.enum.join()}]` }
}

let StructResolve: FieldResolve = function (this: any, data) {
    if (typeof data !== 'object') return { error: 'Field required is object' };
    for (let i in this.struct) {
        if (typeof this.struct === 'function') {
            data[i] = this.struct(data[i])
        }
    }
    return { value: data }

}

let RelationResolve: FieldResolve = function (this: any, data) {

    if (this.multi) {
        if (!Array.isArray(data) && data) data = [data];
        else {
            data = []
        }
    }

    return { value: data }
}

let ArrayResolve: FieldResolve = function (this: any, data) {

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

                let { value: data, error } = type.resolve(e);
                if (!error) return data;
            }
        }
    })

    data = data.filter(e => e !== undefined);

    return { value: data };

}