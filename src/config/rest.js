// import dotenv from 'dotenv';
// dotenv.config()

export default {
    prefix: 'rest',
    rest: {
        openapi: '3.0.1',
        info: {
            version: '1.0.0',
            title: 'RestFul API Documents',
            description: 'Management All API genenerator by Model, maked by vn-cms-rest-api, <br/> accessToken: <b>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwiaWF0IjoxNjA3MzE1MDg2LCJleHAiOjIwODA2NzkwODZ9.cDPTTv6nN8z5PwBQh4EeYGGvO0rFxb_TR9wReFedtHo</b>',
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
                url: 'https://cfd-reactjs.herokuapp.com/rest',
                description: 'Production server'
            },
            {
                url: process.env.DEBUG ? 'http://localhost:' + process.env.PORT + '/rest' : 'https://cfd-reactjs.herokuapp.com/rest',
                description: process.env.DEBUG ? 'Local server' : 'Production server'
            },
        ],
    },
    list: ['user', 'elearning_course', 'elearning_teacher', 'blog_author', 'blog_category', 'blog_comment', 'blog_post', 'blog_tag', 'blog_user'],


    // tags: [],
    // paths: {},
    // components: {},
    // security: []


}