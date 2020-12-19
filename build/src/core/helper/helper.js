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
exports.isEmptyObject = exports.capitalizeFirstLetter = exports.objectIndex = exports.getMethods = exports.copyObjectFields = exports.copyObjectExcept = exports.getFiles = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// let configs = getFiles('config');
// type InferValue<Prop extends PropertyKey, Desc> =
//     Desc extends { get(): any, value: any } ? never :
//     Desc extends { value: infer T } ? Record<Prop, T> :
//     Desc extends { get(): infer T } ? Record<Prop, T> : never;
// type DefineProperty<
//     Prop extends PropertyKey,
//     Desc extends PropertyDescriptor> =
//     Desc extends { writable: any, set(val: any): any } ? never :
//     Desc extends { writable: any, get(): any } ? never :
//     Desc extends { writable: false } ? Readonly<InferValue<Prop, Desc>> :
//     Desc extends { writable: true } ? InferValue<Prop, Desc> :
//     Readonly<InferValue<Prop, Desc>>
// function defineProperty<
//     Obj extends object,
//     Key extends PropertyKey,
//     PDesc extends PropertyDescriptor>
//     (obj: Obj, prop: Key, val: PDesc):
//     asserts  obj is Obj & DefineProperty<Key, PDesc> {
//     Object.defineProperty(obj, prop, val)
// }
// defineProperty(Object.prototype, 'maxValue', {
//     enumerable: false,
//     value: function (callback) {
//         if (this instanceof Array) {
//             return this.filter(callback);
//         }
//         let res = {};
//         for (let i in this) {
//             if (callback(this[i], i)) {
//                 res[i] = this[i]
//             }
//         }
//         return res;
//     }
// })
Object.defineProperty(Object.prototype, "filterFun", {
    enumerable: false,
    value: function (callback) {
        if (this instanceof Array) {
            return this.filter(callback);
        }
        var res = {};
        for (var i in this) {
            if (callback(this[i], i)) {
                res[i] = this[i];
            }
        }
        return res;
    }
});
function getFiles(dir, files_) {
    if (files_ === void 0) { files_ = []; }
    var folder = path_1["default"].resolve(dir);
    files_ = files_ || [];
    var files = fs_1["default"].readdirSync(dir);
    for (var i in files) {
        var name = folder + '/' + files[i];
        if (fs_1["default"].statSync(name).isDirectory()) {
            getFiles(name, files_);
        }
        else {
            // files_.push(files[i]);
            files_.push(dir + '/' + files[i]);
        }
    }
    return files_;
}
exports.getFiles = getFiles;
var config_store = {};
function config(name, slug) {
    if (name === void 0) { name = 'app'; }
    if (slug === void 0) { slug = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var absolutePath, rootPath, configObject, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (name in config_store) {
                        if (slug) {
                            return [2 /*return*/, config_store[name][slug]];
                        }
                        return [2 /*return*/, config_store[name]];
                    }
                    absolutePath = path_1["default"].resolve('config/' + name + '.js');
                    rootPath = 'config/' + name + '.js';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (!fs_1["default"].existsSync(rootPath)) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('file:' + absolutePath)); })];
                case 2:
                    configObject = _a.sent();
                    config_store[name] = configObject["default"];
                    if (slug) {
                        return [2 /*return*/, configObject["default"][slug]];
                    }
                    return [2 /*return*/, __assign({}, configObject["default"])];
                case 3: return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, {}];
            }
        });
    });
}
function copyObjectExcept(object, arr) {
    if (arr === void 0) { arr = []; }
    var ob = {};
    for (var i in object) {
        if (!arr.includes(i)) {
            ob[i] = object[i];
        }
    }
    return ob;
}
exports.copyObjectExcept = copyObjectExcept;
function copyObjectFields(object, fields) {
    if (fields === void 0) { fields = []; }
    var ob = {};
    for (var i in object) {
        if (fields.includes(i)) {
            ob[i] = object[i];
        }
    }
    return ob;
}
exports.copyObjectFields = copyObjectFields;
function getMethods(obj) {
    var properties = new Set();
    var currentObj = obj;
    do {
        Object.getOwnPropertyNames(currentObj).map(function (item) { return properties.add(item); });
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    return __spread(properties.keys()).filter(function (item) { return typeof obj[item] === 'function'; });
}
exports.getMethods = getMethods;
function objectIndex(obj, index) {
    if (index === void 0) { index = 0; }
    for (var i in obj) {
        if (index-- === 0)
            return [i, obj[i]];
    }
    return [];
}
exports.objectIndex = objectIndex;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
exports.isEmptyObject = isEmptyObject;
