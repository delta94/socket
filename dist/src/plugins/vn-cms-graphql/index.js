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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_graphql_1 = require("express-graphql");
var graphql_1 = require("graphql");
var graphql_type_json_1 = require("graphql-type-json");
var mongodb_1 = require("mongodb");
var helper_1 = require("../../core/helper/helper");
var model_1 = require("../../core/helper/model");
var Hook_1 = __importDefault(require("../../core/Hook"));
var graphql_2 = __importDefault(require("../../config/graphql"));
var Model_1 = require("../../core/Model");
var general_1 = __importDefault(require("../../config/general"));
// const generalConfig = JSON.parse(fs.readFileSync(__dirname + '/config/general'));
// const { GraphQLJSON, GraphQLJSONObject } = graphqlType;
// let { ObjectID } = mongodb;
// const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLFloat, GraphQLBoolean, GraphQLError, GraphQLScalarType } = graphql;
// const { graphqlHTTP } = expressgraphql;
// let global_store_many = {}; 
var global_store = {}; // 
var global_args_mutation = {};
var global_field_store = {};
var global_delete_store = {};
function capFirstChild(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function createModelGraphQL(app, server) {
    var models = Model_1.getAllModel();
    models = models.filterFun(function (e) { return graphql_2["default"].list.includes(e.name); });
    for (var i in models) {
        if (models[i].graphql !== false) {
            // generateList(models[i])
            generateOne(models[i]);
            generateDeleteArgs(models[i]);
            generateFields(models[i]);
            generateArgsMutation(models[i]);
        }
    }
    var RootMutationType = generateMutation();
    var RootQueryType = generateRoot();
    var schema = new graphql_1.GraphQLSchema({
        query: RootQueryType,
        mutation: RootMutationType
    });
    app.use('/graphql', express_graphql_1.graphqlHTTP({
        schema: schema,
        graphiql: true
    }));
}
function generateRoot() {
    var _this = this;
    return new graphql_1.GraphQLObjectType({
        name: 'Query',
        description: 'Root Query',
        fields: function () {
            var object = {};
            var _loop_1 = function (i) {
                var args = global_field_store[i];
                args.id = global_field_store[i]._id;
                object[i] = {
                    type: global_store[i],
                    description: "A single " + capFirstChild(i),
                    args: args,
                    resolve: function (parent, args) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, data, error;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (args._id || args.id) {
                                        args._id = new mongodb_1.ObjectID(args._id || args.id);
                                        delete args.id;
                                    }
                                    return [4 /*yield*/, Model_1.getModel(i).findOne(args)];
                                case 1:
                                    _a = _b.sent(), data = _a.data, error = _a.error;
                                    return [2 /*return*/, data];
                            }
                        });
                    }); }
                };
                object[i + 's'] = {
                    type: new graphql_1.GraphQLObjectType({
                        name: "data" + capFirstChild(i),
                        fields: function () { return ({
                            data: {
                                type: new graphql_1.GraphQLList(global_store[i])
                            },
                            paginate: {
                                type: graphql_type_json_1.GraphQLJSON
                            }
                        }); }
                    }),
                    description: "List of all " + capFirstChild(i),
                    args: __assign(__assign({}, args), { limit: { type: graphql_1.GraphQLInt }, page: { type: graphql_1.GraphQLInt } }),
                    resolve: function (parent, args) { return __awaiter(_this, void 0, void 0, function () {
                        var limit, page, paging, _a, data, error, paginate;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    limit = args.limit, page = args.page;
                                    delete args.limit;
                                    delete args.page;
                                    paging = undefined;
                                    if (limit || page) {
                                        paging = {
                                            limit: limit || general_1["default"].limit,
                                            page: page || 0
                                        };
                                    }
                                    if (helper_1.isEmptyObject(args)) {
                                        args = {};
                                    }
                                    return [4 /*yield*/, Model_1.getModel(i).find(args, paging)];
                                case 1:
                                    _a = _b.sent(), data = _a.data, error = _a.error, paginate = _a.paginate;
                                    return [2 /*return*/, {
                                            data: data,
                                            paginate: paginate
                                        }];
                            }
                        });
                    }); }
                };
            };
            for (var i in global_store) {
                _loop_1(i);
            }
            return object;
        }
    });
}
function generateMutation() {
    var _this = this;
    return new graphql_1.GraphQLObjectType({
        name: 'Mutation',
        description: 'Root Mutation',
        fields: function () {
            var object = {};
            var _loop_2 = function (i) {
                var args = global_args_mutation[i];
                object['insertOrUpdate' + capFirstChild(i)] = {
                    type: global_store[i],
                    description: "Add 1 " + capFirstChild(i),
                    args: args,
                    resolve: function (parent, args) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, data, error;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.log(args);
                                    return [4 /*yield*/, Model_1.getModel(i).insertOrUpdate(args)];
                                case 1:
                                    _a = _b.sent(), data = _a.data, error = _a.error;
                                    if (error) {
                                        throw new graphql_1.GraphQLError(error);
                                    }
                                    return [2 /*return*/, data];
                            }
                        });
                    }); }
                };
                var argsDelete = helper_1.copyObjectExcept(global_delete_store[i]);
                object['delete' + capFirstChild(i)] = {
                    // type: global_store[i],
                    type: graphql_1.GraphQLInt,
                    description: "Delete 1 " + capFirstChild(i),
                    args: argsDelete,
                    resolve: function (parent, args) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, data, error;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.log(args);
                                    return [4 /*yield*/, Model_1.getModel(i)["delete"](args)];
                                case 1:
                                    _a = _b.sent(), data = _a.data, error = _a.error;
                                    if (error) {
                                        throw new graphql_1.GraphQLError(error);
                                    }
                                    return [2 /*return*/, data.deleteCount];
                            }
                        });
                    }); }
                };
            };
            for (var i in global_store) {
                _loop_2(i);
            }
            return object;
        }
    });
}
function generateArgsMutation(model) {
    var _fields = model._fields, name = model.name;
    global_args_mutation[name] = {};
    for (var i in _fields) {
        var FieldType = graphql_1.GraphQLString, fieldName = i, field = _fields[i];
        if (field.resolve === Number) {
            FieldType = graphql_1.GraphQLFloat;
        }
        else if (field.resolve === Boolean) {
            FieldType = graphql_1.GraphQLBoolean;
        }
        else if (field.resolve === Date) {
            FieldType = graphql_1.GraphQLInt;
        }
        else if (field.relation) {
            if (field.multi) {
                FieldType = graphql_1.GraphQLList(graphql_1.GraphQLString);
            }
            else {
                FieldType = graphql_1.GraphQLString;
            }
        }
        if (field.required) {
            FieldType = graphql_1.GraphQLNonNull(FieldType);
        }
        global_args_mutation[name][fieldName] = { type: FieldType };
    }
}
// function generateList(model) {
//     let { _fields, name } = model;
//     global_store_many[name] = new GraphQLObjectType({
//         name: model.constructor.name,
//         description: `This represents a ${model.constructor.name}`,
//         fields: () => {
//             let object = {}
//             for (let i in _fields) {
//                 let FieldType = GraphQLString,
//                     fieldName = i,
//                     field = _fields[i];
//                 if (field.resolve === Number) {
//                     FieldType = GraphQLFloat
//                 } else if (field.resolve === Boolean) {
//                     FieldType = GraphQLBoolean
//                 } else if (field.resolve === Date) {
//                     FieldType = GraphQLFloat
//                 }
//                 if (field.relation) {
//                     let type = field.multi ? GraphQLList(global_store[field.relation]) : global_store[field.relation];
//                     object[fieldName] = {
//                         type,
//                         resolve: async (parent) => {
//                             let f;
//                             if (field.multi && Array.isArray(parent[fieldName])) {
//                                 f = parent[fieldName].map(e => ObjectID(e));
//                                 f = { _id: { $in: f } };
//                             } else {
//                                 f = { _id: ObjectID(parent[fieldName]) };
//                             }
//                             let [res, error] = await getModel(field.relation).find(f);
//                             if (field.multi) {
//                                 return res
//                             } else {
//                                 return res[0] || null;
//                             }
//                         }
//                     }
//                 } else if (field.type === ModelTypeList) {
//                     if (field.relation) {
//                         object[fieldName] = {
//                             type: GraphQLList(global_store[name]),
//                             resolve: (parent) => {
//                                 console.log(parent);
//                                 return [];
//                             }
//                         }
//                     } else {
//                     }
//                 } else {
//                     object[fieldName] = { type: FieldType }
//                 }
//             }
//             return object;
//         }
//     })
// }
function generateOne(model) {
    var _this = this;
    var _fields = model._fields, name = model.name;
    global_store[name] = new graphql_1.GraphQLObjectType({
        name: model.constructor.name,
        description: "This represents a " + model.constructor.name,
        fields: function () {
            var object = {};
            var _loop_3 = function (i) {
                var FieldType = graphql_1.GraphQLString, fieldName = i, field = _fields[i];
                if (field.resolve === Number) {
                    FieldType = graphql_1.GraphQLFloat;
                }
                else if (field.resolve === Boolean) {
                    FieldType = graphql_1.GraphQLBoolean;
                }
                else if (field.resolve === Date) {
                    FieldType = graphql_1.GraphQLFloat;
                }
                else if (field.type === 'OBJECT') {
                    FieldType = graphql_type_json_1.GraphQLJSON;
                }
                else if (field.type === 'LIST') {
                    FieldType = graphql_type_json_1.GraphQLJSON;
                }
                if (field.relation) {
                    var type = field.multi ? graphql_1.GraphQLList(global_store[field.relation]) : global_store[field.relation];
                    object[fieldName] = {
                        type: type,
                        resolve: function (parent) { return __awaiter(_this, void 0, void 0, function () {
                            var f, _a, data, error;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        f = parent[fieldName];
                                        // if (field.multi && Array.isArray(parent[fieldName])) {
                                        //     f = parent[fieldName].map(e => ObjectID(e));
                                        //     f = { _id: { $in: f } };
                                        // } else {
                                        //     f = { _id: ObjectID(parent[fieldName]) };
                                        // }
                                        if (typeof f === 'undefined') {
                                            f = {};
                                        }
                                        return [4 /*yield*/, Model_1.getModel(field.relation).find(f)];
                                    case 1:
                                        _a = _b.sent(), data = _a.data, error = _a.error;
                                        if (field.multi) {
                                            return [2 /*return*/, data];
                                        }
                                        else {
                                            return [2 /*return*/, data[0] || null];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }
                    };
                }
                else if (field.type === model_1.ModelTypeList) {
                    if (field.relation) {
                        object[fieldName] = {
                            type: graphql_1.GraphQLList(global_store[name]),
                            resolve: function (parent) {
                                console.log(parent);
                                return [];
                            }
                        };
                    }
                    else {
                    }
                }
                else {
                    object[fieldName] = { type: FieldType };
                }
            };
            for (var i in _fields) {
                _loop_3(i);
            }
            return object;
        }
    });
}
function generateFields(model) {
    var _fields = model._fields, name = model.name;
    global_field_store[name] = {};
    for (var i in _fields) {
        var FieldType = graphql_1.GraphQLString, fieldName = i, field = _fields[i];
        if (field.resolve === Number) {
            FieldType = graphql_1.GraphQLFloat;
        }
        else if (field.resolve === Boolean) {
            FieldType = graphql_1.GraphQLBoolean;
        }
        else if (field.resolve === Date) {
            FieldType = graphql_1.GraphQLInt;
        }
        else if (field.relation) {
            if (field.multi) {
                FieldType = graphql_1.GraphQLList(graphql_1.GraphQLString);
            }
            else {
                FieldType = graphql_1.GraphQLString;
            }
        }
        global_field_store[name][fieldName] = { type: FieldType };
    }
}
function generateDeleteArgs(model) {
    var _fields = model._fields, name = model.name;
    global_delete_store[name] = {};
    for (var i in _fields) {
        var FieldType = graphql_1.GraphQLString, fieldName = i, field = _fields[i];
        if (field.resolve === Number) {
            FieldType = graphql_1.GraphQLFloat;
        }
        else if (field.resolve === Boolean) {
            FieldType = graphql_1.GraphQLBoolean;
        }
        else if (field.resolve === Date) {
            FieldType = graphql_1.GraphQLInt;
        }
        else if (field.relation) {
            if (field.multi) {
                FieldType = graphql_1.GraphQLList(graphql_1.GraphQLString);
            }
            else {
                FieldType = graphql_1.GraphQLString;
            }
        }
        global_delete_store[name][fieldName] = { type: FieldType };
    }
}
// function addModelToGraphQL(model) {
//     if (model.graphql !== false) {
//         let { _fields } = model;
//         let name = model.name;
//         global_store[name] = new GraphQLObjectType({
//             name: model.constructor.name,
//             description: `This represents a ${model.constructor.name}`,
//             fields: () => {
//                 let object = {}
//                 for (let i in _fields) {
//                     let FieldType = GraphQLString,
//                         fieldName = i,
//                         field = _fields[i];
//                     if (field.resolve === Number) {
//                         FieldType = GraphQLFloat
//                     } else if (field.resolve === Boolean) {
//                         FieldType = GraphQLBoolean
//                     } else if (field.resolve === Date) {
//                         FieldType = GraphQLFloat
//                     }
//                     if (field.relation) {
//                         let type = field.multi ? GraphQLList(global_store[field.relation]) : global_store[field.relation];
//                         object[fieldName] = {
//                             type,
//                             resolve: async (parent) => {
//                                 let f;
//                                 if (field.multi && Array.isArray(parent[fieldName])) {
//                                     f = parent[fieldName].map(e => ObjectID(e));
//                                     f = { _id: { $in: f } };
//                                 } else {
//                                     f = { _id: ObjectID(parent[fieldName]) };
//                                 }
//                                 let [res, error] = await getModel(field.relation).find(f);
//                                 if (field.multi) {
//                                     return res
//                                 } else {
//                                     return res[0] || null;
//                                 }
//                             }
//                         }
//                     } else if (field.type === ModelTypeList) {
//                         if (field.relation) {
//                             object[fieldName] = {
//                                 type: GraphQLList(global_store[name]),
//                                 resolve: (parent) => {
//                                     console.log(parent);
//                                     return [];
//                                 }
//                             }
//                         } else {
//                         }
//                     } else {
//                         object[fieldName] = { type: FieldType }
//                     }
//                 }
//                 return object;
//             }
//         })
//         let paginate = new GraphQLScalarType({
//             name: 'paginate',
//             serialize: value => value,
//             parseValue: value => value,
//             parseLiteral: (ast) => {
//                 if (ast.kind !== Kind.OBJECT) {
//                     throw new GraphQLError(
//                         `Query error: Can only parse object but got a: ${ast.kind}`,
//                         [ast],
//                     );
//                 }
//                 return ast.value;
//             }
//             // fields: () => ({
//             //     nextPage: { type: GraphQLInt },
//             //     previousPage: { type: GraphQLInt },
//             //     currentPage: { type: GraphQLInt },
//             //     totalPage: { type: GraphQLInt },
//             //     count: { type: GraphQLInt },
//             //     perPage: { type: GraphQLInt },
//             // })
//         })
//         global_store_many[name] = new GraphQLObjectType({
//             name: model.constructor.name,
//             description: `This represents a ${model.constructor.name}`,
//             fields: () => {
//                 let object = {}
//                 for (let i in _fields) {
//                     let FieldType = GraphQLString,
//                         fieldName = i,
//                         field = _fields[i];
//                     if (field.resolve === Number) {
//                         FieldType = GraphQLFloat
//                     } else if (field.resolve === Boolean) {
//                         FieldType = GraphQLBoolean
//                     } else if (field.resolve === Date) {
//                         FieldType = GraphQLFloat
//                     }
//                     if (field.relation) {
//                         let type = field.multi ? GraphQLList(global_store[field.relation]) : global_store[field.relation];
//                         object[fieldName] = {
//                             type,
//                             resolve: async (parent) => {
//                                 let f;
//                                 if (field.multi && Array.isArray(parent[fieldName])) {
//                                     f = parent[fieldName].map(e => ObjectID(e));
//                                     f = { _id: { $in: f } };
//                                 } else {
//                                     f = { _id: ObjectID(parent[fieldName]) };
//                                 }
//                                 let [res, error] = await getModel(field.relation).find(f);
//                                 if (field.multi) {
//                                     return res
//                                 } else {
//                                     return res[0] || null;
//                                 }
//                             }
//                         }
//                     } else if (field.type === ModelTypeList) {
//                         if (field.relation) {
//                             object[fieldName] = {
//                                 type: GraphQLList(global_store[name]),
//                                 resolve: (parent) => {
//                                     console.log(parent);
//                                     return [];
//                                 }
//                             }
//                         } else {
//                         }
//                     } else {
//                         object[fieldName] = { type: FieldType }
//                     }
//                 }
//                 object.paginate = { type: paginate }
//                 return object;
//             }
//         })
//         // This is field for Multitaion
//         global_delete_store[name] = {};
//         global_field_store[name] = {};
//         for (let i in _fields) {
//             let FieldType = GraphQLString,
//                 fieldName = i,
//                 field = _fields[i];
//             if (field.resolve === Number) {
//                 FieldType = GraphQLFloat
//             } else if (field.resolve === Boolean) {
//                 FieldType = GraphQLBoolean
//             } else if (field.resolve === Date) {
//                 FieldType = GraphQLInt
//             } else if (field.relation) {
//                 if (field.multi) {
//                     FieldType = GraphQLList(GraphQLString)
//                 } else {
//                     FieldType = GraphQLString
//                 }
//             }
//             global_delete_store[name][fieldName] = { type: FieldType }
//             if (field.required) {
//                 FieldType = GraphQLNonNull(FieldType);
//             }
//             global_field_store[name][fieldName] = { type: FieldType }
//         }
//     }
// }
// Hook.do_action('init-model', addModelToGraphQL)
Hook_1["default"].add_action('before-router', createModelGraphQL);
// ANCHOR
exports["default"] = (function () { });
