"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.ObjectIDValid = exports.getAllModel = exports.TYPE = exports.getCollection = exports.getModel = exports.getDatabase = void 0;
var crypto_1 = __importDefault(require("crypto"));
var mongodb_1 = __importStar(require("mongodb"));
var model_1 = require("../helper/model");
var util_1 = __importDefault(require("util"));
var Hook_1 = __importDefault(require("../Hook"));
var helper_1 = require("../helper/helper");
var database_1 = __importDefault(require("../../config/database"));
// const { ObjectID } = mongodb;
var MongoClient = mongodb_1["default"].MongoClient;
var _database, _collection = {};
var _ = {
    await: [],
    times: 0,
    database: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (_database)
                    return [2 /*return*/, _database];
                this.times++;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.await.push(resolve);
                        if (_this.times === 1) {
                            MongoClient.connect(database_1["default"].MongoDB.stringConnect, { useUnifiedTopology: true }, function (err, db) {
                                if (err)
                                    throw err;
                                console.log('database created!');
                                _database = db.db(database_1["default"].MongoDB.DATABASE);
                                _this.await.forEach(function (resolve) { return resolve(_database); });
                                // resolve(_database);
                                // dbo.createCollection("customers", function (err, res) {
                                //     if (err) throw err;
                                //     console.log("Collection created!");
                                //     db.close();
                                // });
                                // db.close();
                            });
                        }
                    })];
            });
        });
    },
    instance: {}
};
var MongoDB = /** @class */ (function () {
    function MongoDB(name, fields) {
        var _this = this;
        if (fields === void 0) { fields = {}; }
        this.defaultColumn = {
            _id: {
                type: mongodb_1.ObjectId
            },
            created_at: {
                type: Date,
                "default": Date.now
            },
            updated_at: {
                type: Date,
                "default": Date.now
            }
        };
        this.name = name;
        if (name in _collection) {
            this.collection = _collection[name];
        }
        else {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!(name in _collection)) return [3 /*break*/, 2];
                            return [4 /*yield*/, _.database()];
                        case 1:
                            _a.sent();
                            _collection[name] = _database.collection(name);
                            this.collection = _collection[name];
                            this.createIndex();
                            return [3 /*break*/, 3];
                        case 2:
                            this.collection = _collection[name];
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
        }
        // console.log(this.constructor.name)
        _.instance[name] = this;
        this._fields = model_1.prepareField(__assign(__assign({}, fields), this.defaultColumn));
        Hook_1["default"].do_action('init-model', [this]);
        if (name === 'demo') {
            console.log(util_1["default"].inspect(this._fields, false, null, true /* enable colors */));
        }
    }
    MongoDB.prototype.find = function (data, paginate) {
        if (paginate === void 0) { paginate = { limit: 20, page: 1 }; }
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, startIndex, endIndex, _a, res1, countDocument;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = paginate.page, limit = paginate.limit;
                        page <= 0 && (page = 1);
                        startIndex = (page - 1) * limit;
                        endIndex = page * limit;
                        return [4 /*yield*/, Promise.all([
                                new Promise(function (resolve, reject) {
                                    data = _this._generateFind(data);
                                    // console.log(data);
                                    // if (ObjectIDValid(data?._id || data)) {
                                    //     data = {
                                    //         _id: new ObjectId(data?._id || data)
                                    //     };
                                    // }
                                    _this.collection.find(data).skip(startIndex).limit(limit).sort({ created_at: -1 }).toArray(function (error, data) {
                                        if (error)
                                            resolve({ error: error });
                                        else
                                            resolve({ data: data });
                                    });
                                }),
                                this.collection.countDocuments(data)
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), res1 = _a[0], countDocument = _a[1];
                        paginate = model_1.renderPaginate({ page: page, limit: limit, countDocument: countDocument });
                        return [2 /*return*/, __assign(__assign({}, res1), { paginate: paginate })];
                }
            });
        });
    };
    MongoDB.prototype.findOne = function (find) {
        var ref = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            ref[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var cache;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Hook_1["default"].do_action('findOne-before', __spread([find], ref))];
                    case 1:
                        cache = (_a.sent()).cache;
                        if (cache)
                            return [2 /*return*/, { data: cache }];
                        if (typeof find === 'string') {
                            find = {
                                _id: find
                            };
                        }
                        if (typeof find._id !== 'undefined' && ObjectIDValid(find._id)) {
                            find._id = new mongodb_1.ObjectId(find._id);
                        }
                        // if (typeof find === 'string' && ObjectIDValid(find)) {
                        //     find = {
                        //         _id: ObjectID(find)
                        //     }
                        // }
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _this.collection.findOne(find, function (error, data) {
                                    if (error)
                                        resolve({ error: error });
                                    else {
                                        Hook_1["default"].do_action('findOne-after', [data]);
                                        resolve({ data: data });
                                    }
                                });
                            })];
                }
            });
        });
    };
    MongoDB.prototype.findMany = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({}).toArray()];
                    case 1:
                        data = _a.sent();
                        resolve({ data: data });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    MongoDB.prototype.insert = function () { };
    MongoDB.prototype.insertMany = function (data) {
        var _this = this;
        // if (!Array.isArray(data)) {
        //     data = [data];
        // }
        return new Promise(function (resolve, reject) {
            _this.collection.insertMany(data, function (error, data) {
                if (error) {
                    resolve({ error: error });
                }
                else {
                    resolve({ insertedCount: data.insertedCount });
                }
            });
        });
    };
    MongoDB.prototype.insertOne = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (data._id)
                    delete data._id;
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, res, error;
                        var _this = this;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, model_1._prepareDataField(data, this._fields)];
                                case 1:
                                    _a = __read.apply(void 0, [_b.sent(), 2]), res = _a[0], error = _a[1];
                                    // console.log(res, error)
                                    //     return;
                                    if (error) {
                                        resolve({ error: error });
                                    }
                                    else {
                                        this.collection.insertOne(res, function (error, res) {
                                            var _a;
                                            if (error) {
                                                if (typeof error.keyValue === 'object') {
                                                    var _b = __read(helper_1.objectIndex(error.keyValue, 0), 2), key = _b[0], value = _b[1];
                                                    resolve({
                                                        error: (_a = {},
                                                            _a[key] = _this._fields[key].validate.unique || 'This field has exists, please use another value!',
                                                            _a)
                                                    });
                                                }
                                                else {
                                                    resolve({ error: error });
                                                }
                                            }
                                            else
                                                resolve({ data: res.ops[0] });
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    MongoDB.prototype.insertOrUpdate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var f, update, _a, res, error;
                        var _this = this;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    f = this._generateFind(data);
                                    update = Object.keys(f).length > 0;
                                    return [4 /*yield*/, model_1._prepareDataField(data, this._fields, update)];
                                case 1:
                                    _a = __read.apply(void 0, [_b.sent(), 2]), res = _a[0], error = _a[1];
                                    // console.log(res, error)
                                    //     return;
                                    if (error) {
                                        resolve({ error: error });
                                    }
                                    else {
                                        if (f._id) {
                                            delete res._id;
                                            delete res.created_at;
                                            this.collection.findOneAndUpdate(f, [{ $set: res }], { "new": true, returnOriginal: false }, function (error, res) {
                                                var _a;
                                                if (error) {
                                                    if (typeof error.keyValue === 'object') {
                                                        var _b = __read(helper_1.objectIndex(error.keyValue, 0), 2), key = _b[0], value = _b[1];
                                                        resolve({
                                                            error: (_a = {},
                                                                _a[key] = _this._fields[key].validate.unique || "This field \"" + key + "\" has exists, please use another value!",
                                                                _a)
                                                        });
                                                    }
                                                    else {
                                                        resolve({ error: error });
                                                    }
                                                }
                                                else
                                                    resolve({ data: res.value });
                                            });
                                        }
                                        else {
                                            this.collection.insertOne(res, function (error, res) {
                                                var _a;
                                                console.log(error, res);
                                                if (error) {
                                                    if (typeof error.keyValue === 'object') {
                                                        var _b = __read(helper_1.objectIndex(error.keyValue, 0), 2), key = _b[0], value = _b[1];
                                                        resolve({
                                                            error: (_a = {},
                                                                _a[key] = _this._fields[key].validate.unique || "This field \"" + key + "\" has exists, please use another value!",
                                                                _a)
                                                        });
                                                    }
                                                    else {
                                                        resolve({ error: error });
                                                    }
                                                }
                                                else
                                                    resolve({ data: res.ops[0] });
                                            });
                                        }
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    MongoDB.prototype.update = function () { };
    MongoDB.prototype.findOneAndUpdate = function (find, data) {
        if (find === void 0) { find = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                find = this._generateFind(find);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.collection.findOneAndUpdate(find, [{ $set: data }], { "new": false, returnOriginal: false }, function (err, res) {
                            var _a;
                            if (err) {
                                if (typeof err.keyValue === 'object') {
                                    var _b = __read(helper_1.objectIndex(err.keyValue, 0), 2), key = _b[0], value = _b[1];
                                    resolve({
                                        error: (_a = {},
                                            _a[key] = _this._fields[key].validate.unique || "This field \"" + key + "\" has exists, please use another value!",
                                            _a)
                                    });
                                }
                                else {
                                    resolve({ error: err });
                                }
                            }
                            else
                                resolve({ data: res.value });
                        });
                    })];
            });
        });
    };
    MongoDB.prototype.updateOne = function (find, data) {
        if (find === void 0) { find = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, res, error;
                        var _this = this;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    find = this._generateFind(find);
                                    return [4 /*yield*/, model_1._prepareDataField(data, this._fields, true)];
                                case 1:
                                    _a = __read.apply(void 0, [_b.sent(), 2]), res = _a[0], error = _a[1];
                                    if (error) {
                                        resolve({ error: error });
                                    }
                                    else {
                                        delete res._id;
                                        delete res.created_at;
                                        this.collection.findOneAndUpdate(find, { $set: res }, { returnOriginal: false }, function (error, res) {
                                            var _a;
                                            if (error) {
                                                if (typeof error.keyValue === 'object') {
                                                    var _b = __read(helper_1.objectIndex(error.keyValue, 0), 2), key = _b[0], value = _b[1];
                                                    resolve({
                                                        error: (_a = {},
                                                            _a[key] = _this._fields[key].validate.unique || "This field \"" + key + "\" has exists, please use another value!",
                                                            _a)
                                                    });
                                                }
                                                else {
                                                    resolve({ error: error });
                                                }
                                            }
                                            else {
                                                Hook_1["default"].do_action('updateOne-after', [res.value]);
                                                resolve({ data: res.value });
                                            }
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    MongoDB.prototype.updateMany = function () { };
    MongoDB.prototype["delete"] = function (find) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (ObjectIDValid(find._id)) {
                            find._id = new mongodb_1.ObjectId(find._id);
                        }
                        _this.collection.deleteOne(find, function (error, obj) {
                            if (error) {
                                resolve({ error: error });
                            }
                            else {
                                resolve({ deleteCount: obj.deletedCount });
                            }
                        });
                    })
                    // return result;
                ];
            });
        });
    };
    MongoDB.prototype.deleteOne = function () { };
    MongoDB.prototype.deleteMany = function () { };
    MongoDB.prototype.createIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, i, indexObject, unique, a, err_1;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = [];
                        for (_b in this._fields)
                            _a.push(_b);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        i = _a[_i];
                        if (i === '_id')
                            return [3 /*break*/, 5];
                        indexObject = {};
                        if (this._fields[i].index) {
                            indexObject[i] = 1;
                        }
                        unique = void 0;
                        if (this._fields[i].unique) {
                            indexObject[i] = 1;
                            unique = { unique: 1 };
                        }
                        if (!(Object.keys(indexObject).length > 0 || unique)) return [3 /*break*/, 2];
                        this.collection.createIndex(indexObject, unique);
                        return [3 /*break*/, 5];
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.collection.dropIndex((_c = {}, _c[i] = 1, _c))];
                    case 3:
                        a = _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _d.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MongoDB.prototype._generateFind = function (find) {
        var _a, _b;
        if (find === void 0) { find = {}; }
        if (typeof find === 'object' && !ObjectIDValid(find) && !Array.isArray(find)) {
            for (var i in find) {
                if ((_b = (_a = this._fields) === null || _a === void 0 ? void 0 : _a[i]) === null || _b === void 0 ? void 0 : _b.relation) {
                    if (ObjectIDValid(find[i])) {
                        find[i] = new mongodb_1.ObjectId(find[i]);
                    }
                }
            }
        }
        if (typeof find === 'string') {
            find = { _id: new mongodb_1.ObjectId(find) };
        }
        else if ((find === null || find === void 0 ? void 0 : find['_id']) && Array.isArray(find === null || find === void 0 ? void 0 : find['_id'])) {
            var $in = [];
            for (var i in find) {
                if (ObjectIDValid(find[i])) {
                    $in.push(new mongodb_1.ObjectId(find[i]));
                }
            }
            find['_id'] = {
                $in: $in
            };
        }
        else if (ObjectIDValid(find['_id'])) {
            find['_id'] = new mongodb_1.ObjectId(find['_id']);
        }
        else if (Array.isArray(find)) {
            var $in = [];
            for (var i in find) {
                if (ObjectIDValid(find[i])) {
                    $in.push(new mongodb_1.ObjectId(find[i]));
                }
            }
            find = {
                _id: {
                    $in: $in
                }
            };
        }
        if (ObjectIDValid(find)) {
            find = { _id: new mongodb_1.ObjectId(find) };
        }
        console.log(find);
        return find;
    };
    return MongoDB;
}());
exports["default"] = MongoDB;
// ANCHOR: export
function getDatabase(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (_database)
                return [2 /*return*/, _database];
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    MongoClient.connect(database_1["default"].MongoDB.stringConnect, { useUnifiedTopology: true }, function (err, db) {
                        if (err)
                            throw err;
                        console.log('database created!');
                        _database = db.db(name);
                        resolve(_database);
                    });
                })];
        });
    });
}
exports.getDatabase = getDatabase;
function getModel(name, fields) {
    if (fields === void 0) { fields = {}; }
    var ref = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        ref[_i - 2] = arguments[_i];
    }
    if (name in _.instance) {
        return _.instance[name];
    }
    return new MongoDB(name, fields);
}
exports.getModel = getModel;
function getCollection(name) {
    return __awaiter(this, void 0, void 0, function () {
        var database;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDatabase()];
                case 1:
                    database = _a.sent();
                    return [2 /*return*/, database.collection(name)];
            }
        });
    });
}
exports.getCollection = getCollection;
exports.TYPE = {
    Enum: function () {
        var ref = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ref[_i] = arguments[_i];
        }
        return function (data) {
            if ([].includes.bind(ref)(data))
                return data;
            return null;
        };
    },
    Hash: function (str) {
        return crypto_1["default"].createHash('md5').update(str).digest('hex');
    }
};
function getAllModel() {
    return _.instance;
}
exports.getAllModel = getAllModel;
function ObjectIDValid(str) {
    return mongodb_1.ObjectId.isValid(str);
}
exports.ObjectIDValid = ObjectIDValid;
