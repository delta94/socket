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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.renderPaginate = exports.ModelTypeRelation = exports.ModelTypeList = exports.ModelTypeObject = exports.prepareField = exports._prepareDataField = exports.MODELTYPE = void 0;
var mongodb_1 = __importDefault(require("mongodb"));
var Model_1 = require("../Model");
var ObjectID = mongodb_1["default"].ObjectID;
var defaultErrorMessage = {
    required: 'This field is require'
};
exports.MODELTYPE = {
    NORMAL: 'NORMAL',
    RELATION: 'RELATION',
    OBJECT: 'OBJECT',
    OBJECT_WITH_STRUCT: 'OBJECT_WITH_STRUCT',
    OBJECT_RELATION_KEY_ID: 'OBJECT_RELATION_KEY_ID',
    OBJECT_RELATION_MULTI_WITH_KEY_ONLEY: 'OBJECT_RELATION_MULTI_WITH_KEY_ONLEY',
    RELATION_WITH_ID: 'RELATION_WITH_ID',
    RELATION_WITH_STRUCT: 'RELATION_WITH_STRUCT',
    LIST: 'LIST',
    LIST_TYPE: 'LIST_TYPE',
    LIST_OBJECT: 'LIST_OBJECT',
    LIST_OBJECT_STRUCT: 'LIST_OBJECT_STRUCT',
    LIST_RELATION: 'LIST_RELATION'
};
function _prepareDataField(data, field, update) {
    if (update === void 0) { update = false; }
    return __awaiter(this, void 0, void 0, function () {
        var errorObject, _a, _b, _i, i, res, error, _c;
        var _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    errorObject = {};
                    _a = [];
                    for (_b in field)
                        _a.push(_b);
                    _i = 0;
                    _h.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    i = _a[_i];
                    if (i == '_id' ||
                        (update && typeof data[i] === 'undefined' && i !== 'updated_at' && i !== 'created_at')) {
                        return [3 /*break*/, 10];
                    }
                    res = void 0, error = void 0;
                    _c = field[i].type;
                    switch (_c) {
                        case exports.MODELTYPE.NORMAL: return [3 /*break*/, 2];
                        case exports.MODELTYPE.RELATION: return [3 /*break*/, 3];
                        case exports.MODELTYPE.OBJECT: return [3 /*break*/, 5];
                        case exports.MODELTYPE.LIST: return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 2:
                    _d = __read(ModelTypeNormal.bind(field[i])(data[i]), 2), res = _d[0], error = _d[1];
                    return [3 /*break*/, 9];
                case 3: return [4 /*yield*/, field[i].resolve(data[i])];
                case 4:
                    _e = __read.apply(void 0, [_h.sent(), 2]), res = _e[0], error = _e[1];
                    return [3 /*break*/, 9];
                case 5:
                    _f = __read(field[i].resolve(data[i]), 2), res = _f[0], error = _f[1];
                    return [3 /*break*/, 9];
                case 6: return [4 /*yield*/, field[i].resolve(data[i])];
                case 7:
                    _g = __read.apply(void 0, [_h.sent(), 2]), res = _g[0], error = _g[1];
                    return [3 /*break*/, 9];
                case 8: return [3 /*break*/, 9];
                case 9:
                    data[i] = res;
                    if (error) {
                        errorObject[i] = error;
                    }
                    _h.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 1];
                case 11:
                    if (!isEmptyObject(errorObject)) {
                        return [2 /*return*/, [data, errorObject]];
                    }
                    return [2 /*return*/, [data]];
            }
        });
    });
}
exports._prepareDataField = _prepareDataField;
function prepareField(fields) {
    var object = {};
    for (var i in fields) {
        // TYPE_1
        if (typeof fields[i] === 'function' ||
            (!Array.isArray(fields[i]) && typeof fields[i] === 'object') ||
            Array.isArray(fields[i]["enum"])) {
            object[i] = Type_1(fields[i]);
        }
        // TYPE_3
        if (Array.isArray(fields[i])) {
            object[i] = Type_3(fields[i]);
        }
    }
    return object;
}
exports.prepareField = prepareField;
function Enum(value) {
    if ([].includes.bind(this["enum"])(value))
        return value;
    return this["default"] || null;
}
// Only value
function Type_1(fields) {
    if (typeof fields === 'function') {
        return {
            type: exports.MODELTYPE.NORMAL,
            resolve: fields
        };
    }
    if (Array.isArray(fields["enum"])) {
        return __assign(__assign({}, fields), { type: exports.MODELTYPE.NORMAL, resolve: Enum });
    }
    if (isEmptyObject(fields)) {
        return {
            type: exports.MODELTYPE.OBJECT,
            resolve: function (arr) { return arr; }
        };
    }
    if (fields.relation) {
        return __assign(__assign({ type: exports.MODELTYPE.RELATION }, fields), { resolve: ModelTypeRelation });
    }
    if (fields.struct) {
        return __assign(__assign({ type: exports.MODELTYPE.OBJECT }, fields), { resolve: ModelTypeObject });
    }
    var type = fields.type || (function (arr) { return arr; });
    delete fields.type;
    return __assign(__assign({ type: exports.MODELTYPE.NORMAL }, fields), { resolve: type });
}
// Only list
function Type_3(fields) {
    if (fields.length === 0) {
        return {
            type: exports.MODELTYPE.LIST,
            resolve: ModelTypeList
        };
    }
    if (typeof fields[0] === 'function') {
        return {
            type: exports.MODELTYPE.LIST,
            "function": fields[0],
            resolve: ModelTypeList
        };
    }
    if (isEmptyObject(fields[0])) {
        return {
            type: exports.MODELTYPE.LIST,
            resolve: ModelTypeList
        };
    }
    if (typeof fields[0].relation === 'undefined') {
        var struct = prepareField(fields[0]);
        return {
            type: exports.MODELTYPE.LIST,
            struct: struct,
            resolve: ModelTypeList
        };
    }
    if (fields[0].relation) {
        return __assign(__assign({ type: exports.MODELTYPE.LIST }, fields[0]), { resolve: ModelTypeList });
    }
    return {
        type: exports.MODELTYPE.LIST,
        resolve: ModelTypeList
    };
}
// Only Object
function Type_2(fields) {
}
function ModelTypeNormal(data) {
    var _a;
    // console.log(data)
    if (this.required && (!data && data != 0)) {
        return [null, ((_a = this === null || this === void 0 ? void 0 : this.validate) === null || _a === void 0 ? void 0 : _a.required) || defaultErrorMessage.required];
    }
    if (typeof data === 'undefined' && this["default"]) {
        if (typeof this["default"] === 'function') {
            return [this["default"]()];
        }
        else {
            return [this["default"]];
        }
    }
    return [this.resolve(data)];
}
function ModelTypeObject(data) {
    return [data];
}
exports.ModelTypeObject = ModelTypeObject;
function ModelTypeList(data) {
    if (data) {
        if (!Array.isArray(data)) {
            data = [data];
        }
    }
    return [data];
}
exports.ModelTypeList = ModelTypeList;
function ModelTypeRelation(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_b) {
            // only _id
            // object 
            // object with _id key
            if (this.required && (!data && data != 0)) {
                return [2 /*return*/, [null, ((_a = this.validate) === null || _a === void 0 ? void 0 : _a.required) || defaultErrorMessage.required]];
            }
            if (data) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var f, _a, res, error, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (this.multi) {
                                        if (!Array.isArray(data)) {
                                            data = [data];
                                        }
                                        if (data.length > 0) {
                                            f = data.map(function (e) {
                                                if (ObjectID.isValid(e))
                                                    return new ObjectID(e);
                                                return e;
                                            });
                                            f = { _id: { $in: f } };
                                        }
                                    }
                                    else {
                                        if (ObjectID.isValid(data)) {
                                            f = { _id: new ObjectID(data) };
                                        }
                                    }
                                    if (!f) return [3 /*break*/, 2];
                                    return [4 /*yield*/, Model_1.getModel(this.relation).find(f)];
                                case 1:
                                    _b = _c.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    _b = { data: null, error: null };
                                    _c.label = 3;
                                case 3:
                                    _a = _b, res = _a.data, error = _a.error;
                                    if (res) {
                                        if (this.multi) {
                                            res = res.map(function (e) { return new ObjectID(e._id); });
                                        }
                                        else {
                                            if (res[0]) {
                                                res = new ObjectID(res[0]._id);
                                            }
                                            else {
                                                res = null;
                                            }
                                        }
                                    }
                                    if (this.required &&
                                        ((Array.isArray(res) && res.length === 0) ||
                                            !res)) {
                                        resolve([null, "Data not match with \"" + this.relation + "\" please check again"]);
                                        return [2 /*return*/];
                                    }
                                    resolve([res]);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            }
            if (this.multi) {
                return [2 /*return*/, [[]]];
            }
            return [2 /*return*/, [null]];
        });
    });
}
exports.ModelTypeRelation = ModelTypeRelation;
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
function renderPaginate(_a) {
    var _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, countDocument = _a.countDocument;
    page <= 0 && (page = 1);
    var startIndex = (page - 1) * limit;
    var endIndex = page * limit;
    var result = {
        currentPage: page,
        totalPage: Math.ceil(countDocument / limit),
        count: countDocument,
        perPage: limit
    };
    if (endIndex < countDocument) {
        result.nextPage = page + 1;
    }
    if (startIndex > 0) {
        result.previousPage = page - 1;
    }
    // result.currentPage = page;
    // result.totalPage = Math.ceil(countDocument / limit)
    // result.count = countDocument;
    // result.perPage = limit;
    return result;
}
exports.renderPaginate = renderPaginate;
