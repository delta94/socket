import crypto from 'crypto';
import mongodb, { ObjectId } from 'mongodb';
import { prepareField, _prepareDataField, renderPaginate } from '../helper/model';
import util from 'util'
import Hook from '../Hook';
import { objectIndex } from '../helper/helper';
import dbConfig from '../../config/database';
import ModelPattern, { findOneOptions, findOptions, findResponse } from '../pattern/ModelPattern';

// const { ObjectID } = mongodb;


let MongoClient = mongodb.MongoClient;

let _database: any,
    _collection = {};

let _ = {
    await: [] as any,
    times: 0,
    database: async function () {
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


export default class MongoDB implements ModelPattern {

    defaultColumn = {
        _id: {
            type: ObjectId
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    }

    name
    collection
    _fields



    constructor(name: string, fields = {}) {
        this.name = name;
        if (name in _collection) {
            this.collection = _collection[name];
        } else {
            (async () => {
                if (!(name in _collection)) {
                    await _.database();

                    _collection[name] = _database.collection(name);
                    this.collection = _collection[name]

                    this.createIndex();
                } else {
                    this.collection = _collection[name]
                }
            })()
        }

        // console.log(this.constructor.name)
        _.instance[name] = this;
        this._fields = prepareField({ ...fields, ...this.defaultColumn });

        Hook.do_action('init-model', [this]);

        if (name === 'demo') {
            console.log(util.inspect(this._fields, false, null, true /* enable colors */))
        }
    }


    async find(options: findOptions): Promise<findResponse> {
        // async find(data: { _id?: any }, paginate: any = { limit: 20, page: 1 }) {

        let { page, limit, match } = options;

        page <= 0 && (page = 1);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let [res1, countDocument] = await Promise.all<any>([
            new Promise((resolve, reject) => {
                match = this._generateFind(match);

                this.collection.find(match).skip(startIndex).limit(limit).sort({ created_at: -1 }).toArray(function (error: any, data: any) {
                    if (error) resolve({ error });
                    else resolve({ data });
                });
            }),
            this.collection.countDocuments(match)])

        let paginate = renderPaginate({ page, limit, countDocument });


        return { data: res1, paginate };

    }

    async findOne(options: findOneOptions) : Promise<{ error?: {}, data?: {} }> {
        // async findOne(find: { _id?: any }, ...ref: any) {

        let { match } = options;

        let { cache } = await Hook.do_action('findOne-before', [match]);

        if (cache) return { data: cache };

        match = this._generateFind(match);

        return new Promise((resolve, reject) => {
            this.collection.findOne(match, function (error: any, data: any) {
                if (error) resolve({ error });
                else {
                    Hook.do_action('findOne-after', [data]);
                    resolve({ data });
                }
            });
        })
    }


    findMany() {
        return new Promise(async (resolve, reject) => {
            let data = await this.collection.find({}).toArray();

            resolve({ data });
        })
    }


    insert() { }

    insertMany(data: []) {
        // if (!Array.isArray(data)) {
        //     data = [data];
        // }
        return new Promise((resolve, reject) => {
            this.collection.insertMany(data, (error: any, data: any) => {
                if (error) {
                    resolve({ error })
                }
                else {
                    resolve({ insertedCount: data.insertedCount })
                }
            });
        })
    }

    async insertOne(data: { _id?: any }) {
        if (data._id) delete data._id;

        return new Promise(async (resolve, reject) => {

            let [res, error] = await _prepareDataField(data, this._fields);
            // console.log(res, error)
            //     return;
            if (error) {
                resolve({ error });
            } else {

                this.collection.insertOne(res, (error: any, res: any) => {

                    if (error) {
                        if (typeof error.keyValue === 'object') {

                            let [key, value]: any[] = objectIndex(error.keyValue, 0);
                            resolve({
                                error: {
                                    [key]: this._fields[key].validate.unique || 'This field has exists, please use another value!'
                                }
                            });
                        } else {
                            resolve({ error });
                        }


                    }
                    else resolve({ data: res.ops[0] });
                });
            }

        })
    }

    async insertOrUpdate(data: any) {
        return new Promise(async (resolve, reject) => {


            let f: { _id?: any } = this._generateFind(data);
            let update = Object.keys(f).length > 0;

            let [res, error] = await _prepareDataField(data, this._fields, update);
            // console.log(res, error)
            //     return;
            if (error) {
                resolve({ error });
            } else {


                if (f._id) {
                    delete res._id;
                    delete res.created_at;

                    this.collection.findOneAndUpdate(f, [{ $set: res }], { new: true, returnOriginal: false }, (error: any, res: any) => {
                        if (error) {

                            if (typeof error.keyValue === 'object') {
                                let [key, value] = objectIndex(error.keyValue, 0);
                                resolve({
                                    error: {
                                        [key]: this._fields[key].validate.unique || `This field "${key}" has exists, please use another value!`
                                    }
                                });
                            } else {
                                resolve({ error });
                            }

                        }
                        else resolve({ data: res.value });
                    });


                } else {
                    this.collection.insertOne(res, (error: any, res: any) => {
                        // console.log(error, res)
                        if (error) {
                            if (typeof error.keyValue === 'object') {

                                let [key, value] = objectIndex(error.keyValue, 0);
                                resolve({
                                    error: {
                                        [key]: this._fields[key].validate.unique || `This field "${key}" has exists, please use another value!`
                                    }
                                });
                            } else {
                                resolve({ error });
                            }


                        }
                        else resolve({ data: res.ops[0] });
                    });
                }


            }

        })
    }


    update() { }


    async findOneAndUpdate(find = {}, data: {}) {
        find = this._generateFind(find);

        return new Promise((resolve, reject) => {
            this.collection.findOneAndUpdate(find, [{ $set: data }], { new: false, returnOriginal: false }, (err: any, res: any) => {
                if (err) {

                    if (typeof err.keyValue === 'object') {
                        let [key, value] = objectIndex(err.keyValue, 0);
                        resolve({
                            error: {
                                [key]: this._fields[key].validate.unique || `This field "${key}" has exists, please use another value!`
                            }
                        });
                    } else {
                        resolve({ error: err });
                    }

                }
                else resolve({ data: res.value });
            });
        })
    }


    async updateOne(find = {}, data: {}) {
        return new Promise(async (resolve, reject) => {

            find = this._generateFind(find)

            let [res, error] = await _prepareDataField(data, this._fields, true);

            if (error) {
                resolve({ error });
            } else {


                delete res._id;
                delete res.created_at;
                this.collection.findOneAndUpdate(find, { $set: res }, { returnOriginal: false }, (error: any, res: any) => {


                    if (error) {

                        if (typeof error.keyValue === 'object') {
                            let [key, value] = objectIndex(error.keyValue, 0);
                            resolve({
                                error: {
                                    [key]: this._fields[key].validate.unique || `This field "${key}" has exists, please use another value!`
                                }
                            });
                        } else {
                            resolve({ error });
                        }

                    }
                    else {
                        Hook.do_action('updateOne-after', [res.value]);
                        resolve({ data: res.value });

                    }
                });


            }

        })
    }

    updateMany() { }


    async delete(find: { _id?: any }) {



        return new Promise((resolve, reject) => {

            if (ObjectIDValid(find._id)) {
                find._id = new ObjectId(find._id)
            }

            this.collection.deleteOne(find, (error: any, obj: any) => {
                if (error) {
                    resolve({ error });
                } else {
                    resolve({ deleteCount: obj.deletedCount })
                }
            });

        })
        // return result;
    }

    deleteOne() { }

    deleteMany() { }


    count(options: { match?: {} }): number {
        throw new Error('Method not implemented.');
    }

    async createIndex() {

        // console.log(this.collection.dropIndex)

        for (let i in this._fields) {
            if (i === '_id') continue;
            let indexObject: any = {}
            if (this._fields[i].index) {
                indexObject[i] = 1;
            }

            let unique;
            if (this._fields[i].unique) {
                indexObject[i] = 1;
                unique = { unique: 1 };
            }

            if (Object.keys(indexObject).length > 0 || unique) {
                this.collection.createIndex(indexObject, unique);
            } else {
                try {
                    let a = await this.collection.dropIndex({ [i]: 1 });
                } catch (err) {

                }
            }


        }
        // if(Object.keys(indexObject).length > 0){
        //     this.collection.createIndex(indexObject)
        // }

    }



    _generateFind(find: { _id?: any } | any = {}): {} {


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
        // console.log(find)
        return find;
    }
}



// ANCHOR: export
export async function getDatabase(name?: string) {
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

export function getModel(name: string, fields = {}, ...ref): AbstractModel {
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


export function getAllModel() {
    return _.instance;
}



export function ObjectIDValid(str: string) {
    return ObjectId.isValid(str);
}