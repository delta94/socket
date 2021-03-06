import { graphqlHTTP } from 'express-graphql'
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLFloat, GraphQLBoolean, GraphQLError, GraphQLScalarType } from 'graphql';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';
import { ObjectID } from 'mongodb';
import { copyObjectExcept, isEmptyObject } from '../../core/helper/helper';
import { ModelTypeList } from '../../core/helper/model';
import graphqlConfig from './config';
import { getAllModel, getModel } from '../../core/Model';
import generalConfig from '../../config/general';
import App from 'app';

// const generalConfig = JSON.parse(fs.readFileSync(__dirname + '/config/general'));


// const { GraphQLJSON, GraphQLJSONObject } = graphqlType;


// let { ObjectID } = mongodb;

// const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLFloat, GraphQLBoolean, GraphQLError, GraphQLScalarType } = graphql;
// const { graphqlHTTP } = expressgraphql;


// let global_store_many = {}; 
let global_store = {}; // 
let global_args_mutation = {};
let global_field_store = {};
let global_delete_store = {};

function capFirstChild(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function createModelGraphQL(app) {
    let models = getAllModel();
    // models = models.filterFun((e) => !graphqlConfig.exclude.includes(e.name));


    for (let i in models) {
        generateOne(models[i])

        generateDeleteArgs(models[i])

        generateFields(models[i]);

        generateArgsMutation(models[i]);

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
                // args.id = global_field_store[i]._id;
                object[i] = {
                    type: global_store[i],
                    description: `A single ${capFirstChild(i)}`,
                    args,
                    resolve: async (parent, args) => {
                        if (args._id || args.id) {
                            args._id = args._id || args.id;
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

                        let paging = {
                            limit: parseInt(limit) || generalConfig.limit || 15,
                            page: parseInt(page) || 1
                        };

                        let { data, error, paginate } = await getModel(i).findMany({ ...paging, match: args });

                        // console.log( data, error, paginate)
                        // let { data, error, paginate } = await getModel(i).find(args, paging);
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
                        // let { data, error } = await getModel(i).insertOrUpdate(args);
                        // if (error) {
                        //     throw new GraphQLError(JSON.stringify(error));
                        // }
                        // return data;
                    }
                }

                let argsDelete = copyObjectExcept(global_delete_store[i]);
                object['delete' + capFirstChild(i)] = {
                    // type: global_store[i],
                    type: GraphQLInt,
                    description: `Delete 1 ${capFirstChild(i)}`,
                    args: argsDelete,
                    resolve: async (parent, args) => {
                        let { data, error, deleteCount } = await getModel(i).deleteOne(args);
                        if (error) {
                            throw new GraphQLError(JSON.stringify(error));
                        }


                        return deleteCount;
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
        let FieldType: any = GraphQLString,
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
                } else if (field.type === 'LIST') {
                    FieldType = GraphQLJSON
                }


                if (field.relation) {
                    let type = field.multi ? GraphQLList(global_store[field.relation]) : global_store[field.relation];

                    object[fieldName] = {
                        type,
                        resolve: async (parent) => {
                            let f = parent[fieldName] || {};
                            if (f) {
                                let { data, error } = await getModel(field.relation).findMany({ match: f });
                                if (error) {
                                    throw new GraphQLError(JSON.stringify(error));
                                } else if (Array.isArray(data)) {
                                    if (field.multi) {
                                        return data
                                    }

                                    return data[0] || null;
                                }
                            }

                            return null

                        }
                    }

                } else if (field.type === ModelTypeList) {
                    if (field.relation) {
                        object[fieldName] = {
                            type: GraphQLList(global_store[name]),
                            resolve: (parent) => {
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
        let FieldType: any = GraphQLString,
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
        let FieldType: any = GraphQLString,
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

createModelGraphQL(App)
