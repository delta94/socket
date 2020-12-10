import expressgraphql from 'express-graphql'
import graphql from 'graphql';
import graphqlType from 'graphql-type-json';
import mongodb from 'mongodb';
import { copyObjectExcept, isEmptyObject } from '../../core/helper/helper.js';
import { ModelTypeList } from '../../core/helper/model.js';
import Hook from '../../core/Hook.js';
import graphqlConfig from '../../config/graphql.js';


import { getAllModel, getModel } from '../../core/Model.js';

const { GraphQLJSON, GraphQLJSONObject } = graphqlType;


let { ObjectID } = mongodb;

const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLFloat, GraphQLBoolean, GraphQLError, GraphQLScalarType } = graphql;
const { graphqlHTTP } = expressgraphql;


// let global_store_many = {}; 
let global_store = {}; // 
let global_args_mutation = {};
let global_field_store = {};
let global_delete_store = {};

function capFirstChild(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function createModelGraphQL(app, server) {
    let models = getAllModel();
    models = models.filterFun(e => graphqlConfig.list.includes(e.name));


    for (let i in models) {
        if (models[i].graphql !== false) {
            // generateList(models[i])
            generateOne(models[i])
            generateDeleteArgs(models[i])
            generateFields(models[i]);
            generateArgsMutation(models[i]);
        }

    }

    const RootMutationType = generateMutation();

    let RootQueryType = generateRoot();


    const schema = new GraphQLSchema({
        query: RootQueryType,
        mutation: RootMutationType,
    })

    app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true
    }))
}

function generateRoot() {
    return new GraphQLObjectType({
        name: 'Query',
        description: 'Root Query',
        fields: () => {

            let object = {}
            for (let i in global_store) {
                let args = global_field_store[i];
                args.id = global_field_store[i]._id;

                object[i] = {
                    type: global_store[i],
                    description: `A single ${capFirstChild(i)}`,
                    args,
                    resolve: async (parent, args) => {
                        if (args._id || args.id) {
                            args._id = ObjectID(args._id || args.id);
                            delete args.id;
                        }

                        let { data, error } = await getModel(i).findOne(args);

                        return data;
                    }
                }

                object[i + 's'] = {
                    type: new GraphQLObjectType({
                        name: `data${capFirstChild(i)}`,
                        fields: () => ({
                            data: {
                                type: new GraphQLList(global_store[i])
                            },
                            paginate: {
                                type: GraphQLJSON
                            }
                        })
                    }),
                    description: `List of all ${capFirstChild(i)}`,
                    args: {
                        ...args,
                        limit: { type: GraphQLInt },
                        page: { type: GraphQLInt },
                    },
                    resolve: async (parent, args) => {
                        let { limit, page } = args;
                        delete args.limit;
                        delete args.page;
                        let paging = undefined;
                        if (limit || page) {
                            paging = {
                                limit: limit || 10,
                                page: page || 10
                            }
                        }
                        if (isEmptyObject(args)) {
                            args = undefined;
                        }
                        let { data, error, paginate } = await getModel(i).find(args, paging);
                        return {
                            data,
                            paginate
                        };
                    }
                }
            }


            return object
        }
    })
}

function generateMutation() {
    return new GraphQLObjectType({
        name: 'Mutation',
        description: 'Root Mutation',
        fields: () => {
            let object = {}
            for (let i in global_store) {
                let args = global_args_mutation[i];

                object['insertOrUpdate' + capFirstChild(i)] = {
                    type: global_store[i],
                    description: `Add 1 ${capFirstChild(i)}`,
                    args,
                    resolve: async (parent, args) => {
                        console.log(args)
                        let { data, error } = await getModel(i).insertOrUpdate(args);
                        if (error) {
                            throw new GraphQLError(error);
                        }
                        return data;
                    }
                }

                let argsDelete = copyObjectExcept(global_delete_store[i]);
                object['delete' + capFirstChild(i)] = {
                    // type: global_store[i],
                    type: GraphQLInt,
                    description: `Delete 1 ${capFirstChild(i)}`,
                    args: argsDelete,
                    resolve: async (parent, args) => {
                        console.log(args)
                        let { data, error } = await getModel(i).delete(args);
                        if (error) {
                            throw new GraphQLError(error);
                        }


                        return data.deleteCount;
                    }
                }
            }


            return object

        }
    })
}
function generateArgsMutation(model) {
    let { _fields, name } = model;
    global_args_mutation[name] = {};


    for (let i in _fields) {
        let FieldType = GraphQLString,
            fieldName = i,
            field = _fields[i];


        if (field.resolve === Number) {
            FieldType = GraphQLFloat
        } else if (field.resolve === Boolean) {
            FieldType = GraphQLBoolean
        } else if (field.resolve === Date) {
            FieldType = GraphQLInt
        } else if (field.relation) {
            if (field.multi) {
                FieldType = GraphQLList(GraphQLString)
            } else {
                FieldType = GraphQLString
            }
        }



        if (field.required) {
            FieldType = GraphQLNonNull(FieldType);
        }

        global_args_mutation[name][fieldName] = { type: FieldType }
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
    let { _fields, name } = model;

    global_store[name] = new GraphQLObjectType({
        name: model.constructor.name,
        description: `This represents a ${model.constructor.name}`,
        fields: () => {
            let object = {}
            for (let i in _fields) {
                let FieldType = GraphQLString,
                    fieldName = i,
                    field = _fields[i];

                if (field.resolve === Number) {
                    FieldType = GraphQLFloat
                } else if (field.resolve === Boolean) {
                    FieldType = GraphQLBoolean
                } else if (field.resolve === Date) {
                    FieldType = GraphQLFloat
                } else if (field.type === 'OBJECT') {
                    FieldType = GraphQLJSON
                }


                if (field.relation) {
                    let type = field.multi ? GraphQLList(global_store[field.relation]) : global_store[field.relation];

                    object[fieldName] = {
                        type,
                        resolve: async (parent) => {
                            let f;
                            if (field.multi && Array.isArray(parent[fieldName])) {
                                f = parent[fieldName].map(e => ObjectID(e));
                                f = { _id: { $in: f } };
                            } else {
                                f = { _id: ObjectID(parent[fieldName]) };
                            }

                            let { data, error } = await getModel(field.relation).find(f);

                            if (field.multi) {
                                return data
                            } else {
                                return data[0] || null;
                            }
                        }
                    }

                } else if (field.type === ModelTypeList) {
                    if (field.relation) {
                        object[fieldName] = {
                            type: GraphQLList(global_store[name]),
                            resolve: (parent) => {
                                console.log(parent);
                                return [];
                            }
                        }
                    } else {

                    }
                } else {
                    object[fieldName] = { type: FieldType }
                }



            }

            return object;
        }
    })

}

function generateFields(model) {
    let { _fields, name } = model;
    global_field_store[name] = {};


    for (let i in _fields) {
        let FieldType = GraphQLString,
            fieldName = i,
            field = _fields[i];


        if (field.resolve === Number) {
            FieldType = GraphQLFloat
        } else if (field.resolve === Boolean) {
            FieldType = GraphQLBoolean
        } else if (field.resolve === Date) {
            FieldType = GraphQLInt
        } else if (field.relation) {
            if (field.multi) {
                FieldType = GraphQLList(GraphQLString)
            } else {
                FieldType = GraphQLString
            }
        }


        global_field_store[name][fieldName] = { type: FieldType }
    }
}

function generateDeleteArgs(model) {
    let { _fields, name } = model;

    global_delete_store[name] = {};

    for (let i in _fields) {
        let FieldType = GraphQLString,
            fieldName = i,
            field = _fields[i];


        if (field.resolve === Number) {
            FieldType = GraphQLFloat
        } else if (field.resolve === Boolean) {
            FieldType = GraphQLBoolean
        } else if (field.resolve === Date) {
            FieldType = GraphQLInt
        } else if (field.relation) {
            if (field.multi) {
                FieldType = GraphQLList(GraphQLString)
            } else {
                FieldType = GraphQLString
            }
        }


        global_delete_store[name][fieldName] = { type: FieldType }


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
Hook.add_action('before-router', createModelGraphQL)

// ANCHOR