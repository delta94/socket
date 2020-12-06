import ModelClass, { TYPE } from "../../../core/Model.js";
class Course extends ModelClass{
    constructor(){
        super('elearning_course', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
            teacher: {
                relation: 'elearning_teacher',
                required: true
            },
            price: Number,
            short_content: String,
            description: String,
            open_date: Number,
            close_date: Number,
            status: {
                enum: ['publish' , 'ready', 'finish'],
                default: 'publish'
            },
            type: {
                enum: ['offline', 'online'],
                default: 'offline'
            },
            content: [
                {
                    name: String,
                    content: String
                }
            ],
            required: [
                {
                    name: String
                }
            ],
            formula: [
                {
                    name: String
                }
            ],
            schedule: {
                struct: {
                    start: Number,
                    time: String
                }
            },
        } )

        this.restFulTagName = 'Elearning API'
    }
}

export default new Course;