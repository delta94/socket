// import Database from '../../../../config/Database.js';
// import mongodb from 'mongodb';
// import crypto from 'crypto';
// import { prepareField, _prepareDataField } from '../helper/model.js';
// import util from 'util'
// import Hook from '../Hook.js';
// import { getMethods, ObjectIDValid, objectIndex } from '../helper/helper.js';




// const { ObjectID } = mongodb;

// // ANCHOR: INIT
// let url, DATABASE;
// switch (Database.default) {
//     case 'network':
//         url = `mongodb+srv://${Database.network.USERNAME}:${Database.network.PASSWORD}@cluster0.ticyv.mongodb.net`;
//         DATABASE = Database.network.DATABASE;
//         break;
//     default:
//         break;
// }

// let MongoClient = mongodb.MongoClient;

// let _database,
//     _collection = {};



// let _ = {
//     await: [],
//     times: 0,
//     database: async function () {
//         if (_database) return _database;


//         this.times++;

//         return new Promise((resolve, reject) => {

//             this.await.push(resolve)

//             if (this.times === 1) {
//                 MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
//                     if (err) throw err;
//                     console.log('database created!');
//                     _database = db.db(DATABASE);
//                     this.await.forEach(resolve => resolve(_database));

//                     // resolve(_database);

//                     // dbo.createCollection("customers", function (err, res) {
//                     //     if (err) throw err;
//                     //     console.log("Collection created!");
//                     //     db.close();
//                     // });
//                     // db.close();
//                 })
//             }

//         })
//     },
//     instance: {}
// }




// // ANCHOR: Class
// export default class Model {

//     defaultColumn = {
//         _id: {
//             type: ObjectID
//         },
//         created_at: {
//             type: Date,
//             default: Date.now
//         },
//         updated_at: {
//             type: Date,
//             default: Date.now
//         }
//     }


//     constructor(name, fields = {}) {

//         this.name = name;
//         if (name in _collection) {
//             this.collection = _collection[name];
//         } else {
//             (async () => {
//                 if (!(name in _collection)) {
//                     await _.database();

//                     _collection[name] = _database.collection(name);
//                     this.collection = _collection[name]

//                     this.createIndex();
//                 } else {
//                     this.collection = _collection[name]
//                 }
//             })()
//         }


//         _.instance[name] = this;
//         this._fields = prepareField({ ...fields, ...this.defaultColumn });
//         Hook.add_action('init-model', [this]);

//         if (name === 'demo') {
//             console.log(util.inspect(this._fields, false, null, true /* enable colors */))
//         }
//     }


//     // get() {

//     // }

//     // save() {

//     // }

//     // delete() {

//     // }

//     async find(data = {}, paginate = { limit: 20, page: 1 }) {
//         let { page, limit } = paginate;
//         page <= 0 && (page = 1);
//         const startIndex = (page - 1) * limit;
//         const endIndex = page * limit;


//         let [res1, countDocument] = await Promise.all([
//             new Promise((resolve, reject) => {
//                 if (ObjectIDValid(data._id) || ObjectIDValid(data.id)) {
//                     data._id = ObjectID(data._id || data.id);
//                     delete data.id;
//                 }

//                 this.collection.find(data).skip(startIndex).limit(limit).sort({ created_at: -1 }).toArray(function (err, res) {
//                     if (err) resolve([null, err]);
//                     else resolve([res, null]);
//                 });
//             }),
//             this.collection.countDocuments()])

//         paginate = {}

//         if (endIndex < countDocument) {
//             paginate.next = {
//                 page: page + 1,
//                 limit
//             }
//         }

//         if (startIndex > 0) {
//             paginate.privious = {
//                 page: page - 1,
//                 limit
//             }
//         }

//         paginate.count = countDocument;
//         paginate.perPage = limit;


//         return [...res1, paginate];

//     }

//     async findOne(data) {
//         if (ObjectIDValid(data._id) || ObjectIDValid(data.id)) {
//             data._id = ObjectID(data._id || data.id);
//             delete data.id;
//         }

//         if (typeof data === 'string' && ObjectIDValid(data)) {
//             data = {
//                 _id: ObjectID(data)
//             }
//         }

//         return new Promise((resolve, reject) => {
//             this.collection.findOne(data, function (err, res) {
//                 if (err) resolve([null, err]);
//                 else resolve([res, null]);
//             });
//         })
//     }

//     async insertOne(data) {
//         if (data._id) delete data._id;
//         if (data.id) delete data.id;

//         return new Promise(async (resolve, reject) => {

//             let [res, error] = await _prepareDataField(data, this._fields);
//             // console.log(res, error)
//             //     return;
//             if (error) {
//                 resolve([null, error]);
//             } else {

//                 this.collection.insertOne(res, (err, res) => {

//                     if (err) {
//                         if (typeof err.keyValue === 'object') {

//                             let [key, value] = objectIndex(err.keyValue, 0);
//                             resolve([null, {
//                                 [key]: this._fields[key].validate?.unique || 'This field has exists, please use another value!'
//                             }]);
//                         } else {
//                             resolve([null, err]);
//                         }


//                     }
//                     else resolve([res.ops[0], null]);
//                 });
//             }

//         })
//     }

//     async insertOrUpdate(data) {
//         return new Promise(async (resolve, reject) => {


//             let f = {}
//             let update = false;
//             if (ObjectIDValid(data._id) || ObjectIDValid(data.id)) {
//                 f._id = ObjectID(data._id || data.id)
//                 update = true;
//             }

//             let [res, error] = await _prepareDataField(data, this._fields, update);
//             // console.log(res, error)
//             //     return;
//             if (error) {
//                 resolve([null, error]);
//             } else {


//                 if (f._id) {
//                     delete res._id;
//                     delete res.created_at;

//                     this.collection.findOneAndUpdate(f, [{ $set: res }], { new: true, returnOriginal: false }, (err, res) => {
//                         if (err) {

//                             if (typeof err.keyValue === 'object') {
//                                 let [key, value] = objectIndex(err.keyValue, 0);
//                                 resolve([null, {
//                                     [key]: this._fields[key].validate?.unique || `This field "${key}" has exists, please use another value!`
//                                 }]);
//                             } else {
//                                 resolve([null, err]);
//                             }

//                         }
//                         else resolve([res.value, null]);
//                     });


//                 } else {
//                     this.collection.insertOne(res, (err, res) => {
//                         console.log(err, res)
//                         if (err) {
//                             if (typeof err.keyValue === 'object') {

//                                 let [key, value] = objectIndex(err.keyValue, 0);
//                                 resolve([null, {
//                                     [key]: this._fields[key].validate?.unique || `This field "${key}" has exists, please use another value!`
//                                 }]);
//                             } else {
//                                 resolve([null, err]);
//                             }


//                         }
//                         else resolve([res.ops[0], null]);
//                     });
//                 }


//             }

//         })
//     }


//     async updateOne(find = {}, data) {
//         return new Promise(async (resolve, reject) => {


//             if (ObjectIDValid(find._id) || ObjectIDValid(find.id)) {
//                 find._id = ObjectID(find._id || find.id)

//                 delete find.id;
//             }


//             let [res, error] = await _prepareDataField(data, this._fields, true);

//             if (error) {
//                 resolve([null, error]);
//             } else {


//                 delete res._id;
//                 delete res.created_at;
//                 this.collection.findOneAndUpdate(find, { $set: res }, { returnOriginal: false }, (err, res) => {
                    

//                     if (err) {

//                         if (typeof err.keyValue === 'object') {
//                             let [key, value] = objectIndex(err.keyValue, 0);
//                             resolve([null, {
//                                 [key]: this._fields[key].validate?.unique || `This field "${key}" has exists, please use another value!`
//                             }]);
//                         } else {
//                             resolve([null, err]);
//                         }

//                     }
//                     else resolve([res.value, null]);
//                 });


//             }

//         })
//     }

//     async updateMany() {

//     }

//     async delete(find = {}) {



//         return new Promise((resolve, reject) => {

//             if (ObjectIDValid(find._id) || ObjectIDValid(find.id)) {
//                 find._id = ObjectID(find._id || find.id)
//                 delete find.id;
//             }

//             this.collection.deleteOne(find, (err, obj) => {
//                 if (err) {
//                     resolve([null, err]);
//                 } else {
//                     resolve([{ deleteCount: obj.deletedCount }])
//                 }
//             });

//         })
//         // return result;
//     }

//     async createIndex() {

//         // console.log(this.collection.dropIndex)

//         for (let i in this._fields) {
//             if (i === '_id') continue;
//             let indexObject = {}
//             if (this._fields[i].index) {
//                 indexObject[i] = 1;
//             }

//             let unique;
//             if (this._fields[i].unique) {
//                 indexObject[i] = 1;
//                 unique = { unique: 1 };
//             }

//             if (Object.keys(indexObject).length > 0 || unique) {
//                 this.collection.createIndex(indexObject, unique);
//             } else {
//                 try {
//                     let a = await this.collection.dropIndex({ [i]: 1 });
//                 } catch (err) {

//                 }
//             }


//         }
//         // if(Object.keys(indexObject).length > 0){
//         //     this.collection.createIndex(indexObject)
//         // }

//     }


// }

// // ANCHOR: export
// export async function getDatabase(name) {
//     if (_database) return _database;

//     return new Promise((resolve, reject) => {
//         MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
//             if (err) throw err;
//             console.log('database created!');
//             _database = db.db(name || DATABASE);

//             resolve(_database);

//             // dbo.createCollection("customers", function (err, res) {
//             //     if (err) throw err;
//             //     console.log("Collection created!");
//             //     db.close();
//             // });
//             // db.close();
//         })
//     })

// }

// export function getModel(name, fields = {}) {
//     if (name in _.instance) {
//         return _.instance[name];
//     }

//     return new Model(name, fields);
// }

// export async function getCollection(name) {
//     let database = await getDatabase();
//     return database.collection(name)
// }


// export const TYPE = {
//     Enum: function () {
//         return (data) => {
//             if ([].includes.bind(arguments)(data)) return data;
//             return null;
//         }
//     },
//     Hash: function (str) {
//         return crypto.createHash('md5').update(str).digest('hex')
//     }
// }


// export function getAllModel() {
//     return _.instance;
// }

// // ANCHOR: Example parttern
// // {
// //     // TYPE_1
// //     field1: String,




// //     fields2: {
// //         type: Number,
// //         required: true
// //     },
// //     field3: {
// //         type: Date,
// //         default: Date.now
// //     },

// //     field4: {
// //         relation: 'user'
// //     },
// //     // field4: "5fa42c4264cc533838db4954"




// //     field5: {
// //     }
// //     field5: {
// //         struct: {
// //             name: String,
// //             type: Number
// //         }
// //     }

// //     field5: {
// //         relation: 'user',
// //         struct: ['_id', 'name', 'avatar']
// //     },
// //     // field5: {
// //     //     _id: "5fa42c4264cc533838db4954",
// //     //     name: "dang thuyen vuong",
// //     //     avatar: '/avatar/vuong.jpg'
// //     // }

// //     field6: {
// //         multi: 'object',
// //         relation: 'user',
// //         struct: ['_id', 'name', 'avatar']
// //     }
// //     // field6: {
// //         // '5fa42c4264cc533838db4954': {
// //         //     name: "dang thuyen vuong",
// //         //     avatar: '/avatar/vuong.jpg'
// //         // }
// //     // }




// //     field8: [

// //     ],
// //     field10: [
// //         String
// //     ]

// //     field7: [
// //         {
// //             relation: 'user',
// //             struct: ['_id', 'name', 'avatar']
// //         }
// //     ],
// //     // field7: [
// //     //     {
// //     //         _id: "5fa42c4264cc533838db4954",
// //     //         name: "dang thuyen vuong",
// //     //         avatar: '/avatar/vuong.jpg'
// //     //     },
// //     //     {
// //     //         _id: "5fa42c4264cc533838db4954",
// //     //         name: "dang thuyen vuong",
// //     //         avatar: '/avatar/vuong.jpg'
// //     //     }
// //     // ]

// //     field9: [
// //         {
// //             title: String,
// //             name: String
// //         }
// //     ]

// // }



// // // ANCHOR: Example convert
// // {
// //     // TYPE_1
// //     field1: {
// //         type: TYPE_1,
// //         resolve: String
// //     },



// //     field1: {
// //         type: TYPE_1,
// //         resolve: Number,
// //         required: true
// //     },
// //     field1: {
// //         type: TYPE_1,
// //         resolve: Date,
// //         default: Date.now
// //     },



// //     // TYPE_2
// //     field4: {
// //         type: TYPE_OBJECT,
// //         relation: 'user',
// //         resolve: (obj) => {
// //             ....find object in database and return _id
// //         }
// //     },




// //     field5: {
// //         type: TYPE_OBJECT,
// //         resolve: (obj) => {
// //             return anything
// //         }
// //     }


// //     field5: {
// //         type: TYPE_OBJECT,
// //         relation: 'user',
// //         struct: ['_id', 'name', 'avatar'],
// //         resolve: (obj) => {
// //             ....find object in database and return object
// //         }
// //     },
// //     // field5: {
// //     //     _id: "5fa42c4264cc533838db4954",
// //     //     name: "dang thuyen vuong",
// //     //     avatar: '/avatar/vuong.jpg'
// //     // }

// //     field6: {
// //         type: TYPE_OBJECT,
// //         multi: 'object',
// //         relation: 'user',
// //         struct: ['_id', 'name', 'avatar'],
// //         resolve: (obj) => {
// //             ....find object in database and return [object] with structor
// //         }
// //     }
// //     // field6: {
// //         // '5fa42c4264cc533838db4954': {
// //         //     name: "dang thuyen vuong",
// //         //     avatar: '/avatar/vuong.jpg'
// //         // }
// //     // }




// //     field8: {
// //         type: TYPE_LIST,
// //         resolve: function(arr) {
// //             return [...arr]
// //         }
// //     },
// //     field10: {
// //         type: TYPE_LIST,
// //         function: String,
// //         resolve: function(arr) {
// //             loop in arr and add function to convert
// //         }
// //     }

// //     field7: {
// //         type: TYPE_LIST,
// //         relation: 'user',
// //         struct: ['_id', 'name', 'avatar']
// //         resolve: function(arr) {
// //             ....find object in database and return [object] with structor
// //         }

// //     },
// //     // field7: [
// //     //     {
// //     //         _id: "5fa42c4264cc533838db4954",
// //     //         name: "dang thuyen vuong",
// //     //         avatar: '/avatar/vuong.jpg'
// //     //     },
// //     //     {
// //     //         _id: "5fa42c4264cc533838db4954",
// //     //         name: "dang thuyen vuong",
// //     //         avatar: '/avatar/vuong.jpg'
// //     //     }
// //     // ]

// //     field9: {
// //         type: TYPE_LIST,
// //         structor: {
// //             title: String,
// //             name: String
// //         },
// //         resolve: function(arr) {
// //             replace data with structor
// //         }
// //     }

// // }
