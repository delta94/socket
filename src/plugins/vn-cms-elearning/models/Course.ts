
import { TableName } from "..";
import ModelClass from "../../../core/Model";
class Course extends ModelClass {
    constructor() {
        super(TableName.Course, {
            id: {
                type: Number,
                unique: true,
            },
            // benefits: [],
            // cfd_teacher: {
            //     relation: TableName.Teacher
            // },
            // close_time: String,
            // content: [],
            // count_video: Number,
            // course_status: {
            //     enum: ['sap-khai-giang'],
            //     default: 'sap-khai-giang'
            // },
            // khoa: Number,
            // money: Number,
            // course_type: {
            //     enum: ['offline', 'online'],
            //     default: 'offline'
            // },
            // opening_time: String,
            // schedule: String,
            // required: [],
            // short_description: String,
            // slug: {
            //     type: String,
            //     unique: true
            // },
            // title: String,
            // visibility: {
            //     enum: ['publish', 'trash'],
            //     default: 'offline'
            // },
            // mentor: {
            //     relation: TableName.Teacher,
            //     multi: true
            // },
            // thumbnail: {}
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
    }
}

export default new Course;