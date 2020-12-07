import ModelClass, { TYPE } from "../../../core/Model.js";
class Course extends ModelClass{
    constructor(){
        super('elearning_course', {
            id: {
                unique: true,
            },
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
            // mentor: {
            //     relation: 'elearning_teacher',
            //     multi: true
            // }
        } )

        this.restFulTagName = 'Elearning API'
    }
}

export default new Course;