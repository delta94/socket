import { config } from '../helper/helper.js';

import mongodb from 'mongodb';
import { prepareField, _prepareDataField, renderPaginate } from '../helper/model.js';
import util from 'util'
import Hook from '../Hook.js';
import { objectIndex } from '../helper/helper.js';
import { resolve } from 'path';

const { ObjectID } = mongodb;




let MongoClient = mongodb.MongoClient;

let _database,
    _collection = {};

let _ = {
    await: [],
    times: 0,
    database: async function () {
        if (_database) return _database;

        this.times++;

        let dbConfig = await config('Database', 'MongoDB');

        return new Promise((resolve, reject) => {

            this.await.push(resolve)

            if (this.times === 1) {
                MongoClient.connect(dbConfig.stringConnect, { useUnifiedTopology: true }, (err, db) => {
                    if (err) throw err;
                    console.log('database created!');
                    _database = db.db(dbConfig.DATABASE);
                    this.await.forEach(resolve => resolve(_database));

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


export default class MongoDB {

    defaultColumn = {
        _id: {
            type: ObjectID
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


    constructor(name, fields = {}) {

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

    async find(data = {}, paginate = { limit: 20, page: 1 }) {

        // let { cache } = Hook.do_action('find-before',[...arguments]);
        // if(cache) return cache;

        // let arr = ['5fafadb8334ee92f442d7a3c','5fafb01273970242f00c5cb4', '5fb0d4a06a9db7403c28bb3d','5fb0d4a06a9db7403c28bb3e','5fb0d4a06a9db7403c28bb3a','5fb0d4a06a9db7403c28bb3c','5fb0d4a06a9db7403c28bb3f','5fb0d4a06a9db7403c28bb66','5fb0d4a06a9db7403c28bb39','5fb0d4a06a9db7403c28bb4c','5fb0d4a06a9db7403c28bb44','5fb0d4a06a9db7403c28bb40','5fb0d4a06a9db7403c28bb51','5fb0d4a06a9db7403c28bb46','5fb0d4a06a9db7403c28bb5e','5fb0d4a06a9db7403c28bb63','5fb0d4a06a9db7403c28bb3b','5fb0d4a06a9db7403c28bb41','5fb0d4a06a9db7403c28bb6e','5fb0d4a06a9db7403c28bb52']
        // let result = [];
        // for(let i in arr){
        //     let {data, error} = await cache('5fafadb8334ee92f442d7a3c');
        //     result.push(JSON.parse(data))
        // }

        // return [result];


        let { page, limit } = paginate;
        page <= 0 && (page = 1);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let [res1, countDocument] = await Promise.all([
            new Promise((resolve, reject) => {
                if (ObjectIDValid(data._id) || ObjectIDValid(data.id)) {
                    data._id = ObjectID(data._id || data.id);
                    delete data.id;
                }

                this.collection.find(data).skip(startIndex).limit(limit).sort({ created_at: -1 }).toArray(function (error, data) {
                    if (error) resolve({ error });
                    else resolve({ data });
                });
            }),
            this.collection.countDocuments(data)])

        paginate = renderPaginate({ page, limit, countDocument });


        return { ...res1, paginate };

    }

    async findOne(find) {

        let { cache } = await Hook.do_action('findOne-before', [...arguments]);

        if (cache) return { data: cache };

        if (ObjectIDValid(find._id) || ObjectIDValid(find.id)) {
            find._id = ObjectID(find._id || find.id);
            delete find.id;
        }

        if (typeof find === 'string' && ObjectIDValid(find)) {
            find = {
                _id: ObjectID(find)
            }
        }

        return new Promise((resolve, reject) => {
            this.collection.findOne(find, function (error, data) {
                if (error) resolve({ error });
                else {
                    Hook.do_action('findOne-after', [data]);
                    resolve({ data });
                }
            });
        })
    }


    findMany() { }


    insert() { }

    insertMany(data) { 
        if(!Array.isArray(data)){
            data = [data];
        }
        return new Promise((resolve, reject) => {
            this.collection.insertMany(data, (error, data) =>{
                if(error){
                    resolve({error})
                }
                else{
                    resolve({insertedCount: data.insertedCount})
                }
            });
        })
    }

    async insertOne(data) {
        if (data._id) delete data._id;
        if (data.id) delete data.id;

        return new Promise(async (resolve, reject) => {

            let [res, error] = await _prepareDataField(data, this._fields);
            // console.log(res, error)
            //     return;
            if (error) {
                resolve({ error });
            } else {

                this.collection.insertOne(res, (error, res) => {

                    if (error) {
                        if (typeof error.keyValue === 'object') {

                            let [key, value] = objectIndex(error.keyValue, 0);
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

    async insertOrUpdate(data) {
        return new Promise(async (resolve, reject) => {


            let f = this._generateFind(data);
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

                    this.collection.findOneAndUpdate(f, [{ $set: res }], { new: true, returnOriginal: false }, (error, res) => {
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
                    this.collection.insertOne(res, (error, res) => {
                        console.log(error, res)
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


    async findOneAndUpdate(find = {}, data) {
        this._generateFind(find, true);

        return new Promise((resolve, reject) => {
            this.collection.findOneAndUpdate(find, [{ $set: data }], { new: false, returnOriginal: false }, (err, res) => {
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


    async updateOne(find = {}, data) {
        return new Promise(async (resolve, reject) => {

            this._generateFind(find, true)

            let [res, error] = await _prepareDataField(data, this._fields, true);

            if (error) {
                resolve({ error });
            } else {


                delete res._id;
                delete res.created_at;
                this.collection.findOneAndUpdate(find, { $set: res }, { returnOriginal: false }, (error, res) => {


                    if (error) {

                        if (typeof error.keyValue === 'object') {
                            let [key, value] = objectIndex(error.keyValue, 0);
                            resolve({
                                error: {
                                    [key]: this._fields[key].validate.unique || `This field "${key}" has exists, please use another value!`
                                }
                            });
                        } else {
                            resolve({error});
                        }

                    }
                    else {
                        Hook.do_action('updateOne-after', [res.value]);
                        resolve({data: res.value});

                    }
                });


            }

        })
    }

    updateMany() { }


    async delete(find = {}) {



        return new Promise((resolve, reject) => {

            if (ObjectIDValid(find._id) || ObjectIDValid(find.id)) {
                find._id = ObjectID(find._id || find.id)
                delete find.id;
            }

            this.collection.deleteOne(find, (error, obj) => {
                if (error) {
                    resolve({error});
                } else {
                    resolve({ deleteCount: obj.deletedCount })
                }
            });

        })
        // return result;
    }

    deleteOne() { }

    deleteMany() { }

    async createIndex() {

        // console.log(this.collection.dropIndex)

        for (let i in this._fields) {
            if (i === '_id') continue;
            let indexObject = {}
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



    _generateFind(find, assign = false) {
        let f = {}
        if (ObjectIDValid(find._id) || ObjectIDValid(find.id)) {
            f._id = ObjectID(find._id || find.id)
            if (assign) {
                delete find._id
                delete find.id

                find._id = f._id
            }
        }

        return f;
    }
}



// ANCHOR: export
export async function getDatabase(name) {
    if (_database) return _database;

    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
            if (err) throw err;
            console.log('database created!');
            _database = db.db(name || DATABASE);

            resolve(_database);

        })
    })

}

export function getModel(name, fields = {}) {
    if (name in _.instance) {
        return _.instance[name];
    }

    return new Model(name, fields);
}

export async function getCollection(name) {
    let database = await getDatabase();
    return database.collection(name)
}


export const TYPE = {
    Enum: function () {
        return (data) => {
            if ([].includes.bind(arguments)(data)) return data;
            return null;
        }
    },
    Hash: function (str) {
        return crypto.createHash('md5').update(str).digest('hex')
    }
}


export function getAllModel() {
    return _.instance;
}



export function ObjectIDValid(str) {
    return ObjectID.isValid(str);
}