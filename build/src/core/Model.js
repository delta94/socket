"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getAllModel = exports.getModel = void 0;
var MongoDB_1 = __importStar(require("./model/MongoDB"));
var MySQL_1 = require("./model/MySQL");
// import { prepareField, _prepareDataField } from './helper/model.js';
var database_1 = __importDefault(require("../config/database"));
var ModelClass;
if (database_1["default"]["default"] === 'MongoDB') {
    ModelClass = MongoDB_1["default"];
}
else {
    // ModelClass = MySQL;
}
exports["default"] = ModelClass;
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
function getModel(name, fields) {
    var ref = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        ref[_i - 2] = arguments[_i];
    }
    if (database_1["default"]["default"] === 'MongoDB') {
        return MongoDB_1.getModel.apply(void 0, __spread([name, fields], ref));
    }
    return MySQL_1.getModel.apply(void 0, __spread([name, fields], ref));
}
exports.getModel = getModel;
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
exports.getAllModel = function () {
    if (database_1["default"]["default"] === 'MongoDB') {
        return MongoDB_1.getAllModel();
    }
    return MySQL_1.getAllModel();
};
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
