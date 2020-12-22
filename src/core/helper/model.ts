import mongodb from 'mongodb';
import { getModel } from '../Model';

const { ObjectID } = mongodb;

const defaultErrorMessage = {
    required: 'This field is require',
}

export const MODELTYPE = {
    NORMAL: 'NORMAL', // String, Date, Number, function
    RELATION: 'RELATION',

    OBJECT: 'OBJECT', // {...}

    OBJECT_WITH_STRUCT: 'OBJECT_WITH_STRUCT', // {name:..., title:....}

    OBJECT_RELATION_KEY_ID: 'OBJECT_RELATION_KEY_ID', // {"[_id]": {name: ....}, "[_id]": {}}
    OBJECT_RELATION_MULTI_WITH_KEY_ONLEY: 'OBJECT_RELATION_MULTI_WITH_KEY_ONLEY', // {"[_id]": 1, "[_id]": 0}
    RELATION_WITH_ID: 'RELATION_WITH_ID', // only id
    RELATION_WITH_STRUCT: 'RELATION_WITH_STRUCT', //{"[_id]": {name: ....}, "[_id]": {}},

    LIST: 'LIST', // [1,'asdfasdf']
    LIST_TYPE: 'LIST_TYPE', // [1,2,3,4,5]
    LIST_OBJECT: 'LIST_OBJECT', // [{name: 1}, {title: 2}]
    LIST_OBJECT_STRUCT: 'LIST_OBJECT_STRUCT', // [{name: 1}, {name: 2}]
    LIST_RELATION: 'LIST_RELATION', // [{_id: 234234, name: 'adsfasdf'}, {_id: 43253452345, name: 'eeeeeeeee'}]
    // LIST sort
}


export async function _prepareDataField(data, field, update = false) {
    // let valueType, valueDefault
    let errorObject = {};


    for (let i in field) {
        if (i == '_id' ||
            (
                update && typeof data[i] === 'undefined' && i !== 'updated_at' && i !== 'created_at'
            )
        ) {
            continue;
        }
        let res, error;
        switch (field[i].type) {
            case MODELTYPE.NORMAL:
                [res, error] = ModelTypeNormal.bind(field[i])(data[i]);
                break;
            case MODELTYPE.RELATION:
                [res, error] = await field[i].resolve(data[i]);
                break;
            case MODELTYPE.OBJECT:
                [res, error] = field[i].resolve(data[i]);
                break;
            case MODELTYPE.LIST:
                [res, error] = await field[i].resolve(data[i]);
                break;
            default:
                break;
        }


        data[i] = res;

        if (error) {
            errorObject[i] = error
        }
    }

    if (!isEmptyObject(errorObject)) {
        return [data, errorObject];
    }
    return [data];
}



export function prepareField(fields) {
    let object = {};

    for (let i in fields) {
        // TYPE_1
        if (typeof fields[i] === 'function' ||
            (!Array.isArray(fields[i]) && typeof fields[i] === 'object') ||
            Array.isArray(fields[i].enum)
        ) {

            object[i] = Type_1(fields[i]);
        }




        // TYPE_3
        if (Array.isArray(fields[i])) {

            object[i] = Type_3(fields[i]);

        }
    }


    return object



}

function Enum(this: { enum?: any, default?: any }, value: never) {

    if ([].includes.bind(this.enum)(value)) return value;
    return this.default || null;
}
// Only value
function Type_1(fields) {
    if (typeof fields === 'function') {
        return {
            type: MODELTYPE.NORMAL,
            resolve: fields
        }
    }

    if (Array.isArray(fields.enum)) {

        return {
            ...fields,
            type: MODELTYPE.NORMAL,
            resolve: Enum
        }
    }

    if (isEmptyObject(fields)) {
        return {
            type: MODELTYPE.OBJECT,
            resolve: (arr) => arr
        }
    }

    if (fields.relation) {

        return {
            type: MODELTYPE.RELATION,
            ...fields,
            resolve: ModelTypeRelation
        }
    }

    if (fields.struct) {
        return {
            type: MODELTYPE.OBJECT,
            ...fields,
            resolve: ModelTypeObject
        }
    }

    let type = fields.type || ((arr) => arr);
    delete fields.type;

    return {
        type: MODELTYPE.NORMAL,
        ...fields,
        resolve: type
    }
}

// Only list
function Type_3(fields) {
    if (fields.length === 0) {
        return {
            type: MODELTYPE.LIST,
            resolve: ModelTypeList
        }
    }

    if (typeof fields[0] === 'function') {
        return {
            type: MODELTYPE.LIST,
            function: fields[0],
            resolve: ModelTypeList
        }
    }

    if (isEmptyObject(fields[0])) {
        return {
            type: MODELTYPE.LIST,
            resolve: ModelTypeList
        }
    }

    if (typeof fields[0].relation === 'undefined') {

        let struct = prepareField(fields[0]);

        return {
            type: MODELTYPE.LIST,
            struct,
            resolve: ModelTypeList
        };
    }

    if (fields[0].relation) {


        return {
            type: MODELTYPE.LIST,
            // struct: struct,
            ...fields[0],
            resolve: ModelTypeList
        };
    }


    return {
        type: MODELTYPE.LIST,
        resolve: ModelTypeList
    }
}



// Only Object
function Type_2(fields) {

}
function ModelTypeNormal(this: { validate?: any, required?: any, default?: any, resolve: Function }, data) {
    // console.log(data)
    if (this.required && (!data && data != 0)) {
        return [null, this?.validate?.required || defaultErrorMessage.required];
    }

    if (typeof data === 'undefined' && this.default) {
        if (typeof this.default === 'function') {
            return [this.default()]
        } else {
            return [this.default];
        }
    }
    return [this.resolve(data)];

}

export function ModelTypeObject(data) {
    return [data];
}
export function ModelTypeList(data) {
    if (data) {
        if (!Array.isArray(data)) {

            data = [data]
        }

    }


    return [data];
}

export async function ModelTypeRelation(this: { validate?: any, required?: any, multi?: any, relation?: any, resolve: Function }, data) {
    // only _id
    // object 
    // object with _id key

    if (this.required && (!data && data != 0)) {
        return [null, this.validate?.required || defaultErrorMessage.required];
    }

    if (data) {
        return new Promise(async (resolve, reject) => {

            let f;
            if (this.multi) {
                if (!Array.isArray(data)) {
                    data = [data]
                }
                if (data.length > 0) {
                    f = data.map(e => {
                        if (ObjectID.isValid(e)) return new ObjectID(e)
                        return e;
                    })
                    f = { _id: { $in: f } }
                }

            } else {
                if (ObjectID.isValid(data)) {
                    f = { _id: new ObjectID(data) }
                }

            }

            let { data: res, error } = f ? await getModel(this.relation).find(f) : { data: null, error: null }

            let result: any = res;
            if (res) {
                if (this.multi) {
                    result = res.map(e => new ObjectID(e._id));

                } else {
                    if (res[0]) {
                        result = new ObjectID(res[0]._id)
                    } else {
                        result = null
                    }
                }
            }


            if (this.required &&
                (
                    (Array.isArray(result) && result.length === 0) ||
                    !result
                )
            ) {
                resolve([null, `Data not match with "${this.relation}" please check again`]);
                return;
            }

            resolve([result]);

        })
    }

    if (this.multi) {
        return [[]];
    }
    return [null];
}





function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function renderPaginate({ page = 1, limit = 10, countDocument }) {

    page <= 0 && (page = 1);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let result: {
        nextPage?: number,
        previousPage?: number,
        currentPage: number,
        totalPage: number,
        count: number,
        perPage: number
    } = {
        currentPage: page,
        totalPage: Math.ceil(countDocument / limit),
        count: countDocument,
        perPage: limit
    }


    if (endIndex < countDocument) {
        result.nextPage = page + 1
    }

    if (startIndex > 0) {
        result.previousPage = page - 1
    }

    // result.currentPage = page;
    // result.totalPage = Math.ceil(countDocument / limit)
    // result.count = countDocument;
    // result.perPage = limit;

    return result;
}