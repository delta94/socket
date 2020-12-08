// import swaggerJSDoc from "swagger-jsdoc";
import Hook from "../../core/Hook.js";
import swaggerUi from 'swagger-ui-express'
import { config } from "../../core/helper/helper.js";
import { capitalizeFirstLetter } from "../../core/helper/helper.js";
import { getAllModel, getModel } from "../../core/Model.js";
import { authenticateToken } from "../../core/Authentication.js";
import fetch from 'node-fetch'

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

let prefix = '/rest';

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

function selectSomeProperties(object, keys) {
    return Object.keys(object).reduce(function (obj, k) {
        if (keys.includes(k)) {
            obj[k] = object[k];
        }
        return obj;
    }, {});
}

async function getCourse() {
    let coins = await fetch('https://www.cfdtraining.vn/api/rest/cfd_course').then(res => res.json());

    return coins.map(e => {
        try {
            e.benefits = JSON.parse(e.benefits)
            e.mentor = JSON.parse(e.mentor)
            e.required = JSON.parse(e.required)
            e.thumbnail = JSON.parse(e.thubnail)
            if(e.course_status === 'sap-khai-gian'){
                e.course_status = 'sap-khai-giang'
            }
            if (e.thumbnail) {
                e.thumbnail.link = '//cfdtraining.vn/' + e.thumbnail.link
                if (e.thumbnail.thumbnail?.['thubnail-1']) {
                    e.thumbnail.thumbnail['thumbnail-1'] = '//cfdtraining.vn/' + e.thumbnail.thumbnail['thubnail-1']
                    delete e.thumbnail.thumbnail['thubnail-1']
                }
                if (e.thumbnail.thumbnail?.['thumbnail-2']) {
                    e.thumbnail.thumbnail['thumbnail-2'] = '//cfdtraining.vn/' + e.thumbnail.thumbnail['thumbnail-2']
                }
            }
            e.content = JSON.parse(e.content)
            e.cfd_teacher = JSON.parse(e.cfd_teacher)
        } catch (err) {

        }
        // return e
        return selectSomeProperties(e, ['benefits', 'cfd_teacher', 'close_time', 'content', 'count_video', 'course_status', 'course_type', 'created_at', 'created_time', 'id', 'khoa', 'long_description', 'mentor', 'money', 'money_affiliate_1', 'money_affiliate_2', 'number_student_default', 'opening_time', 'required', 'schedule', 'short_description', 'slug', 'thumbnail', 'title', 'visibility','template_color_btn', 'template_color_banner'])
    })
}

async function getStudent() {
    let users = await fetch('https://www.cfdtraining.vn/api/rest/cfd_student').then(res => res.json());
    return users.map(e => {
        let avatar = null;
        try {
            avatar = JSON.parse(e.avatar)
            if (avatar.thumbnail) {
                if(avatar.type_link !== 'external') {
                    avatar.link = '//cfdtraining.vn/' + avatar.link
                }

                if (avatar.thumbnail?.['thumbnail-1']) {
                    avatar.thumbnail['thumbnail-1'] = '//cfdtraining.vn/' + avatar.thumbnail['thumbnail-1']
                    // delete avatar.thumbnail['thumbnail-1']
                }
                if (avatar.thumbnail?.['thumbnail-2']) {
                    avatar.thumbnail['thumbnail-2'] = '//cfdtraining.vn/' + avatar.thumbnail['thumbnail-2']
                    // delete avatar.thumbnail['thumbnail-2']

                }
            }
            e.avatar = avatar;
        } catch (err) {

        }

        e = selectSomeProperties(e, ['title', 'avatar','id','email','phone','review','skype','student_type','total_coin_current']);
        e.password = e.email;
        return e;
    })
}

async function getTeacher() {
    let teacher = await fetch('https://www.cfdtraining.vn/api/rest/cfd_teacher').then(res => res.json());
    return teacher.map(e => {
        let avatar = null;
        try {
            avatar = JSON.parse(e.avatar)
            if (avatar.thumbnail) {
                avatar.link = '//cfdtraining.vn/' + avatar.link

                if (avatar.thumbnail?.['thubnail-1']) {
                    avatar.thumbnail['thumbnail-1'] = '//cfdtraining.vn/' + avatar.thumbnail['thubnail-1']
                    delete avatar.thumbnail['thubnail-1']
                }
                if (avatar.thumbnail?.['thubnail-2']) {
                    avatar.thumbnail['thumbnail-2'] = '//cfdtraining.vn/' + avatar.thumbnail['thubnail-2']
                    delete avatar.thumbnail['thubnail-2']
                }
            }
            e.avatar = avatar;
        } catch (err) {

        }

        // return e;

        return selectSomeProperties(e, ['avatar','description', 'id', 'position' , 'slug', 'title', 'website']);
    })
}

async function getRegister(params) {
    let data = await fetch('https://www.cfdtraining.vn/api/rest/cfd_course_register').then(res => res.json());
    return data.map(e => {
        try {
           e.attendance = JSON.parse(e.attendance)
           e.payment = JSON.parse(e.payment)
        } catch (err) {

        }

        return selectSomeProperties(e, ['id','cfd_course', 'cfd_student', 'coin_use' , 'payment', 'payment_method', 'title', 'trang_thai']);
    })
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


    app.get('/rest/generator', async (req, res) => {
        
        // Step 1
        // getModel('user').insertMany(await getStudent())
        // getModel('elearning_teacher').insertMany(await getTeacher())


        // Step 2
        let teacher = await getTeacher();
        let course = await getCourse();

        course = course.map(e => {
            e.cfd_teacher = e.cfd_teacher.map(e => teacher.find(e1 => e.id === e1.id))
            e.mentor = e.mentor.map(e => teacher.find(e1 => e.id === e1.id))

            return e;
        })


        getModel('elearning_course').insertMany(course);


        // Step 3

        // let register = await getRegister();
        // let course = await getCourse();

        // register = register.map(e => {
        //     e.cfd_course =  parseInt(e.cfd_course)
        //     e.cfd_student = parseInt(e.cfd_student)
        //     return e;
        // })
        // getModel('elearning_register').insertMany(register);


        res.json({cuss: 1});
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
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                    // name: 'Authorization'

                }
            }
        },
        /* ... */
        security: [
            {
                bearerAuth: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwiaWF0IjoxNjA3MzE1MDg2LCJleHAiOjIwODA2NzkwODZ9.cDPTTv6nN8z5PwBQh4EeYGGvO0rFxb_TR9wReFedtHo']
            }
        ],
        /* ... */
        ...defaultConfig,
        ...configRest
    }

    // const swaggerDocs = swaggerJSDoc(swaggerOptions)
    app.use('/rest-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

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
            // responses: {
            //     '200': {
            //         description: 'Users were obtained',
            //         content: {
            //             'application/json': {
            //                 schema: {
            //                     $ref: '#/components/schemas/Users'
            //                 }
            //             }
            //         }
            //     },
            //     '400': {
            //         description: 'Missing parameters',
            //         content: {
            //             'application/json': {
            //                 schema: {
            //                     $ref: '#/components/schemas/Error'
            //                 },
            //                 example: {
            //                     message: 'companyId is missing',
            //                     internal_code: 'missing_parameters'
            //                 }
            //             }
            //         }
            //     }
            // }
        },
        post: {
            tags: [model.restFulTagName || 'CRUD operations generator'],
            description: 'Create ' + model.name,
            operationId: 'create' + capitalName,
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                ...(() => {

                                    let object = {};

                                    for (let i in model._fields) {
                                        if (['_id', 'created_at', 'updated_at'].includes(i)) continue;

                                        let field = model._fields[i];

                                        let item = {
                                            // name: i,
                                            // in: 'body'
                                        }
                                        let schema = {
                                            type: 'string',
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
                                                schema.type = field.relation
                                                // item.in = field.relation;
                                                break;
                                            case 'ModelTypeList':
                                                schema.type = 'number'

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

                                        object[i] = schema;
                                    }

                                    return object
                                })(),
                            },
                        }
                    }
                },
                required: true
            },

            // requestBody: {
            //     content: {
            //         'application/json': {
            //             schema: {
            //                 $ref: '#/components/schemas/Users'
            //             }
            //         }
            //     },
            //     required: true
            // },
            // responses: {
            //     [type.STATUS_SUCCESS]: {
            //         description: `New ${model.name} were created`
            //     },
            //     [type.STATUS_BAD_REQUEST]: {
            //         description: 'Invalid parameters',
            //         content: {
            //             'application/json': {
            //                 schema: {
            //                     $ref: '#/components/schemas/Error'
            //                 },
            //                 example: {
            //                     message: 'User identificationNumbers 10, 20 already exist',
            //                     internal_code: 'invalid_parameters'
            //                 }
            //             }
            //         }
            //     }
            // }
        },
        put: {
            tags: [model.restFulTagName || 'CRUD operations generator'],
            description: 'Update ' + model.name,
            operationId: 'update' + capitalName,
            parameters: [],
            // requestBody: {
            //     content: {
            //         'application/json': {
            //             schema: {
            //                 $ref: '#/components/schemas/user'
            //             }
            //         }
            //     },
            //     required: true
            // },
            // responses: {
            //     [type.STATUS_SUCCESS]: {
            //         description: `New ${model.name} were created`
            //     },
            //     [type.STATUS_BAD_REQUEST]: {
            //         description: 'Invalid parameters',
            //         content: {
            //             'application/json': {
            //                 schema: {
            //                     $ref: '#/components/schemas/Error'
            //                 },
            //                 example: {
            //                     message: 'User identificationNumbers 10, 20 already exist',
            //                     internal_code: 'invalid_parameters'
            //                 }
            //             }
            //         }
            //     }
            // }
        },
        delete: {
            tags: [model.restFulTagName || 'CRUD operations generator'],
            description: 'Delete ' + model.name,
            operationId: 'delete' + capitalName,
            parameters: [],
            // requestBody: {
            //     content: {
            //         'application/json': {
            //             schema: {
            //                 $ref: '#/components/schemas/Users'
            //             }
            //         }
            //     },
            //     required: true
            // },
            // responses: {
            //     [type.STATUS_SUCCESS]: {
            //         description: `New ${model.name} were created`
            //     },
            //     [type.STATUS_BAD_REQUEST]: {
            //         description: 'Invalid parameters',
            //         content: {
            //             'application/json': {
            //                 schema: {
            //                     $ref: '#/components/schemas/Error'
            //                 },
            //                 example: {
            //                     message: 'User identificationNumbers 10, 20 already exist',
            //                     internal_code: 'invalid_parameters'
            //                 }
            //             }
            //         }
            //     }
            // }
        }
    }
}

function generateRouter(model, app) {
    let Model = getModel(model.name);
    app.get(prefix + '/' + model.name + '/:id?', authenticateToken, async (req, res) => {
        if (req.params.id) {
            let { data, error } = await Model.findOne(req.params.id);
            if (error) {
                return res.status(type.STATUS_SERVER_ERROR).json({ error })
            }
            return res.json(data);
        }


        let { page = 1, limit = defaultConfig.limit } = req.query,
            query = req.query;

        delete query.page;
        delete query.limit;

        for(let i in query){
            if(i in model._fields){
                if(model._fields[i].resolve.name === 'Number'){
                    query[i] = parseInt(query[i])
                }
            }
        }
        

        let { data, error, paginate } = await Model.find(query, { page: parseInt(page), limit: parseInt(limit) });

        if (error) {
            return res.status(type.STATUS_SERVER_ERROR).json({ error })
        }
        res.json({ data, paginate });


    })

    app.post(prefix + '/' + model.name, authenticateToken, async (req, res) => {
        let { data, error } = await Model.insertOne(req.body);
        if (error) {

            return res.status(type.STATUS_BAD_REQUEST).json({ error });
        }
        res.json(data);

    })

    app.put(prefix + '/' + model.name + '/:id', authenticateToken, async (req, res) => {

        let { data, error } = await Model.updateOne({ id: req.params.id }, req.body);
        if (error) {

            return res.status(type.STATUS_BAD_REQUEST).json({ error });
        }
        res.json(data);

    })

    app.delete(prefix + '/' + model.name + '/:id', authenticateToken, async (req, res) => {
        let { data, error, deleteCount } = await Model.delete({ id: req.params.id });
        if (error) {
            return res.status(type.STATUS_BAD_REQUEST).json({ error });
        }
        res.json({ deleteCount });

    })

}

// function initModel(model){  
//     generateApiDocs(model)
//     generateRouter(model);
// }

// Hook.do_action('init-model', initModel)

Hook.add_action('before-router', init)
