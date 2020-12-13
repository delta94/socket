import crypto from 'crypto';
import MongoDB, { getAllModel as getAllModelMongoDB, getModel as getModelMongoDB } from './model/MongoDB';
import MySQL, { getAllModel as getAllModelMySQL, getModel as getModelMySQL } from './model/MySQL.js';
// import { prepareField, _prepareDataField } from './helper/model.js';


import configDatabase from '../config/database.json';

let ModelClass;
if (configDatabase.default === 'MongoDB') {
    ModelClass = MongoDB;
} else {
    ModelClass = MySQL;
}
export default ModelClass;

// ANCHOR: export
// export async function getDatabase(name?: string) {
//     if (_database) return _database;

//     return new Promise((resolve, reject) => {
//         MongoClient.connect(url, { useUnifiedTopology: true }, (err: any, db: any) => {
//             if (err) throw err;
//             console.log('database created!');
//             _database = db.db(name || DATABASE);

//             resolve(_database);

//         })
//     })

// }

export function getModel(...ref) {

    if (configDatabase.default === 'MongoDB') {
        return getModelMongoDB(...ref);
    }

    return getModelMySQL(...ref)

}




// export async function getCollection(name: string) {
//     let database = await getDatabase();
//     return database.collection(name)
// }


// export const TYPE = {
//     // Enum: function () {
//     //     const Enum = (data) => {
//     //         if ([].includes.bind(arguments)(data)) return data;
//     //         return null;
//     //     }

//     //     return Enum
//     // },
//     Hash: function (str) {
//         return crypto.createHash('md5').update(str).digest('hex')
//     }
// }


// export const getAllModel = () => {

//     if (configDatabase.default === 'MongoDB') {
//         return getAllModelMongoDB();
//     }

//     return getAllModelMySQL()
// }

// ANCHOR: Example parttern
// {
//     // TYPE_1
//     field1: String,




//     fields2: {
//         type: Number,
//         required: true
//     },
//     field3: {
//         type: Date,
//         default: Date.now
//     },

//     field4: {
//         relation: 'user'
//     },
//     // field4: "5fa42c4264cc533838db4954"




//     field5: {
//     }
//     field5: {
//         struct: {
//             name: String,
//             type: Number
//         }
//     }

//     field5: {
//         relation: 'user',
//         struct: ['_id', 'name', 'avatar']
//     },
//     // field5: {
//     //     _id: "5fa42c4264cc533838db4954",
//     //     name: "dang thuyen vuong",
//     //     avatar: '/avatar/vuong.jpg'
//     // }

//     field6: {
//         multi: 'object',
//         relation: 'user',
//         struct: ['_id', 'name', 'avatar']
//     }
//     // field6: {
//         // '5fa42c4264cc533838db4954': {
//         //     name: "dang thuyen vuong",
//         //     avatar: '/avatar/vuong.jpg'
//         // }
//     // }




//     field8: [

//     ],
//     field10: [
//         String
//     ]

//     field7: [
//         {
//             relation: 'user',
//             struct: ['_id', 'name', 'avatar']
//         }
//     ],
//     // field7: [
//     //     {
//     //         _id: "5fa42c4264cc533838db4954",
//     //         name: "dang thuyen vuong",
//     //         avatar: '/avatar/vuong.jpg'
//     //     },
//     //     {
//     //         _id: "5fa42c4264cc533838db4954",
//     //         name: "dang thuyen vuong",
//     //         avatar: '/avatar/vuong.jpg'
//     //     }
//     // ]

//     field9: [
//         {
//             title: String,
//             name: String
//         }
//     ]

// }



// // ANCHOR: Example convert
// {
//     // TYPE_1
//     field1: {
//         type: TYPE_1,
//         resolve: String
//     },



//     field1: {
//         type: TYPE_1,
//         resolve: Number,
//         required: true
//     },
//     field1: {
//         type: TYPE_1,
//         resolve: Date,
//         default: Date.now
//     },



//     // TYPE_2
//     field4: {
//         type: TYPE_OBJECT,
//         relation: 'user',
//         resolve: (obj) => {
//             ....find object in database and return _id
//         }
//     },




//     field5: {
//         type: TYPE_OBJECT,
//         resolve: (obj) => {
//             return anything
//         }
//     }


//     field5: {
//         type: TYPE_OBJECT,
//         relation: 'user',
//         struct: ['_id', 'name', 'avatar'],
//         resolve: (obj) => {
//             ....find object in database and return object
//         }
//     },
//     // field5: {
//     //     _id: "5fa42c4264cc533838db4954",
//     //     name: "dang thuyen vuong",
//     //     avatar: '/avatar/vuong.jpg'
//     // }

//     field6: {
//         type: TYPE_OBJECT,
//         multi: 'object',
//         relation: 'user',
//         struct: ['_id', 'name', 'avatar'],
//         resolve: (obj) => {
//             ....find object in database and return [object] with structor
//         }
//     }
//     // field6: {
//         // '5fa42c4264cc533838db4954': {
//         //     name: "dang thuyen vuong",
//         //     avatar: '/avatar/vuong.jpg'
//         // }
//     // }




//     field8: {
//         type: TYPE_LIST,
//         resolve: function(arr) {
//             return [...arr]
//         }
//     },
//     field10: {
//         type: TYPE_LIST,
//         function: String,
//         resolve: function(arr) {
//             loop in arr and add function to convert
//         }
//     }

//     field7: {
//         type: TYPE_LIST,
//         relation: 'user',
//         struct: ['_id', 'name', 'avatar']
//         resolve: function(arr) {
//             ....find object in database and return [object] with structor
//         }

//     },
//     // field7: [
//     //     {
//     //         _id: "5fa42c4264cc533838db4954",
//     //         name: "dang thuyen vuong",
//     //         avatar: '/avatar/vuong.jpg'
//     //     },
//     //     {
//     //         _id: "5fa42c4264cc533838db4954",
//     //         name: "dang thuyen vuong",
//     //         avatar: '/avatar/vuong.jpg'
//     //     }
//     // ]

//     field9: {
//         type: TYPE_LIST,
//         structor: {
//             title: String,
//             name: String
//         },
//         resolve: function(arr) {
//             replace data with structor
//         }
//     }

// }

