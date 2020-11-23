// import dotenv from 'dotenv';
// dotenv.config()

export default {
    prefix: 'api',
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'RestFul API Documents',
        description: 'Management All API genenerator by Model, maked by vn-cms-rest-api',
        termsOfService: 'http://api_url/terms/',
        contact: {
            name: 'Đặng Thuyền Vương',
            email: 'dangthuyenvuong@gmail.com',
            url: 'https://dangthuyenvuong.com/'
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    /* ... */

    servers: [
        {
            url: 'http://localhost:' + process.env.PORT + '/api' ,
            description: 'Local server'
        },
        {
            url: 'https://api_url_testing/api',
            description: 'Testing server'
        },
        {
            url: 'https://api_url_production/api',
            description: 'Production server'
        }
    ],

    // tags: [],
    // paths: {},
    // components: {},
    // security: []

    
}