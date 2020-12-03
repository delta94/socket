// import swaggerJSDoc from "swagger-jsdoc";
import Hook from "../vn-cms-core/Hook.js";
import swaggerUi from 'swagger-ui-express'
import { config } from "../vn-cms-core/helper/helper.js";
import { capitalizeFirstLetter } from "../vn-cms-core/helper/helper.js";
import { getAllModel, getModel } from "../vn-cms-core/Model.js";

const type = {
    STATUS_SUCCESS: 200,
    // STATUS_CREATED: 201,
    // STATUS_NOCONTENT: 207,
    STATUS_BAD_REQUEST: 400,
    STATUS_UNAUTHORIZED: 401,
    STATUS_FORBIDEN: 403,
    STATUS_NOT_FOUND: 404,
    STATUS_SERVER_ERROR: 500,
}

let prefix = '/api';

const defaultConfig = {
    // openapi: '3.0.1',
    // info: {
    //     version: '1.0.0',
    //     title: 'RestFul API Documents',
    //     description: 'Management All API genenerator by Model, maked by vn-cms-rest-api',
    //     termsOfService: 'http://api_url/terms/',
    //     contact: {
    //         name: 'Dang Thuyen Vuong',
    //         email: 'dangthuyenvuong@gmail.com',
    //         url: 'https://dangthuyenvuong.com/'
    //     },
    //     license: {
    //         name: 'Apache 2.0',
    //         url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    //     }
    // },
    // /* ... */

    // servers: [
    //     {
    //         url: 'http://localhost:' + process.env.PORT,
    //         description: 'Local server'
    //     },
    //     {
    //         url: 'https://api_url_testing',
    //         description: 'Testing server'
    //     },
    //     {
    //         url: 'https://api_url_production',
    //         description: 'Production server'
    //     }
    // ],
    // limit: 10
}

let swaggerOptions = {
    paths: {

    }
}

async function init(app, server) {


    let configRest = await config('RESTFulAPI');
    if (configRest.prefix) {
        prefix = '/' + configRest.prefix.replace(/^\//, '')

    }


    let models = getAllModel();
    for (let i in models) {

        if (models[i].restAPI === false) continue;
        generateApiDocs(models[i])
        generateRouter(models[i], app);
    }


    app.get('/api/test', async (req, res) => {
        let User = getModel('user');
        let [users, error] = await User.find(undefined, { limit: 10000 });
        for (let i in users) {
            User.updateOne({
                id: users[i]._id + ''
            }, {
                // updated_at: Date.now(),
                // created_at: Date.now()
            })

        }

        res.json({ success: true })
    })


    swaggerOptions = {
        ...swaggerOptions,
        /* ... */

        components: {
            schemas: {
                ...(() => {
                    let object = {}
                    for (let i in models) {
                        if (models[i].restAPI === false) continue;

                        let item = {
                            type: 'object',
                            properties: {

                            }
                        };

                        for (let j in models[i]._fields) {
                            let field = models[i]._fields[j];

                            let schema = {
                                type: 'string'
                            }

                            switch (field.resolve.name) {
                                case 'String':
                                    schema.type = 'string'
                                    break;
                                case 'Number':
                                    schema.type = 'number'

                                    break;
                                case 'Date':
                                    schema.type = 'number'

                                    break;
                                case 'ModelTypeRelation':

                                    if (field.multi) {
                                        schema = {
                                            items: {
                                                $ref: '#/components/schemas/' + field.relation
                                            },
                                            type: 'array'
                                        }

                                    } else {
                                        schema.$ref = '#/components/schemas/' + field.relation;
                                    }
                                    break;
                                case 'ModelTypeList':
                                    // schema.items = {
                                    //     $ref  : '#/components/schemas/' + field.relation
                                    // }
                                    // schema.type = 'array'
                                    break;
                                case 'Enum':
                                    schema.type = 'string'
                                    schema.enum = field.enum
                                    schema.default = field.default || field.enum[0]
                                    break;
                                case 'ObjectID':
                                    schema.type = 'string'

                                default:
                                    break;
                            }

                            item.properties[j] = schema;
                        }

                        object[i] = item;
                    }

                    return object;
                })()
                // identificationNumber: {
                //     type: 'integer',
                //     description: 'User identification number',
                //     example: 1234
                // },
                // username: {
                //     type: 'string',
                //     example: 'raparicio'
                // },
                // userType: {
                //     type: 'string',
                //     // enum: USER_TYPES,
                //     // default: REGULAR
                // },
                // companyId: {
                //     type: 'integer',
                //     description: 'Company id where the user works',
                //     example: 15
                // },
                // User: {
                //     type: 'object',
                //     properties: {
                //         identificationNumber: {
                //             $ref: '#/components/schemas/identificationNumber'
                //         },
                //         username: {
                //             $ref: '#/components/schemas/username'
                //         },
                //         userType: {
                //             $ref: '#/components/schemas/userType'
                //         },
                //         companyId: {
                //             $ref: '#/components/schemas/companyId'
                //         }
                //     }
                // },
                // Users: {
                //     type: 'object',
                //     properties: {
                //         users: {
                //             type: 'array',
                //             items: {
                //                 $ref: '#/components/schemas/User'
                //             }
                //         }
                //     }
                // },
                // Error: {
                //     type: 'object',
                //     properties: {
                //         message: {
                //             type: 'string'
                //         },
                //         internal_code: {
                //             type: 'string'
                //         }
                //     }
                // }
            },
            /* ... */
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key'
                }
            }
        },
        /* ... */
        security: [
            {
                ApiKeyAuth: []
            }
        ],
        /* ... */
        ...defaultConfig,
        ...configRest
    }

    // const swaggerDocs = swaggerJSDoc(swaggerOptions)
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

}


function generateApiDocs(model) {
    let capitalName = capitalizeFirstLetter(model.name);
    // let name = model.c

    swaggerOptions.paths['/' + model.name] = {
        get: {
            tags: [model.restFulTagName || 'CRUD operations generator'],
            description: 'Get ' + model.name,
            operationId: 'get' + capitalName,
            parameters: [
                ...(() => {

                    let object = [];

                    for (let i in model._fields) {
                        let field = model._fields[i];

                        let item = {
                            name: i,
                            in: 'query'
                        }
                        let schema = {
                            type: 'string'
                        }

                        switch (field.resolve.name) {
                            case 'String':
                                schema.type = 'string'
                                break;
                            case 'Number':
                                schema.type = 'number'

                                break;
                            case 'Date':
                                schema.type = 'number'

                                break;
                            case 'ModelTypeRelation':
                                break;
                            case 'ModelTypeList':
                                break;
                            case 'Enum':
                                schema.type = 'string'
                                schema.enum = field.enum
                                schema.default = field.default || field.enum[0]
                                break;
                            case 'ObjectID':
                                schema.type = 'string'
                            default:
                                break;
                        }


                        // item.required = field.required || false;

                        object.push(item);
                    }

                    return object
                })(),
                // {
                //     name: 'x-company-id',
                //     in: 'header',
                //     schema: {
                //         $ref: '#/components/schemas/companyId'
                //     },
                //     required: true,
                //     description: 'Company id where the users work'
                // },
                // {
                //     name: 'page',
                //     in: 'query',
                //     schema: {
                //         type: 'integer',
                //         default: 1
                //     },
                //     required: false
                // },
                // {
                //     name: 'orderBy',
                //     in: 'query',
                //     schema: {
                //         type: 'string',
                //         enum: ['asc', 'desc'],
                //         default: 'asc'
                //     },
                //     required: false
                // }
            ],
            responses: {
                '200': {
                    description: 'Users were obtained',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Users'
                            }
                        }
                    }
                },
                '400': {
                    description: 'Missing parameters',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'companyId is missing',
                                internal_code: 'missing_parameters'
                            }
                        }
                    }
                }
            }
        },
        post: {
            tags: [model.restFulTagName || 'CRUD operations generator'],
            description: 'Create ' + model.name,
            operationId: 'create' + capitalName,
            parameters: [
                ...(() => {

                    let object = [];

                    for (let i in model._fields) {


                        let field = model._fields[i];

                        let item = {
                            name: i,
                            // in: 'body'
                        }
                        let schema = {
                            type: 'string'
                        }

                        switch (field.resolve.name) {
                            case 'String':
                                schema.type = 'string'
                                break;
                            case 'Number':
                                schema.type = 'number'

                                break;
                            case 'Date':
                                schema.type = 'number'

                                break;
                            case 'ModelTypeRelation':
                                item.in = field.relation;
                                break;
                            case 'ModelTypeList':
                                break;
                            case 'Enum':
                                schema.type = 'string'
                                schema.enum = field.enum
                                schema.default = field.default || field.enum[0]
                                break;
                            case 'ObjectID':
                                schema.type = 'string'
                            default:
                                break;
                        }


                        item.required = field.required || false;

                        object.push(item);
                    }

                    return object
                })(),
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Users'
                        }
                    }
                },
                required: true
            },
            responses: {
                [type.STATUS_SUCCESS]: {
                    description: `New ${model.name} were created`
                },
                [type.STATUS_BAD_REQUEST]: {
                    description: 'Invalid parameters',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'User identificationNumbers 10, 20 already exist',
                                internal_code: 'invalid_parameters'
                            }
                        }
                    }
                }
            }
        },
        put: {
            tags: [model.restFulTagName || 'CRUD operations generator'],
            description: 'Update ' + model.name,
            operationId: 'update' + capitalName,
            parameters: [],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/user'
                        }
                    }
                },
                required: true
            },
            responses: {
                [type.STATUS_SUCCESS]: {
                    description: `New ${model.name} were created`
                },
                [type.STATUS_BAD_REQUEST]: {
                    description: 'Invalid parameters',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'User identificationNumbers 10, 20 already exist',
                                internal_code: 'invalid_parameters'
                            }
                        }
                    }
                }
            }
        },
        delete: {
            tags: [model.restFulTagName || 'CRUD operations generator'],
            description: 'Delete ' + model.name,
            operationId: 'delete' + capitalName,
            parameters: [],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Users'
                        }
                    }
                },
                required: true
            },
            responses: {
                [type.STATUS_SUCCESS]: {
                    description: `New ${model.name} were created`
                },
                [type.STATUS_BAD_REQUEST]: {
                    description: 'Invalid parameters',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'User identificationNumbers 10, 20 already exist',
                                internal_code: 'invalid_parameters'
                            }
                        }
                    }
                }
            }
        }
    }
}

function generateRouter(model, app) {
    let Model = getModel(model.name);
    console.log(Model);
    app.get(prefix + '/' + model.name + '/:id?', async (req, res) => {
        if (req.params.id) {
            let [data, error] = await Model.findOne(req.params.id);
            if (error) {
                return res.status(type.STATUS_SERVER_ERROR).json({ error })
            }
            return res.json(data);
        }

        let { page = 1, limit = defaultConfig.limit } = req.query;

        let [data, error, paginate] = await Model.find(undefined, { page: parseInt(page), limit: parseInt(limit) });

        if (error) {
            return res.status(type.STATUS_SERVER_ERROR).json({ error })
        }
        res.json({ result: data, paginate });

    })

    app.post(prefix + '/' + model.name, async (req, res) => {
        let [data, error] = await Model.insertOne(req.body);
        if (error) {

            return res.status(type.STATUS_BAD_REQUEST).json({ error });
        }
        res.json(data);

    })

    app.put(prefix + '/' + model.name + '/:id', async (req, res) => {

        let [data, error] = await Model.updateOne({ id: req.params.id }, req.body);
        if (error) {

            return res.status(type.STATUS_BAD_REQUEST).json({ error });
        }
        res.json(data);

    })

    app.delete(prefix + '/' + model.name + '/:id', async (req, res) => {
        let [data, error] = await Model.delete({ id: req.params.id });
        if (error) {
            return res.status(type.STATUS_BAD_REQUEST).json({ error });
        }
        res.json(data);

    })

}

// function initModel(model){  
//     generateApiDocs(model)
//     generateRouter(model);
// }

// Hook.do_action('init-model', initModel)

Hook.add_action('before-router', init)
