
import ModelClass, { TYPE } from "../../../core/Model.js";
class Course extends ModelClass {
    constructor() {
        super('elearning_course', {
            id: {
                unique: true,
            },
            benefits: [],
            cfd_teacher: {
                relation: 'elearning_teacher'
            },
            close_time: String,
            content: [],
            count_video: Number,
            course_status: {
                enum: ['sap-khai-giang'],
                default: 'sap-khai-giang'
            },
            khoa: Number,
            money: Number,
            course_type: {
                enum: ['offline', 'online'],
                default: 'offline'
            },
            benefits: [],
            opening_time: String,
            schedule: String,
            required: [],
            content: [],
            short_description: String,
            slug: String,
            title: String,
            visibility: {
                enum: ['publish', 'trash'],
                default: 'offline'
            },
            mentor: {
                relation: 'elearning_teacher',
                multi: true
            },
            thumbnail: {}
            // title: {
            //     type: String,
            //     required: true,
            //     // unique: true
            // },
            // teacher: {
            //     relation: 'elearning_teacher',
            //     required: true
            // },
            // cover: String,
            // price: Number,
            // short_content: String,
            // description: String,
            // open_date: Number,
            // date_count: Number,
            // close_date: Number,
            // status: {
            //     enum: ['publish' , 'ready', 'finish'],
            //     default: 'publish'
            // },
            // type: {
            //     enum: ['offline', 'online'],
            //     default: 'offline'
            // },
            // content: [
            //     // {
            //     //     name: String,
            //     //     content: String
            //     // }
            // ],
            // required: [
            //     // {
            //     //     name: String
            //     // }
            // ],
            // formula: [
            //     // {
            //     //     name: String
            //     // }
            // ],
            // schedule: {
            //     struct: {
            //         start: Number,
            //         time: String
            //     }
            // },

        })

        this.restFulTagName = 'Elearning API'
    }
}

export default new Course;