import crypto from 'crypto';
import mongodb, { ObjectID, ObjectId } from 'mongodb';
import { renderPaginate } from '../helper/model';
import util from 'util'
import Hook from '../Hook';
import { objectIndex } from '../helper/helper';
import dbConfig from '../../config/database';
import ModelAbstract, { deleteManyResponse, findOneOptions, findOneResponse, findOptions, findResponse, insertManyResponse, intertOneResponse, intertOrUpdateResponse, updateOneResponse, updateManyResponse, deleteOneResponse, ModelInterface, Field, FieldsInput } from '../pattern/ModelPattern';
import { DoBeforeFind, DoBeforeFindOneModel } from 'hooks/modelhook';

// const { ObjectID } = mongodb;


let MongoClient = mongodb.MongoClient;

let _database: mongodb.Db,
    _collection = {};

let _ = {
    await: [] as any,
    times: 0,
    database: async function (): Promise<mongodb.Db> {
        if (_database) return _database;

        this.times++;


        return new Promise((resolve, reject) => {

            this.await.push(resolve)

            if (this.times === 1) {
                MongoClient.connect(dbConfig.MongoDB.stringConnect, { useUnifiedTopology: true }, (err, db) => {
                    if (err) throw err;
                    console.log('database created!');
                    _database = db.db(dbConfig.MongoDB.DATABASE);
                    this.await.forEach((resolve: any) => resolve(_database));

                    // resolve(_database);

                    // dbo.createCollection("customers", function (err, res) {
                    //     if (err) throw err;
                    //     console.log("Collection created!");
                    //     db.close();
                    // });
                    // db.close();
                })
            }

        })
    },
    instance: {}
}


export default class MongoDB extends ModelAbstract implements ModelInterface {

    protected primaryKey = {
        name: '_id',
        type: ObjectID
    }

    public collection: mongodb.Collection | null = null

    constructor(name: string, fields: FieldsInput) {
        super(name, fields)
        // this._prepareData(fields)
        if (name in _collection) {
            this.collection = _collection[name];
        } else {
            (async () => {
                if (!(name in _collection)) {
                    await _.database();

                    _collection[name] = _database.collection(name);
                    this.collection = _collection[name]

                    this._createIndex();
                } else {
                    this.collection = _collection[name]
                }
            })()
        }

        _.instance[name] = this;

        Hook.do_action('init-model', [this]);

        if (name === 'demo') {
            console.log(util.inspect(this._fields, false, null, true /* enable colors */))
        }
    }
    getCollection() {
        throw new Error('Method not implemented.');
    }


    async findMany(options: findOptions = { limit: 15, page: 1, sort: { _id: -1 } }): Promise<findResponse> {

        let { page = 1, limit = 15, match, data, sort, join, select } = await super._findMany(options)
        if (data) return { data }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let [res1, countDocument] = await Promise.all<any>([
            new Promise((resolve, reject) => {
                // match = this._generateFind(match);

                let options: any = [
                    {
                        $sort: sort
                    },
                    {
                        $skip: startIndex
                    },
                    {
                        $limit: limit
                    },

                    // JOIN
                    ...(() => {
                        let list: any = []


                        if (join) {
                            if (!Array.isArray(join)) join = [join]

                            join.forEach((e: any) => {


                                let { multi } = e
                                delete e.multi

                                list.push({ $lookup: { ...e, as: e.as || e.localField } })
                                if (!multi) {
                                    list.push({ $unwind: `$${e.as || e.localField}` })
                                }

                            })
                        }
                        return list
                    })(),

                    // Select
                    ...(() => {
                        let list = {}
                        if (select) {
                            select.forEach(e => {
                                list[e] = 1
                            });

                            return [{ $project: list }]

                        }
                        return [];
                    })()

                ]


                if (match) options.unshift({
                    $match: match
                })
                this.collection?.aggregate(options, { allowDiskUse: true }).toArray(function (error: any, data: any) {

                    if (error) {
                        console.log(error)
                        resolve({ error })
                    }
                    else resolve({ data });
                });

                // this.collection.find(match).skip(startIndex).limit(limit).sort(sort).toArray(function (error: any, data: any) {
                //     if (error) resolve({ error });
                //     else resolve({ data });
                // });
            }),
            this.collection?.countDocuments(match)])

        let paginate = renderPaginate({ page, limit, countDocument });

        return { data: res1.data, paginate };

    }

    async findOne(options: string | findOneOptions): Promise<findOneResponse> {

        if (typeof options === 'string') {
            options = { match: { _id: options } }
        }
        let { match, join } = options;

        if (join) {
            let result = await this.findMany(options);
            if (result?.data?.[0]) return { data: result?.data?.[0] }

            return { data: null }

        }

        match = this._generateFind(match);
        let { data, next } = await this._findOne(options)
        if (data) return { data };

        return new Promise((resolve, reject) => {
            this.collection?.findOne(match, (error: any, data: any) => {
                if (error) resolve({ error });
                else {
                    Hook.do_action('findOne-after', [data]);

                    this.setCache(data)
                    resolve({ data });
                }
            });
        })
    }



    setCache(object: { _id?: ObjectId }) {
        if (object?._id) {
            let name = object._id?.toHexString()
            super.setCache(name, object);
        }

    }


    async insertOne(insertData: any): Promise<intertOneResponse> {
        if (insertData._id) delete insertData._id;

        // let [data, error] = await _prepareDataField(insertData, this._fields);

        // if (error) {
        //     return { error, insertCount: 0 };
        // }
        let { error, data } = this._checkValidateOne(insertData);
        if (error) {
            return { error, insertCount: 0 };
        }
        return new Promise((resolve, reject) => {
            this.collection?.insertOne(data, (error: any, res: any) => {

                if (error) {
                    if (typeof error.keyValue === 'object') {

                        let [key, value]: any[] = objectIndex(error.keyValue, 0);

                        error = {
                            [key]: this._fields[key]?.validate?.unique || 'This field has exists, please use another value!'
                        }
                        return resolve({ error, insertCount: 0 })
                    } else {
                        return resolve({ error, insertCount: 0 })
                    }
                }
                else {
                    let data = res.ops[0];
                    this.setCache(data)
                    return resolve({ data, insertCount: 1 })
                }
            });
        })

    }

    insertMany(data: any): Promise<insertManyResponse> {

        data = data.map(e => {
            let result = this._checkValidateOne(e)
            if (result.data) {
                return result.data
            }

            return null
        })

        data.filter(e => e !== null)

        return new Promise((resolve, rejct) => {
            this.collection?.insertMany(data, (error: any, data) => {
                if (error) resolve({ error, insertCount: 0 })

                return resolve({ insertCount: data?.insertedCount || 0 })
            })
        })
    }

    async insertOrUpdate(insertData: { [key in string]: any }, match?: any | { [key in string]: any }): Promise<intertOrUpdateResponse> {
        !match && (match = {})
        if (insertData._id) delete insertData._id;

        // let [data, error] = await _prepareDataField(insertData, this._fields);

        // if (error) {
        //     return { error, insertCount: 0 };
        // }
        let { error, data } = await this._checkValidateOne(insertData);
        if (error) {
            return { error, insertCount: 0 };
        }

        if (match?._id) match._id = new ObjectID(match._id)


        return new Promise(async (resolve, reject) => {


            // let f: { _id?: any } = this._generateFind(data);
            // let update = Object.keys(f).length > 0;

            // let [res, error] = await _prepareDataField(data, this._fields, update);

            if (error) {
                resolve({ error, insertCount: 0 });
            } else {


                this.collection?.findOneAndUpdate(match, [{ $set: data }], { upsert: true, returnOriginal: false }, (error: any, res: any) => {
                    if (error) {

                        if (typeof error.keyValue === 'object') {
                            let [key, value] = objectIndex(error.keyValue, 0);
                            resolve({
                                error: {
                                    [key]: this._fields[key].validate.unique || `This field "${key}" has exists, please use another value!`
                                },
                                insertCount: 0
                            });
                        } else {
                            resolve({ error, insertCount: 0 });
                        }

                    }
                    else resolve({ data: res.value, insertCount: 1 });
                });


                // if (match._id) {

                //     this.collection.findOneAndUpdate(match, [{ $set: data }], { new: true, returnOriginal: false }, (error: any, res: any) => {
                //         if (error) {

                //             if (typeof error.keyValue === 'object') {
                //                 let [key, value] = objectIndex(error.keyValue, 0);
                //                 resolve({
                //                     error: {
                //                         [key]: this._fields[key].validate.unique || `This field "${key}" has exists, please use another value!`
                //                     },
                //                     insertCount: 0
                //                 });
                //             } else {
                //                 resolve({ error, insertCount: 0 });
                //             }

                //         }
                //         else resolve({ data: res.value, insertCount: 1 });
                //     });


                // } else {
                //     this.collection.insertOne(res, (error: any, res: any) => {
                //         // console.log(error, res)
                //         if (error) {
                //             if (typeof error.keyValue === 'object') {

                //                 let [key, value] = objectIndex(error.keyValue, 0);
                //                 resolve({
                //                     error: {
                //                         [key]: this._fields[key].validate.unique || `This field "${key}" has exists, please use another value!`
                //                     },
                //                     insertCount: 0
                //                 });
                //             } else {
                //                 resolve({ error, insertCount: 0 });
                //             }


                //         }
                //         else resolve({ data: res.ops[0], insertCount: 1 });
                //     });
                // }

            }

        })
    }

    async updateOne(find: any, dataInsert: any): Promise<updateOneResponse> {
        return new Promise(async (resolve, reject) => {

            find = this._generateFind(find)

            let { error, data: res } = await this._checkValidateOne(dataInsert, true);
            if (error) {
                resolve({ error, updateCount: 0 });
            } else {


                delete res._id;
                delete res.created_at;
                this.collection?.findOneAndUpdate(find, { $set: res }, { returnOriginal: false }, (error: any, res: any) => {


                    if (error) {

                        if (typeof error.keyValue === 'object') {
                            let [key, value] = objectIndex(error.keyValue, 0);
                            resolve({
                                error: {
                                    [key]: this._fields[key].validate.unique || `This field "${key}" has exists, please use another value!`
                                },
                                updateCount: 0
                            });
                        } else {
                            resolve({ error, updateCount: 0 });
                        }

                    }
                    else {
                        Hook.do_action('updateOne-after', [res.value]);
                        resolve({ data: res.value, updateCount: 1 });

                    }
                });


            }

        })
    }

    updateMany(data: []): Promise<updateManyResponse> {
        return new Promise((resolve, reject) => {
            resolve({ error: {}, updateCount: 0 })
        })
    }


    async deleteOne(find: { _id?: any }): Promise<deleteOneResponse> {



        return new Promise((resolve, reject) => {

            if (ObjectIDValid(find._id)) {
                find._id = new ObjectId(find._id)
            }

            this.collection?.deleteOne(find, (error: any, obj: any) => {
                if (error) {
                    resolve({ error, deleteCount: 0 });
                } else {
                    resolve({ deleteCount: obj.deletedCount })
                }
            });

        })
        // return result;
    }

    deleteMany(query: []): Promise<deleteManyResponse> {
        return new Promise((resolve, reject) => {
            resolve({ error: {}, deleteCount: 0 })
        })
    }

    deleteById(id: string): Promise<deleteOneResponse> {
        return this.deleteOne({ _id: new ObjectID(id) })
    }


    count(options: { match?: {} }): Promise<number> {
        return new Promise((resolve, reject) => {
            resolve(0);
        })
    }

    async _createIndex() {

        for (let i in this._fields) {
            if (i === '_id') continue;
            let indexObject: any = {}
            if (this._fields[i].index) {

                if (typeof this._fields[i].index === 'string') {
                    indexObject[`${i}.${this._fields[i].index}`] = 1;
                } else {
                    indexObject[i] = 1;
                }

            }

            let unique;
            if (this._fields[i].unique) {
                indexObject[i] = 1;
                unique = { unique: 1 };
            }

            if (Object.keys(indexObject).length > 0 || unique) {
                this.collection?.createIndex(indexObject, unique);
            } else {
                try {
                    // let a = await this.collection?.dropIndex({ [i]: 1 });
                    let a = await this.collection?.dropIndex(i);
                } catch (err) {

                }
            }


        }

    }



    _generateFind(find: string | { _id?: any } | any = {}): {} {


        if (typeof find === 'object' && !ObjectIDValid(find) && !Array.isArray(find)) {
            for (let i in find) {

                if (this._fields?.[i]?.relation) {
                    if (ObjectIDValid(find[i])) {
                        find[i] = new ObjectId(find[i])
                    }
                }
            }
        }


        if (typeof find === 'string') {
            find = { _id: new ObjectId(find) }
        } else if (find?.['_id'] && Array.isArray(find?.['_id'])) {
            let $in: any[] = [];
            for (let i in find) {
                if (ObjectIDValid(find[i])) {
                    $in.push(new ObjectId(find[i]))
                }
            }
            find['_id'] = {
                $in
            };
        } else if (ObjectIDValid(find['_id'])) {
            find['_id'] = new ObjectId(find['_id'])

        } else if (Array.isArray(find)) {
            let $in: any[] = [];
            for (let i in find) {
                if (ObjectIDValid(find[i])) {
                    $in.push(new ObjectId(find[i]))
                }
            }
            find = {
                _id: {
                    $in
                }
            }
        }

        if (ObjectIDValid(find)) {
            find = { _id: new ObjectId(find) }
        }
        return find;
    }
}



// ANCHOR: export
export async function getDatabase(name?: string): Promise<mongodb.Db> {
    if (_database) return _database;


    return new Promise((resolve, reject) => {
        MongoClient.connect(dbConfig.MongoDB.stringConnect, { useUnifiedTopology: true }, (err: any, db: any) => {
            if (err) throw err;
            console.log('database created!');
            _database = db.db(name);

            resolve(_database);

        })
    })

}

export function getModel(name: string, fields = {}, ...ref): ModelInterface {
    if (name in _.instance) {
        return _.instance[name];
    }

    let o = new MongoDB(name, fields);

    return o;
}

export async function getCollection(name: string) {
    let database = await getDatabase();
    return database.collection(name)
}


export const TYPE = {
    Enum: function (...ref: any) {
        return (data: never) => {
            if ([].includes.bind(ref)(data)) return data;
            return null;
        }
    },
    Hash: function (str: string) {
        return crypto.createHash('md5').update(str).digest('hex')
    }
}


export function getAllModel(): any {
    return _.instance;
}



export function ObjectIDValid(str: string) {
    return ObjectId.isValid(str);
}